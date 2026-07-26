import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Wallet, Trophy, Crown, ArrowRight, Zap, Sparkles, Clock, Play, LayoutGrid, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';
import { MatchCountdownTimer } from '../common/MatchCountdownTimer';
import { TournamentRulesModal } from '../common/TournamentRulesModal';

interface HomeViewProps {
  onJoinMatchClick: (matchId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onJoinMatchClick }) => {
  const {
    user,
    banners,
    categories,
    matches,
    joinedMatches,
    setActiveTab,
    leaderboard
  } = useApp();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Auto slide promo banners
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanners = banners.filter((b) => b.active);
  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');

  return (
    <div className="space-y-4 pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto font-sans">
      {/* 1. Greeting & Balance Bar (Screenshot 8) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 font-sans">
            Welcome, {user.ingameName || 'Player'}! <span className="text-base">👋</span>
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Find and join tournaments
          </p>
        </div>
        <button
          onClick={() => setActiveTab('wallet')}
          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform cursor-pointer active:scale-95"
        >
          <Wallet className="w-3.5 h-3.5 text-orange-200" />
          <span>৳ {user.walletBalance.toFixed(2)} BDT</span>
        </button>
      </div>

      {/* 2. Promo Banner Slider (Screenshot 8) */}
      {activeBanners.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs bg-slate-950 h-44 sm:h-52">
          <motion.img
            key={currentBannerIndex}
            src={activeBanners[currentBannerIndex]?.imageUrl}
            alt={activeBanners[currentBannerIndex]?.title}
            initial={{ opacity: 0.7, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 flex flex-col justify-end">
            <span className="px-2 py-0.5 bg-orange-600 text-white font-extrabold text-[9px] rounded uppercase w-fit tracking-wider shadow">
              FEATURED
            </span>
            <h3 className="text-sm sm:text-base font-black text-white mt-1 drop-shadow-sm font-sans line-clamp-1">
              {activeBanners[currentBannerIndex]?.title}
            </h3>
            <p className="text-xs text-orange-200 font-semibold line-clamp-1 mt-0.5">
              {activeBanners[currentBannerIndex]?.subtitle}
            </p>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentBannerIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Categories Header & Grid (Screenshot 8) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 font-sans">
            <LayoutGrid className="w-4 h-4 text-orange-600" /> Categories
          </h3>
          <button
            onClick={() => setActiveTab('tournament')}
            className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveTab('tournament')}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-orange-400 transition-all cursor-pointer group shadow-2xs p-2.5 flex flex-col items-center text-center"
            >
              <div className="w-full h-24 rounded-xl overflow-hidden relative mb-2">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-slate-900/70 backdrop-blur-xs text-white text-[9px] font-bold rounded-md">
                  {cat.activeMatchesCount || 4} Open
                </span>
              </div>
              <span className="text-xs font-black text-slate-800 font-sans">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tournament Rules & Top Players Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-300 shrink-0">
              <Sparkles className="w-4 h-4 text-orange-300 animate-pulse" />
            </div>
            <div>
              <span className="px-1.5 py-0.5 bg-orange-500/30 text-orange-200 rounded text-[9px] font-extrabold uppercase tracking-wide">
                FAIR PLAY
              </span>
              <h4 className="text-xs font-black text-white mt-0.5 font-sans">Rules & Slot Policy</h4>
            </div>
          </div>
          <button
            onClick={() => setIsRulesModalOpen(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-orange-950 font-black text-[11px] rounded-xl transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            Rules 📜
          </button>
        </div>

        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between gap-2 border border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 shrink-0">
              <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
            <div>
              <span className="px-1.5 py-0.5 bg-amber-500/30 text-amber-200 rounded text-[9px] font-extrabold uppercase tracking-wide">
                LEADERBOARD
              </span>
              <h4 className="text-xs font-black text-white mt-0.5 font-sans">Top Killers & Winners</h4>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] rounded-xl transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            Top Players 👑
          </button>
        </div>
      </div>

      {/* 5. Live Matches Section */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 px-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 font-sans">
              <Play className="w-4 h-4 text-red-600 fill-red-600" /> LIVE MATCHES NOW
            </h3>
          </div>

          <div className="space-y-3">
            {liveMatches.map((m) => (
              <div
                key={m.id}
                className="bg-white border-2 border-red-500/80 rounded-2xl p-4 shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[9px] rounded uppercase">
                      🔴 LIVE ROOM OPEN
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-1 font-sans">{m.title}</h4>
                    <p className="text-xs text-slate-500">{m.categoryName} • Map: {m.mapName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block">Prize Pool</span>
                    <span className="text-base font-black text-orange-600">৳{m.prizePool}</span>
                  </div>
                </div>

                {/* Room ID Box */}
                {m.roomId && (
                  joinedMatches.some((jm) => jm.matchId === m.id && jm.userId === user.id) ? (
                    <div className="mt-3 p-3 bg-orange-50/80 rounded-xl border border-orange-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-orange-700 font-bold uppercase">ROOM CREDENTIALS</span>
                        <p className="text-xs font-mono font-black text-orange-900 mt-0.5">
                          ID: {m.roomId} | Pass: {m.roomPassword}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <CopyButton textToCopy={m.roomId} label="ID" />
                        <CopyButton textToCopy={m.roomPassword || '123'} label="Pass" />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-orange-700 font-bold flex items-center gap-1.5">
                      🔒 <span>Room ID & Password available only for players who joined this match.</span>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Upcoming Matches Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 font-sans">
            <Clock className="w-4 h-4 text-orange-600" /> UPCOMING MATCHES
          </h3>
          <button
            onClick={() => setActiveTab('tournament')}
            className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {upcomingMatches.slice(0, 3).map((m) => {
            const isUserJoined = joinedMatches.some((jm) => jm.matchId === m.id && jm.userId === user.id);
            const slotPercent = Math.min(100, Math.round((m.joinedSlotsCount / m.totalSlots) * 100));

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200/80 hover:border-orange-400 rounded-2xl p-4 transition-all shadow-2xs relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200/80 text-[10px] font-bold rounded uppercase">
                        {m.categoryName}
                      </span>
                      <MatchCountdownTimer
                        startTimestamp={m.startTimestamp}
                        matchDate={m.matchDate}
                        matchTime={m.matchTime}
                        status={m.status}
                        compact={true}
                      />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-1.5 font-sans">{m.title}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      📅 {m.matchDate} at {m.matchTime} • {m.mapName}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Prize Pool</span>
                    <p className="text-base font-black text-orange-600">৳{m.prizePool}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      1st Prize: ৳{m.firstPrize}
                    </span>
                  </div>
                </div>

                {/* Slots & Entry Fee row */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Slots: {m.joinedSlotsCount} / {m.totalSlots}</span>
                      <span className="text-orange-600">{m.totalSlots - m.joinedSlotsCount} Left</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-600 h-full rounded-full transition-all"
                        style={{ width: `${slotPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Entry Fee</span>
                      <span className="text-xs font-black text-slate-900">৳{m.entryFee}</span>
                    </div>

                    {isUserJoined ? (
                      <button
                        onClick={() => setActiveTab('mymatch')}
                        className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Joined ✅
                      </button>
                    ) : (
                      <button
                        onClick={() => onJoinMatchClick(m.id)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        Join Match 🎮
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Modal */}
      <TournamentRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};
