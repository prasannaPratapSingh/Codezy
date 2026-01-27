import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import { BotMessageSquare, Code, FileText, Trophy, Clock, Monitor, Play, Send, Loader2, MessageSquare } from 'lucide-react';
import ChatAi from "../components/ChatAi";
import Editorial from '../components/Editorial';
import toast from "react-hot-toast";
import socket from "../socket/socket";
import { useSelector } from 'react-redux';
import Comment from '../components/Comment';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti';
import { set } from 'react-hook-form';
import { AlertCircle } from "lucide-react";

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
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { width, height } = useWindowSize();


  const editorRef = useRef(null);
  const { problemId } = useParams();
  const { user } = useSelector((state) => state.auth);

  /* -------------------- RESPONSIVE -------------------- */

  const toggleConfetti = () => {
    setTimeout(() => {
      setToggle(false);
    }, (7000));
  }

  useEffect(() => {
    toggleConfetti();
  }, [toggle])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  /* -------------------- FETCH PROBLEM -------------------- */
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response.data);

        const initialCode =
          response.data.startCode.find(sc =>
            sc.language.toLowerCase() === selectedLanguage
          )?.initialCode || '';

        setCode(initialCode);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (!problem) return;
    const initialCode =
      problem.startCode.find(sc =>
        sc.language.toLowerCase() === selectedLanguage
      )?.initialCode || '';
    setCode(initialCode);
  }, [selectedLanguage, problem]);

  /* -------------------- ACTIONS -------------------- */
  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const res = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(res.data);
      setActiveRightTab('testcase');
    } catch {
      setRunResult({ success: false });
      setActiveRightTab('testcase');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(res.data);
      setActiveRightTab('result');

      if (res.data.accepted) {
        toast.success('Problem Solved');
        socket.emit('problem-solved', {
          problemTitle: res.data.problemTitle,
          username: user?.firstName
        });
        setToggle(true);
      }
    } catch {
      setSubmitResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'java': return 'java';
      case 'c++': return 'cpp';
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
    { id: 'generate', label: 'GENERATE', icon: BotMessageSquare },
    { id: 'comments', label: 'Discussion', icon: MessageSquare }
  ];

  const rightTabs = [
    { id: 'code', label: 'Code', icon: Code },
    { id: 'testcase', label: 'Testcase', icon: Monitor },
    { id: 'result', label: 'Result', icon: Trophy }
  ];

  if (loading && !problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-2xl p-8">
          <div className="animate-spin w-12 h-12 border-b-2 border-blue-400 rounded-full mx-auto" />
          <p className="text-gray-300 mt-4 text-center">Loading problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
      {toggle && <Confetti
        width={width}
        height={height}
        colors={[
          '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF', '#B3E5FC', '#81D4FA', '#4FC3F7'
        ]}
      />}
      <div className={`flex h-full ${isMobile ? 'flex-col' : 'flex-row'}`}>

        {/* ================= LEFT PANEL (QUESTION) ================= */}
        <div
          className={`
            flex flex-col border-r border-gray-700/30
            ${isMobile ? 'w-full max-h-[45vh]' : 'w-1/2 h-full'}
            overflow-y-auto
          `}
        >
          {/* Left Tabs */}
          <div className="backdrop-blur-xl bg-black/20 border-b border-gray-700/30 p-2">
            <div className="flex overflow-x-auto scrollbar-hide">
              {leftTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveLeftTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap
                    ${activeLeftTab === id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                    }`}
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
                      <h1 className="text-xl sm:text-2xl font-bold text-white">
                        {problem.title}
                      </h1>

                      <div className="flex gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                        </div>

                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 border border-blue-700/40 text-blue-300">
                          {problem.tags}
                        </div>

                        {problem.generatedBy === 'ai' && (
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
                      <h3 className="text-lg font-semibold mb-4 text-white">
                        Examples:
                      </h3>

                      <div className="space-y-4">
                        {problem.visibleTestCases?.map((example, index) => (
                          <div
                            key={index}
                            className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4"
                          >
                            <h4 className="font-semibold mb-3 text-blue-300">
                              Example {index + 1}:
                            </h4>

                            <div className="space-y-2 text-sm font-mono">
                              <div className="bg-gray-900/50 p-2 rounded">
                                <strong className="text-gray-300">Input:</strong>{' '}
                                <span className="text-green-300">{example.input}</span>
                              </div>

                              <div className="bg-gray-900/50 p-2 rounded">
                                <strong className="text-gray-300">Output:</strong>{' '}
                                <span className="text-blue-300">{example.output}</span>
                              </div>

                              <div className="bg-gray-900/50 p-2 rounded">
                                <strong className="text-gray-300">Explanation:</strong>{' '}
                                <span className="text-gray-200">{example.explanation}</span>
                              </div>
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
                      <ChatAi />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'comments' && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Comments</h2>
                    <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-4">
                      <Comment problemId={problemId} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL (EDITOR) ================= */}
        <div
          className={`
            flex flex-col
            ${isMobile ? 'w-full flex-1' : 'w-1/2 h-full'}
            overflow-hidden
          `}
        >
          {/* Right Tabs */}
          <div className="backdrop-blur-xl bg-black/20 border-b border-gray-700/30 p-2">
            <div className="flex gap-1">
              {rightTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveRightTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium
                    ${activeRightTab === id
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                    }`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-700/30 flex gap-2 flex-wrap">
                {['javascript', 'java', 'c++'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium
                      ${selectedLanguage === lang
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        : 'bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:text-gray-200'
                      }`}
                  >
                    {lang === 'c++' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                  </button>
                ))}
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-700 mx-auto p-3 m-5 rounded-sm sm:flex gap-2 hidden ">
              <AlertCircle className="h-5 w-5 text-orange-700 mt-0.5" />
                  Please don't change the function name or signature provided in the starter code.
              </div>

              <div className="flex-1 bg-gray-950 overflow-hidden">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  theme="vs-dark"
                  onChange={(v) => setCode(v || '')}
                  options={{ automaticLayout: true, wordWrap: 'on' }}
                />
                )
              </div>

              <div className="p-4 border-t border-gray-700/30 flex justify-between gap-2">
                <button
                  onClick={() => setActiveRightTab('testcase')}
                  className="px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200 text-sm"
                >
                  Console
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className={`flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all duration-200 text-sm ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Run
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSubmitCode}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all duration-200 text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit
                      </>
                    )}
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
              {isRunning ? (
                <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-8 text-center">
                  <Loader2 size={40} className="animate-spin text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">Running your code...</p>
                </div>
              ) : runResult ? (
                <div className={`backdrop-blur-xl border rounded-xl p-4 ${runResult.success ? 'bg-green-900/20 border-green-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
                  {runResult.success ? (
                    <div className="space-y-4">
                      <h4 className="font-bold text-green-300 flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        All test cases passed!
                      </h4>
                      <div className="flex gap-4 text-sm">
                        <p className="flex items-center gap-1">
                          <Clock size={16} />
                          Runtime: {runResult.runtime} sec
                        </p>
                        <p>Memory: {runResult.memory} KB</p>
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
                              <div className={`font-medium ${tc.status_id === 3 ? 'text-green-400' : 'text-red-400'}`}>
                                {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
              {isSubmitting ? (
                <div className="backdrop-blur-xl bg-black/20 border border-gray-700/30 rounded-xl p-8 text-center">
                  <Loader2 size={40} className="animate-spin text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">Submitting your solution...</p>
                </div>
              ) : submitResult ? (
                <div className={`backdrop-blur-xl border rounded-xl p-4 ${submitResult.accepted ? 'bg-green-900/20 border-green-700/40' : 'bg-red-900/20 border-red-700/40'}`}>
                  {submitResult.accepted ? (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-green-300 flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        All test cases passed!
                      </h4>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-red-300 flex items-center gap-2">
                        <span className="text-2xl">❌</span>
                        Some or all test cases failed.
                      </h4>
                    </div>
                  )}
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
  );
};

export default ProblemPage;