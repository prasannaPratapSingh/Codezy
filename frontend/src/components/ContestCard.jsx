import { NavLink } from "react-router";
import CountTimer from "./CountTimer";

const ContestCard = ({ challenge }) => {
  let {
    title,
    description,
    problemTitle,
    problemDescription,
    difficulty,
    points,
    startTime,
    endTime,
    tags,
    _id,
    status
  } = challenge;

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  //manipulating data to create a timer


  // Difficulty color mapping
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700';
      case 'hard':
        return 'bg-gradient-to-r from-red-600 to-red-700';
      default:
        return 'bg-gradient-to-r from-blue-700 to-blue-800';
    }
  };

  // Status color mapping
  const getStatusColor = (stat) => {
    switch (stat.toLowerCase()) {
      case 'published':
        return 'bg-gradient-to-r from-green-600 to-green-700';
      case 'draft':
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
      case 'live':
        return 'bg-gradient-to-r from-red-700 to-red-800';
      case 'completed':
        return 'bg-gradient-to-r from-purple-600 to-purple-700';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  if(new Date(endTime)<new Date){
    status='completed'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main Card with Black-focused Gradient */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-blue-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 hover:border-blue-800 transition-all duration-300 transform hover:scale-[1.02]">

        {/* Header Section with Black-focused Gradient */}
        <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">
              {title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(difficulty)} text-white shadow-lg`}>
                {difficulty.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)} text-white shadow-lg`}>
                {status.toUpperCase()}
              </span>
            </div>
          </div>
          <p className="text-gray-400 mt-2 text-sm">
            {description}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 bg-gradient-to-b from-black to-gray-900">
          {/* Problem Info */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {problemTitle}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {problemDescription}
            </p>
          </div>

          {/* Stats Grid with Black Backgrounds */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-black rounded-lg p-4 text-center border border-gray-800 shadow-lg hover:border-blue-800 transition-colors duration-200">
              <div className="text-2xl font-bold text-white">
                {points}
              </div>
              <div className="text-gray-400 text-sm font-semibold">POINTS</div>
            </div>
            <div className="bg-black rounded-lg p-4 text-center border border-gray-800 shadow-lg hover:border-blue-800 transition-colors duration-200">
              <div className="text-white font-semibold text-sm">START TIME</div>
              <div className="text-gray-400 text-sm mt-1">{formatDate(startTime)}</div>
            </div>
            <div className="bg-black rounded-lg p-4 text-center border border-gray-800 shadow-lg hover:border-blue-800 transition-colors duration-200">
              <div className="text-white font-semibold text-sm">END TIME</div>
              <div className="text-gray-400 text-sm mt-1">{formatDate(endTime)}</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-sm font-semibold">Tags:</span>
            {tags && tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-black text-gray-300 rounded-full text-xs font-medium hover:bg-gray-800 hover:text-white transition-all duration-200 shadow-lg border border-gray-700 hover:border-blue-700"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
        {/* Footer with Black Gradient */}
        <div className="bg-gradient-to-r from-black to-gray-900 px-6 py-4 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {new Date() < new Date(endTime) ? (<NavLink to={`/contest/getContest/${_id}`}>
              <button className="w-full sm:w-auto bg-gradient-to-r from-gray-900 to-black hover:from-blue-900 hover:to-black text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 border border-gray-700 hover:border-blue-700 hover:cursor-pointer">Start Challenge
              </button>
            </NavLink>) : (<NavLink to={`/contest`}>
              <button className="w-full sm:w-auto bg-gradient-to-r from-gray-900 to-black text-zinc-500 px-8 py-3 rounded-lg font-semibold shadow-lg border border-gray-700 hover:cursor-not-allowed ">Contest Over!
              </button>
            </NavLink>)}
            <div><CountTimer time={endTime}/></div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ContestCard;