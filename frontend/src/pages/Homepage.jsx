import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { Search } from 'lucide-react';


function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [fetchPorfile, setfetchProfile] = useState();
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await axiosClient.get('/profile/url');
        const { secureUrl } = response.data;
        setfetchProfile(secureUrl);
      }
      catch (err) {
        console.error("Error aa gaya re", err);
        setfetchProfile(null);
      }
    }
    fetchUrl();
  }, [])

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));

    const searchMatch = !search || problem.title.toLowerCase().includes(search.toLowerCase());

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });





  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(3, 6, 167, 0.25), transparent 70%), #000000",
      }}>
      {/* Navigation Bar */}
      < nav className="navbar px-4 bg-blue/20 backdrop-blur-xs fixed z-1000" >
        <div className="flex-1">
          <NavLink to="/actualhome" className="btn btn-ghost text-xl text-white">Codezy</NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost p-2 sm:text-[20px] overflow-hidden rounded-full w-10 h-10 sm:w-20 sm:h-20">
              <img className='rounded-full' src={fetchPorfile} alt="?" />
            </div>
            <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-white">
              <li><button onClick={handleLogout} className='text-black'>Logout</button></li>
              {user?.role === 'admin' && <li><NavLink to='/admin'>Admin</NavLink></li>}
              <li><NavLink to={'/profile'} className='text-black'>Profile</NavLink></li>
            </ul>
          </div>
        </div>
      </nav >

      {/* Main Content */}
      < div className="relative z-10 container mx-auto px-6 py-8 top-20 mb-20" >
        {/* Header Section */}
        < div className="text-center mb-12" >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.firstName}</span>!
          </h1>
          <p className="text-gray-400 text-lg">Continue your coding journey with our curated problems</p>
        </div >

        {/* Filters Section */}
        < div className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-3xl p-6 mb-8 shadow-2xl" >
          <div className="relative mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-xl bg-gray-900/40 border border-gray-600/30 rounded-2xl overflow-hidden hover:border-gray-500/50 transition-all duration-300">
                <div className="flex items-center px-4 py-3">
                  <Search
                  />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    className="flex-1 bg-transparent border-none outline-none px-4 text-gray-100 placeholder-gray-500 text-sm md:text-base focus:placeholder-gray-400 transition-colors duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="p-1 hover:bg-gray-800/60 rounded-full transition-colors duration-200 group/btn"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400 group-hover/btn:text-gray-200 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Filter Problems</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <select
                className="select backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Problems</option>
                <option value="solved">Solved Problems</option>
              </select>
            </div>

            <div className="form-control">
              <select
                className="select backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-control">
              <select
                className="select backdrop-blur-md bg-gray-800/40 border border-gray-600/40 text-gray-100 focus:bg-gray-800/60 focus:border-gray-500/60 transition-all duration-300"
                value={filters.tag}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
              >
                <option value="all">All Topics</option>
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">Dynamic Programming</option>
              </select>
            </div>
          </div>
        </div >

        {/* Problems Grid */}
        < div className="grid gap-6" >
          {
            filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="backdrop-blur-xl bg-gray-900/30 border border-gray-600/20 rounded-2xl p-6 shadow-2xl hover:bg-gray-900/40 hover:border-gray-500/30 transition-all duration-300 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <NavLink
                          to={`/problem/${problem._id}`}
                          className="text-xl font-semibold text-gray-100 hover:text-blue-400 transition-colors duration-200 group-hover:text-blue-300"
                        >
                          {problem.title}
                        </NavLink>
                        {solvedProblems.some(sp => sp._id === problem._id) && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Solved
                          </div>
                        )}
                        {solvedProblems.some(sp => sp._id.generatedBy === "ai") && (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            AI✨
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyStyles(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 border border-blue-500/30 text-blue-400">
                          {problem.tags}
                        </span>
                        {problem.generatedBy == 'ai' && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 border border-green-500/30 text-green-400">
                            AI 🤖
                          </span>
                        )}
                      </div>
                    </div>

                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="btn backdrop-blur-md bg-blue-600/40 border border-blue-500/40 text-blue-100 hover:bg-blue-600/60 hover:border-blue-400/60 transition-all duration-300 shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Solve
                    </NavLink>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800/40 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.25 0-4.31.584-6.104 1.627m12.208 0A8.978 8.978 0 0112 13.5c-2.25 0-4.31.584-6.104 1.627M6 20.5a.5.5 0 01-.5-.5v-2.5A2.5 2.5 0 008 15.5h8a2.5 2.5 0 012.5 2.5V20a.5.5 0 01-.5.5H6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No problems found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more problems</p>
              </div>
            )
          }
        </div >
      </div >
    </div >
  );
}

const getDifficultyStyles = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-500/20 border-green-500/30 text-green-400';
    case 'medium':
      return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    case 'hard':
      return 'bg-red-500/20 border-red-500/30 text-red-400';
    default:
      return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
  }
};

export default Homepage;
