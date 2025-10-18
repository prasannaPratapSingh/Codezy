import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { NavLink } from 'react-router';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error.response.data.error}</span>
        </div>
      </div>
    );
  }

 return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2">Video Upload and Delete</h1>
              <p className="text-gray-400">Manage video content for coding problems</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Total Problems:</span>
              <span className="px-3 py-1 bg-blue-600/40 text-blue-100 rounded-full text-sm font-medium">
                {problems.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600/20 bg-gray-800/20">
                  <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide w-16">
                    #
                  </th>
                  <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide w-32">
                    Difficulty
                  </th>
                  <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide w-32">
                    Tags
                  </th>
                  <th className="text-left p-4 text-gray-300 font-semibold text-sm uppercase tracking-wide w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr 
                    key={problem._id} 
                    className="border-b border-gray-600/10 hover:bg-gray-800/20 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <span className="flex items-center justify-center w-8 h-8 bg-gray-700/40 text-gray-300 rounded-lg text-sm font-medium">
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-gray-100 font-medium text-base">
                          {problem.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty === 'Easy' 
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                          : problem.difficulty === 'Medium' 
                            ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30' 
                            : 'bg-red-600/20 text-red-400 border border-red-500/30'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
                        {problem.tags}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <NavLink 
                          to={`/admin/upload/${problem._id}`}
                          className="px-4 py-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/40 hover:border-blue-400/60 text-blue-100 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span>Upload</span>
                        </NavLink>
                        <button 
                          onClick={() => handleDelete(problem._id)}
                          className="px-4 py-2 bg-red-600/40 hover:bg-red-600/60 border border-red-500/40 hover:border-red-400/60 text-red-100 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {problems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-700/40 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M9 8h6M9 12h6M9 16h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Problems Found</h3>
              <p className="text-gray-500 text-center">Start by creating some coding problems to manage their videos.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Use the Upload button to add video content for each problem, or Delete to remove problems entirely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;