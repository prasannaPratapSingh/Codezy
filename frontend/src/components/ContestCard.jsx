import { NavLink } from "react-router";
import CountTimer from "./CountTimer";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

const ContestCard = ({ challenge }) => {
  const [showLeader, setShowLeader] = useState(false);
  const [leader, setLeader] = useState([]);

  //fetch leaderboard data
  const leaderBoard = async () => {
    try {
      const response = await axiosClient(`/contest/leaderboard/${_id}`);
      setLeader(response?.data?.leaderboard);
    } catch (error) {
      console.log("Error(leaderboard)" + error?.message);
    }
  }


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

  if (new Date(endTime) < new Date) {
    status = 'completed'
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
        <div className="p-6 bg-gradient-to-b from-black to-gray-900 relative">
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
            </NavLink>)
            }
            {new Date() < new Date(endTime) ? (<button className="w-full sm:w-auto bg-gradient-to-r from-gray-900 to-black px-8 py-3 rounded-lg font-semibold shadow-lg border border-gray-700 cursor-not-allowed disabled:border-teal-300 text-zinc-500 ">LeaderBoard
            </button>) : (<button className="sm:w-auto bg-gradient-to-r from-gray-900 to-black px-8 py-3 rounded-lg font-semibold shadow-lg border border-gray-700 hover:cursor-pointer" onClick={() => { setShowLeader(!showLeader); leaderBoard() }}>{!showLeader?'🏆 Leaderboard':'Close Leaderboard ❌'}
            </button>)}
            <div><CountTimer time={endTime} /></div>
          </div>
        </div>
{showLeader && (
  <div className="w-full bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl shadow-2xl border border-blue-800/30">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          🏆 Contest Leaderboard
        </span>
      </h2>
      <p className="text-gray-400 text-sm mt-1">Top performers of the competition</p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-blue-900/50">
            <th className="py-3 px-4 text-left">
              <span className="text-gray-300 font-medium">Rank</span>
            </th>
            <th className="py-3 px-4 text-left">
              <span className="text-gray-300 font-medium">Participant</span>
            </th>
            <th className="py-3 px-4 text-left">
              <span className="text-gray-300 font-medium">Score</span>
            </th>
            <th className="py-3 px-4 text-left">
              <span className="text-gray-300 font-medium">Runtime</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {leader.map((userData, idx) => {
            const isTopThree = idx < 3;
            const rankColors = {
              0: "from-yellow-500 to-yellow-300", // Gold
              1: "from-gray-300 to-gray-400",     // Silver
              2: "from-amber-600 to-amber-800"    // Bronze
            };
            
            return (
              <tr 
                key={userData?._id} 
                className={`
                  border-b border-gray-800/50 
                  hover:bg-gray-800/30 
                  transition-all duration-200
                  ${idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-900/10'}
                `}
              >
                {/* Rank Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {isTopThree ? (
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        bg-gradient-to-r ${rankColors[idx]} 
                        text-black font-bold shadow-lg
                      `}>
                        {idx + 1}
                      </div>
                    ) : (
                      <div className="
                        w-8 h-8 rounded-full flex items-center justify-center
                        bg-gray-800 border border-gray-700
                        text-gray-300 font-medium
                      ">
                        {idx + 1}
                      </div>
                    )}
                    {isTopThree && (
                      <div className="hidden sm:block">
                        <div className="text-xs text-gray-400 capitalize">
                          {idx === 0 ? "🥇 Champion" : idx === 1 ? "🥈 Runner-up" : "🥉 Third"}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                {/* Participant Column - Simplified without avatar */}
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-white font-medium">
                      {userData?.userId?.firstName || "Anonymous User"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {userData?.userId?.email?.split('@')[0] || "participant"}
                    </div>
                  </div>
                </td>

                {/* Score Column */}
                <td className="py-4 px-4">
                  <div className="
                    px-3 py-1 rounded-full 
                    bg-gradient-to-r from-blue-900/30 to-blue-800/20
                    border border-blue-800/30
                    inline-flex items-center gap-2
                  ">
                    <span className="text-white font-bold">
                      {userData?.score || 0}
                    </span>
                    <span className="text-xs text-blue-300">pts</span>
                  </div>
                </td>

                {/* Runtime Column */}
                <td className="py-4 px-4">
                  <div className="text-white font-mono">
                    {userData?.runtime 
                      ? `${parseFloat(userData.runtime).toFixed(3)}s`
                      : "N/A"
                    }
                  </div>
                  <div className="text-xs text-gray-400">
                    {userData?.status === 'accepted' ? '✅ Accepted' : userData?.status}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Footer Stats */}
    <div className="mt-6 pt-4 border-t border-gray-800/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-400">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
            <span>Gold - 1st Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
            <span>Silver - 2nd Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800"></div>
            <span>Bronze - 3rd Place</span>
          </div>
        </div>
        <div className="text-white font-medium">
          Total Participants: <span className="text-blue-300">{leader.length}</span>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div >
  );
};

export default ContestCard;