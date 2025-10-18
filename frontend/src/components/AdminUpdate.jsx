import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { NavLink } from 'react-router';

const AdminDelete = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex justify-center items-center">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-white rounded-full animate-spin"></div>
            <span className="text-white font-semibold text-lg">Loading problems...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex justify-center items-center">
        <div className="bg-red-900/30 backdrop-blur-sm border border-red-800/50 rounded-2xl p-8 shadow-2xl max-w-md">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-red-400 flex-shrink-0 h-8 w-8" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300 font-semibold text-lg">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-white">Manage Problems</h1>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-600/50">
                <tr>
                  <th className="w-1/12 px-6 py-4 text-left text-white font-bold text-lg">#</th>
                  <th className="w-4/12 px-6 py-4 text-left text-white font-bold text-lg">Title</th>
                  <th className="w-2/12 px-6 py-4 text-left text-white font-bold text-lg">Difficulty</th>
                  <th className="w-3/12 px-6 py-4 text-left text-white font-bold text-lg">Tags</th>
                  <th className="w-2/12 px-6 py-4 text-left text-white font-bold text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-300">
                    <th className="px-6 py-4 text-gray-300 font-semibold">{index + 1}</th>
                    <td className="px-6 py-4 text-white font-medium">{problem.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        problem.difficulty === 'Easy'
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                          : problem.difficulty === 'Medium'
                            ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-600/20 text-red-400 border border-red-500/30'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-600/20 text-purple-400 border border-purple-500/30">
                        {problem.tags}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <NavLink to={`/admin/update/final/${problem._id}`}>
                          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            Update
                          </button>
                        </NavLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;