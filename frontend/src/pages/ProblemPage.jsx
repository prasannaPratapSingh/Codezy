import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory";
import { BotMessageSquare, Code, FileText, Trophy, Clock, Monitor, Play, Send } from 'lucide-react';
import ChatAi from "../components/ChatAi";
import Editorial from '../components/Editorial';
import toast from "react-hot-toast";
import socket from "../socket/socket";
import { useSelector } from 'react-redux';


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [status, setStatus] = useState(() => {
    return localStorage.getItem('testButtonDisabled') === 'true';
  });
  const [counting, setCounting] = useState(() => {
    const savedCount = localStorage.getItem('remainingTestUses');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  const { user } = useSelector((state) => state.auth);



  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowLeftPanel(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleCount = async () => {
    try {
      const response = await axiosClient.post('/feature/check');
      const { usageCount, remainingUses } = response.data;
      console.log("Success response:", usageCount);
      setCounting(remainingUses);
      if (usageCount >= 2) {
        setStatus(true);
      }
    }
    catch (err) {
      console.log("Error caught:", err.response?.status); // Add this
      if (err.response?.status === 403) {
        setStatus(true);
        console.log("Button disabled due to 403"); // Add this
      }
      console.log(err);
    }
  }

  // Check initial feature status on component mount

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);

        const initialCode = response.data.startCode.find((sc) => {
          if (sc.language == "C++" && selectedLanguage == 'c++')
            return true;
          else if (sc.language == "Java" && selectedLanguage == 'java')
            return true;
          else if (sc.language == "Javascript" && selectedLanguage == 'javascript')
            return true;
          return false;
        })?.initialCode || 'Hello';

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === selectedLanguage)?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  useEffect(() => {
    localStorage.setItem('testButtonDisabled', status.toString());
  }, [status]);

  // Update localStorage whenever counting changes
  useEffect(() => {
    localStorage.setItem('remainingTestUses', counting.toString());
  }, [counting]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      if (isMobile) setShowLeftPanel(false);

    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
      if (isMobile) setShowLeftPanel(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
      if (isMobile) setShowLeftPanel(false);
      if (response.data.accepted) {
        toast.success('Problem Solved');
        socket.emit('problem-solved', {
          problemTitle: response.data.problemTitle,
          username: user?.firstName
        })
      }
      

    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
      if (isMobile) setShowLeftPanel(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'c++';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-900/30 border-green-700/40 text-green-300';
      case 'medium': return 'bg-yellow-900/30 border-yellow-700/40 text-yellow-300';
      case 'hard': return 'bg-red-900/30 border-red-700/40 text-red-300';
      default: return 'bg-gray-700/30 border-gray-600/40 text-gray-300';
    }
  };

  const leftTabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'editorial', label: 'Editorial', icon: FileText },
    { id: 'solutions', label: 'Solutions', icon: Code },
    { id: 'submissions', label: 'Submissions', icon: Trophy },
    { id: 'generate', label: 'GENERATE', icon: BotMessageSquare }
  ];

  const rightTabs = [
    { id: 'code', label: 'Code', icon: Code },
    { id: 'testcase', label: 'Testcase', icon: Monitor },
    { id: 'result', label: 'Result', icon: Trophy }
  ];

  if (loading && !problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex justify-center items-center">
        <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-gray-300 mt-4 text-center">Loading problem...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="backdrop-blur-xl bg-black/40 border border-gray-700/40 p-2 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            {showLeftPanel ? <Code size={20} /> : <FileText size={20} />}
          </button>
        </div>
      )}

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-screen`}>
        {/* Left Panel */}
        <div className={`
          ${isMobile ? (showLeftPanel ? 'flex' : 'hidden') : 'flex'} 
          ${isMobile ? 'w-full h-screen' : 'w-1/2'} 
          flex-col border-r border-gray-700/30
        `}>
          {/* Left Tabs */}
          <div className="backdrop-blur-xl bg-black/20 border-b border-gray-700/30 p-2">
            <div className="flex overflow-x-auto scrollbar-hide">
              {leftTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${activeLeftTab === id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                    }`}
                  onClick={() => setActiveLeftTab(id)}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <h1 className="text-xl sm:text-2xl font-bold text-white">{problem.title}</h1>
                      <div className="flex gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 border border-blue-700/40 text-blue-300">
                          {problem.tags}
                        </div>
                        {problem.generatedBy == 'ai' && (
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 border border-green-700/40 text-blue-300">
                            AI 🤖
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4 sm:p-6">
                      <div className="text-sm sm:text-base leading-relaxed text-gray-200 whitespace-pre-wrap">
                        {problem.description}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-white">Examples:</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases?.map((example, index) => (
                          <div key={index} className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4">
                            <h4 className="font-semibold mb-3 text-blue-300">Example {index + 1}:</h4>
                            <div className="space-y-2 text-sm font-mono">
                              <div className="bg-gray-900/50 p-2 rounded"><strong className="text-gray-300">Input:</strong> <span className="text-green-300">{example.input}</span></div>
                              <div className="bg-gray-900/50 p-2 rounded"><strong className="text-gray-300">Output:</strong> <span className="text-blue-300">{example.output}</span></div>
                              <div className="bg-gray-900/50 p-2 rounded"><strong className="text-gray-300">Explanation:</strong> <span className="text-gray-200">{example.explanation}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Editorial</h2>
                    <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4 sm:p-6">
                      <Editorial secureUrl={problem?.secureUrl} thumbnailUrl={problem?.thumbnailUrl} duration={problem?.duration} />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Solutions</h2>
                    <div className="space-y-4">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl overflow-hidden">
                          <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700/30">
                            <h3 className="font-semibold text-blue-300">{problem?.title} - {solution?.language}</h3>
                          </div>
                          <div className="p-4">
                            <pre className="bg-gray-900/80 p-4 rounded text-xs sm:text-sm overflow-x-auto text-gray-200">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || <p className="text-gray-400 text-center py-8">Solutions will be available after you solve the problem.</p>}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white text-center">My Submissions</h2>
                    <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'generate' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Generate Problem</h2>
                    <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4">
                      <ChatAi></ChatAi>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className={`
          ${isMobile ? (showLeftPanel ? 'hidden' : 'flex') : 'flex'} 
          ${isMobile ? 'w-full h-screen' : 'w-1/2'} 
          flex-col
        `}>
          {/* Right Tabs */}
          <div className="backdrop-blur-xl bg-black/20 border-b border-gray-700/30 p-2">
            <div className="flex gap-1">
              {rightTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${activeRightTab === id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                    }`}
                  onClick={() => setActiveRightTab(id)}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col">
            {activeRightTab === 'code' && (
              <div className="flex-1 flex flex-col h-full">
                {/* Language Selector */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700/30 gap-4">
                  <div className="flex gap-2 flex-wrap">
                    {['javascript', 'java', 'c++'].map((lang) => (
                      <button
                        key={lang}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedLanguage === lang
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          : 'bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:text-gray-200 hover:bg-gray-700/30'
                          }`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang === 'c++' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 bg-gray-950 h-full">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: isMobile ? 12 : 14,
                      minimap: { enabled: !isMobile },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,

                          // Mobile-specific fixes
                      mouseStyle: 'default',
                      disableMonospaceOptimizations: true,
                      scrollbar: {
                      alwaysConsumeMouseWheel: false,
                      vertical: isMobile ? 'visible' : 'auto',
                      horizontal: isMobile ? 'visible' : 'auto',
                      useShadows: false,
                      verticalScrollbarSize: isMobile ? 10 : 6,
                      horizontalScrollbarSize: isMobile ? 10 : 6,
                      },
                      overviewRulerBorder: false,
                      hideCursorInOverviewRuler: true,
                      // Prevent unwanted touch behaviors
                      contextmenu: false,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-700/30 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <button
                    className="px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200 text-sm"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>

                  <div className="flex gap-2">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleRun}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Play size={16} />
                      )}
                      Run
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all duration-200 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleSubmitCode}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send size={16} />
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
                  <Monitor size={20} />
                  Test Results
                </h3>
                {runResult ? (
                  <div className={`backdrop-blur-xl border rounded-xl p-4 ${runResult.success ? 'bg-green-900/20 border-green-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
                    <div>
                      {runResult.success ? (
                        <div className="space-y-4">
                          <h4 className="font-bold text-green-300 flex items-center gap-2">
                            <span className="text-xl">✅</span>
                            All test cases passed!
                          </h4>
                          <div className="flex gap-4 text-sm">
                            <p className="flex items-center gap-1">
                              <Clock size={16} />
                              Runtime: {runResult.runtime + " sec"}
                            </p>
                            <p>Memory: {runResult.memory + " KB"}</p>
                          </div>

                          <div className="space-y-3">
                            {runResult?.testCases?.map((tc, i) => (
                              <div key={i} className="bg-gray-900/50 p-3 rounded-lg text-xs sm:text-sm">
                                <div className="font-mono space-y-1">
                                  <div><strong className="text-gray-300">Input:</strong> <span className="text-green-300">{tc.stdin}</span></div>
                                  <div><strong className="text-gray-300">Expected:</strong> <span className="text-blue-300">{tc.expected_output}</span></div>
                                  <div><strong className="text-gray-300">Output:</strong> <span className="text-green-300">{tc.stdout}</span></div>
                                  <div className="text-green-400 font-medium">✓ Passed</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="font-bold text-red-300 flex items-center gap-2">
                            <span className="text-xl">❌</span>
                            Error
                          </h4>
                          <div className="space-y-3">
                            {runResult?.testCases?.map((tc, i) => (
                              <div key={i} className="bg-gray-900/50 p-3 rounded-lg text-xs sm:text-sm">
                                <div className="font-mono space-y-1">
                                  <div><strong className="text-gray-300">Input:</strong> <span className="text-green-300">{tc.stdin}</span></div>
                                  <div><strong className="text-gray-300">Expected:</strong> <span className="text-blue-300">{tc.expected_output}</span></div>
                                  <div><strong className="text-gray-300">Output:</strong> <span className="text-red-300">{tc.stdout}</span></div>
                                  <div className={`font-medium ${tc.status_id == 3 ? 'text-green-400' : 'text-red-400'}`}>
                                    {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <p className="text-gray-400">Click "Run" to test your code with the example test cases.</p>
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
                  <Trophy size={20} />
                  Submission Result
                </h3>
                {submitResult ? (
                  <div className={`backdrop-blur-xl border rounded-xl p-4 ${submitResult.accepted ? 'bg-green-900/20 border-green-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
                    <div>
                      {submitResult?.accepted ? (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg text-green-300 flex items-center gap-2">
                            <span className="text-2xl">🎉</span>
                            Accepted
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>Test Cases Passed: <span className="font-bold text-green-300">{submitResult?.passedTestCases}/{submitResult?.totalTestCases}</span></p>
                            <p>Runtime: <span className="font-bold">{submitResult?.runtime + " sec"}</span></p>
                            <p>Memory: <span className="font-bold">{submitResult?.memory + "KB"}</span></p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg text-red-300 flex items-center gap-2">
                            <span className="text-2xl">❌</span>
                            {submitResult.error}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>Test Cases Passed: <span className="font-bold text-red-300">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-gray-400">Click "Submit" to submit your solution for evaluation.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
