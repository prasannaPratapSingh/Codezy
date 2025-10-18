import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl">
          <span className="loading loading-spinner loading-lg text-blue-500"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl max-w-md">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-200 font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">
            Problem Management
          </h1>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-850">
                <th className="p-5 text-left text-blue-400 font-medium">#</th>
                <th className="p-5 text-left text-blue-400 font-medium">Title</th>
                <th className="p-5 text-left text-blue-400 font-medium">Difficulty</th>
                <th className="p-5 text-left text-blue-400 font-medium">Tags</th>
                <th className="p-5 text-left text-blue-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem._id} className="hover:bg-gray-750 transition-colors border-b border-gray-700 last:border-0">
                  <td className="p-5 text-gray-300">{index + 1}</td>
                  <td className="p-5 text-gray-100 font-medium">{problem.title}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      problem.difficulty === 'Easy' 
                        ? 'bg-green-900/80 text-green-400' 
                        : problem.difficulty === 'Medium' 
                          ? 'bg-yellow-900/80 text-yellow-400' 
                          : 'bg-red-900/80 text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-blue-400 border border-gray-600">
                      {problem.tags}
                    </span>
                  </td>
                  <td className="p-5">
                    <button 
                      onClick={() => handleDelete(problem._id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-blue-500/20 border border-blue-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {problems.length === 0 && (
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-center mt-8 border border-gray-700">
            <p className="text-gray-400 text-lg">No problems found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelete;