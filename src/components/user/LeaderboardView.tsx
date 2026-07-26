import React, { useState } from 'react';
import { Medal, Crown, Trophy, Flame, Award, Zap, Crosshair, Target, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LeaderboardView: React.FC = () => {
  const { leaderboard } = useApp();
  const [filterMode, setFilterMode] = useState<'kills' | 'earnings' | 'wins'>('kills');

  // Sort leaderboard list based on selected filterMode
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (filterMode === 'kills') {
      return (b.totalKills || 0) - (a.totalKills || 0);
    } else if (filterMode === 'wins') {
      return b.totalWins - a.totalWins;
    } else {
      return b.totalEarnings - a.totalEarnings;
    }
  }).map((item, index) => ({
    ...item,
    currentRank: index + 1
  }));

  const topThree = sortedLeaderboard.slice(0, 3);

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-orange-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> FIRE ARENA LEADERBOARD
            </h2>
            <p className="text-xs text-gray-400">Top Free Fire Lone Wolf champions ranked by Kills, Earnings & Wins.</p>
          </div>
          <div className="p-2 bg-orange-500/20 border border-orange-500/40 rounded-xl flex items-center gap-1.5">
            <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>
        </div>

        {/* Filter Sub-Tabs */}
        <div className="flex bg-[#182030] rounded-xl p-1 mt-3 border border-gray-800 gap-1">
          <button
            onClick={() => setFilterMode('kills')}
            className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'kills'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4 text-red-400" />
            <span>🎯 TOP KILLERS</span>
          </button>

          <button
            onClick={() => setFilterMode('earnings')}
            className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'earnings'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>💰 TOP EARNINGS</span>
          </button>

          <button
            onClick={() => setFilterMode('wins')}
            className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              filterMode === 'wins'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>👑 MOST WINS</span>
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-4">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="bg-[#121722] border border-gray-700 rounded-2xl p-3 text-center flex flex-col items-center shadow-lg relative">
            <span className="px-2 py-0.5 bg-gray-600 text-white font-black text-[10px] rounded-full mb-1">#2 SILVER</span>
            <img
              src={topThree[1].avatarUrl}
              alt={topThree[1].ingameName}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gray-300 object-cover my-1"
            />
            <h3 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">{topThree[1].ingameName}</h3>
            {filterMode === 'kills' ? (
              <p className="text-xs font-black text-red-400 flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-red-400" /> {topThree[1].totalKills || 0} Kills
              </p>
            ) : (
              <p className="text-xs font-bold text-amber-400">৳{topThree[1].totalEarnings}</p>
            )}
            <p className="text-[10px] text-gray-400">{topThree[1].totalWins} Wins</p>
          </div>
        )}

        {/* 1st Place (Center / Tallest) */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-orange-950/90 via-[#1D1728] to-[#121722] border-2 border-amber-400 rounded-2xl p-4 text-center flex flex-col items-center shadow-[0_0_30px_rgba(245,158,11,0.3)] relative -translate-y-2">
            <Crown className="w-6 h-6 text-amber-400 absolute -top-3 animate-bounce" />
            <span className="px-2.5 py-0.5 bg-amber-500 text-black font-black text-[10px] rounded-full mb-1 shadow">
              {filterMode === 'kills' ? '🎯 KILL KING' : '#1 GOLD CHAMP'}
            </span>
            <img
              src={topThree[0].avatarUrl}
              alt={topThree[0].ingameName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 object-cover my-1 shadow-lg"
            />
            <h3 className="text-sm sm:text-base font-black text-amber-300 truncate max-w-full">{topThree[0].ingameName}</h3>
            
            {filterMode === 'kills' ? (
              <p className="text-sm font-black text-red-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> {topThree[0].totalKills || 0} Total Kills
              </p>
            ) : (
              <p className="text-sm font-black text-emerald-400">৳{topThree[0].totalEarnings}</p>
            )}

            <p className="text-xs font-bold text-amber-400/90 mt-0.5">
              {topThree[0].totalWins} Wins • MVP: {topThree[0].mvpCount}
            </p>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="bg-[#121722] border border-amber-800/60 rounded-2xl p-3 text-center flex flex-col items-center shadow-lg relative">
            <span className="px-2 py-0.5 bg-amber-800 text-amber-200 font-black text-[10px] rounded-full mb-1">#3 BRONZE</span>
            <img
              src={topThree[2].avatarUrl}
              alt={topThree[2].ingameName}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-700 object-cover my-1"
            />
            <h3 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">{topThree[2].ingameName}</h3>
            {filterMode === 'kills' ? (
              <p className="text-xs font-black text-red-400 flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-red-400" /> {topThree[2].totalKills || 0} Kills
              </p>
            ) : (
              <p className="text-xs font-bold text-amber-400">৳{topThree[2].totalEarnings}</p>
            )}
            <p className="text-[10px] text-gray-400">{topThree[2].totalWins} Wins</p>
          </div>
        )}
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="bg-[#121722] rounded-2xl border border-gray-800 overflow-hidden shadow-md">
        <div className="p-3 bg-[#182030] border-b border-gray-800 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>RANK & PLAYER</span>
          <div className="flex gap-4 items-center">
            <span className={filterMode === 'kills' ? 'text-red-400 font-extrabold' : ''}>KILLS</span>
            <span className={filterMode === 'wins' ? 'text-amber-400 font-extrabold' : ''}>WINS</span>
            <span className={filterMode === 'earnings' ? 'text-emerald-400 font-extrabold' : ''}>EARNINGS</span>
          </div>
        </div>

        <div className="divide-y divide-gray-800/60">
          {sortedLeaderboard.map((item) => (
            <div
              key={item.userId}
              className="p-3 flex items-center justify-between hover:bg-[#182030]/50 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                    item.currentRank === 1
                      ? 'bg-amber-500 text-black'
                      : item.currentRank === 2
                      ? 'bg-gray-400 text-black'
                      : item.currentRank === 3
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {item.currentRank}
                </span>

                <img
                  src={item.avatarUrl}
                  alt={item.ingameName}
                  className="w-9 h-9 rounded-full object-cover border border-gray-700"
                />

                <div>
                  <h4 className="font-bold text-white flex items-center gap-1">
                    {item.ingameName}
                    {item.currentRank === 1 && <Crown className="w-3.5 h-3.5 text-amber-400 inline" />}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    Matches: {item.totalMatches} • Win Rate: {item.winRate}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className={`font-black text-sm flex items-center gap-0.5 ${filterMode === 'kills' ? 'text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded-lg' : 'text-gray-300'}`}>
                  🎯 {item.totalKills || 0}
                </span>
                <span className="font-extrabold text-white">{item.totalWins}W</span>
                <span className="font-black text-emerald-400 text-sm">৳{item.totalEarnings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

