import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Key, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';

export const MyMatchView: React.FC = () => {
  const { joinedMatches, matches, user } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'completed' | 'cancelled'>('all');

  // Filter joined matches
  const filteredJoined = joinedMatches.filter((jm) => {
    if (filterStatus === 'all') return true;
    return jm.status === filterStatus;
  });

  return (
    <div className="space-y-4 pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 font-sans">
              <Trophy className="w-4 h-4 text-orange-600" /> MY MATCHES ({joinedMatches.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">View registered tournaments, slots, and live Room ID & Password!</p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'upcoming', 'live', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredJoined.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 font-sans">No joined matches found in this category.</p>
            <p className="text-xs text-slate-400 mt-1">Go to Tournament tab and join a match!</p>
          </div>
        ) : (
          filteredJoined.map((jm) => {
            const matchDetails = matches.find((m) => m.id === jm.matchId);
            const isLive = jm.status === 'live' || matchDetails?.status === 'live';
            const isCompleted = jm.status === 'completed' || matchDetails?.status === 'completed';

            return (
              <div
                key={jm.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs relative overflow-hidden ${
                  isLive
                    ? 'border-2 border-orange-600'
                    : 'border-slate-200/80 hover:border-orange-400'
                }`}
              >
                {/* Match Header */}
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-black rounded uppercase">
                        SLOT #{jm.slotNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        📅 {matchDetails?.matchDate} at {matchDetails?.matchTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1 font-sans">
                      {matchDetails?.title || 'Tournament Match'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ingame Name: <span className="text-orange-600 font-bold">{jm.ingameName}</span> (UID: {jm.freeFireUid})
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase inline-block ${
                        isLive
                          ? 'bg-red-600 text-white animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {jm.status}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Fee Paid: ৳{jm.entryFeePaid}</p>
                  </div>
                </div>

                {/* ROOM ID & PASSWORD REVEAL BOX */}
                {matchDetails?.roomId ? (
                  <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-3 p-3.5 bg-orange-50/60 rounded-xl border border-orange-200 shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-orange-700 font-extrabold text-xs">
                        <Key className="w-4 h-4 text-orange-600 animate-bounce" />
                        <span>CUSTOM ROOM CREDENTIALS IS LIVE</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">READY TO PLAY</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold bg-white p-2.5 rounded-lg border border-orange-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">ROOM ID</span>
                        <span className="text-orange-900 text-sm font-black">{matchDetails.roomId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">PASSWORD</span>
                        <span className="text-orange-900 text-sm font-black">{matchDetails.roomPassword || '123'}</span>
                      </div>
                    </div>

                    {/* Copy Buttons Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-orange-100">
                      <div className="flex gap-1.5">
                        <CopyButton textToCopy={matchDetails.roomId} label="Copy Room ID" />
                        <CopyButton textToCopy={matchDetails.roomPassword || '123'} label="Copy Pass" />
                      </div>

                      <CopyButton
                        textToCopy={`Match: ${matchDetails.title}\nRoom ID: ${matchDetails.roomId}\nPassword: ${matchDetails.roomPassword}\nSlot: #${jm.slotNumber}`}
                        label="Copy Details"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>Room ID & Password will be published 10 minutes before match start!</span>
                    </div>
                  </div>
                )}

                {/* Winner Prize Notification if won */}
                {jm.prizeWon && jm.prizeWon > 0 ? (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <span className="font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> YOU WON 1ST PLACE CHAMPION PRIZE!
                    </span>
                    <span className="text-base font-black text-emerald-700">+৳{jm.prizeWon}</span>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
