import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosClient from "../utils/axiosClient";
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

  const editorRef = useRef(null);
  const { problemId } = useParams();
  const { user } = useSelector((state) => state.auth);

  /* -------------------- RESPONSIVE -------------------- */
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
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
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
      }
    } catch {
      setSubmitResult(null);
    } finally {
      setLoading(false);
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
    { id: 'generate', label: 'GENERATE', icon: BotMessageSquare }
  ];

  const rightTabs = [
    { id: 'code', label: 'Code', icon: Code },
    { id: 'testcase', label: 'Testcase', icon: Monitor },
    { id: 'result', label: 'Result', icon: Trophy }
  ];

  if (loading && !problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-spin w-10 h-10 border-b-2 border-blue-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">
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

          {/* Left Content — UNCHANGED STYLING */}
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

                {activeLeftTab === 'editorial' && <Editorial />}
                {activeLeftTab === 'solutions' &&
                  problem.referenceSolution?.map((solution, i) => (
                    <pre key={i} className="bg-gray-900/80 p-4 rounded mb-4">
                      {solution.completeCode}
                    </pre>
                  ))
                }
                {activeLeftTab === 'submissions' && (
                  <SubmissionHistory problemId={problemId} />
                )}
                {activeLeftTab === 'generate' && <ChatAi />}
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

              <div className="flex-1 bg-gray-950 overflow-hidden">
                {isMobile ? (
                  <textarea
                    className="w-full h-full bg-gray-900 text-gray-200 p-3 font-mono text-sm outline-none resize-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                ) : (
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    theme="vs-dark"
                    onChange={(v) => setCode(v || '')}
                    options={{ automaticLayout: true, wordWrap: 'on' }}
                  />
                )}
              </div>

              <div className="p-4 border-t border-gray-700/30 flex justify-end gap-2">
                <button
                  onClick={handleRun}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-gray-300 hover:text-white"
                >
                  <Play size={16} /> Run
                </button>
                <button
                  onClick={handleSubmitCode}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:bg-blue-500/30"
                >
                  <Send size={16} /> Submit
                </button>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              {runResult ? JSON.stringify(runResult, null, 2) : 'Run to see output'}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              {submitResult ? JSON.stringify(submitResult, null, 2) : 'Submit to see result'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
