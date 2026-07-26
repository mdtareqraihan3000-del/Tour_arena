import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Search, Filter, ShieldAlert, ChevronDown, ChevronUp, Trophy, CheckCircle2, X, Wallet, Timer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TournamentMatch } from '../../types';
import { MatchCountdownTimer } from '../common/MatchCountdownTimer';

interface TournamentViewProps {
  selectedMatchIdForJoin?: string | null;
  onClearSelectedMatchId?: () => void;
}

export const TournamentView: React.FC<TournamentViewProps> = ({
  selectedMatchIdForJoin,
  onClearSelectedMatchId
}) => {
  const {
    categories,
    matches,
    joinedMatches,
    user,
    joinMatch,
    setActiveTab,
    showToast
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRulesId, setExpandedRulesId] = useState<string | null>(null);

  // Join Match Modal state
  const [joiningMatch, setJoiningMatch] = useState<TournamentMatch | null>(() => {
    if (selectedMatchIdForJoin) {
      return matches.find((m) => m.id === selectedMatchIdForJoin) || null;
    }
    return null;
  });

  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [ingameNameInput, setIngameNameInput] = useState(user.ingameName || '');
  const [ffUidInput, setFfUidInput] = useState(user.freeFireUid || '');

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    const matchesCat = activeCategoryFilter === 'all' || m.categoryId === activeCategoryFilter || m.categoryType === activeCategoryFilter;
    const matchesQuery = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Nearest upcoming match for featured countdown widget
  const nextMatch = matches
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => (a.startTimestamp || 0) - (b.startTimestamp || 0))[0];

  const handleOpenJoinModal = (match: TournamentMatch) => {
    setJoiningMatch(match);
    setSelectedSlot(1);
    setIngameNameInput(user.ingameName || '');
    setFfUidInput(user.freeFireUid || '');
  };

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningMatch) return;

    if (!ingameNameInput.trim() || !ffUidInput.trim()) {
      showToast('Please enter your Ingame Name and Free Fire UID!');
      return;
    }

    const res = joinMatch(joiningMatch.id, selectedSlot, ingameNameInput.trim(), ffUidInput.trim());
    if (res.success) {
      setJoiningMatch(null);
      if (onClearSelectedMatchId) onClearSelectedMatchId();
      setActiveTab('mymatch');
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto font-sans">
      {/* Search & Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 font-sans">
              <Flame className="w-4 h-4 text-orange-600" /> TOURNAMENTS ARENA
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Select match category, pick slot & join match.</p>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournament..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-3.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryFilter === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔥 All ({matches.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 font-sans">No tournaments found for this filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting another category or clear search query.</p>
          </div>
        ) : (
          filteredMatches.map((m) => {
            const isUserJoined = joinedMatches.some((jm) => jm.matchId === m.id && jm.userId === user.id);
            const slotPercent = Math.min(100, Math.round((m.joinedSlotsCount / m.totalSlots) * 100));
            const isExpanded = expandedRulesId === m.id;

            return (
              <div
                key={m.id}
                className="bg-white border border-slate-200/80 hover:border-orange-400 rounded-2xl p-4 transition-all shadow-2xs relative overflow-hidden"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200/80 text-[10px] font-bold rounded uppercase">
                        {m.categoryName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">📅 {m.matchDate} at {m.matchTime}</span>
                      <MatchCountdownTimer
                        startTimestamp={m.startTimestamp}
                        matchDate={m.matchDate}
                        matchTime={m.matchTime}
                        status={m.status}
                        compact={true}
                      />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1.5 font-sans">{m.title}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Prize Pool</span>
                      <span className="text-lg font-black text-orange-600">৳{m.prizePool}</span>
                    </div>
                  </div>
                </div>

                {/* Prize Breakdown details */}
                <div className="grid grid-cols-3 gap-2 my-3 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">1st Prize</span>
                    <span className="font-extrabold text-emerald-600">৳{m.firstPrize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">2nd Prize</span>
                    <span className="font-bold text-amber-600">৳{m.secondPrize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Per Kill</span>
                    <span className="font-bold text-orange-600">৳{m.perKillPrize}</span>
                  </div>
                </div>

                {/* Rules Expander */}
                <div className="mb-3">
                  <button
                    onClick={() => setExpandedRulesId(isExpanded ? null : m.id)}
                    className="text-xs text-orange-600 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>Tournament Rules & Specs</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1 font-sans border border-slate-200"
                    >
                      <p className="font-bold text-slate-900 mb-1">Map: {m.mapName}</p>
                      {m.rules.map((rule, idx) => (
                        <p key={idx} className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600" /> {rule}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Slot bar & Action button */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
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

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Entry Fee</span>
                      <span className="text-sm font-black text-slate-900">৳{m.entryFee}</span>
                    </div>

                    {isUserJoined ? (
                      <button
                        onClick={() => setActiveTab('mymatch')}
                        className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs cursor-pointer"
                      >
                        Joined ✅
                      </button>
                    ) : m.joinedSlotsCount >= m.totalSlots ? (
                      <button
                        disabled
                        className="px-3.5 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
                      >
                        Match Full
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenJoinModal(m)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95"
                      >
                        Join Match 🎮
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* JOIN MATCH MODAL WITH SLOT SELECTION GRID */}
      <AnimatePresence>
        {joiningMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-xl overflow-hidden font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-sans">Join Tournament Match</h3>
                    <p className="text-xs text-orange-600 font-bold">{joiningMatch.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setJoiningMatch(null)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Insufficient Balance warning if applicable */}
              {user.walletBalance < joiningMatch.entryFee && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-900">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <p className="font-bold text-red-700">Insufficient Balance!</p>
                      <p className="text-[11px] text-red-600">Fee: ৳{joiningMatch.entryFee} | You Have: ৳{user.walletBalance}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setJoiningMatch(null);
                      setActiveTab('wallet');
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Deposit Now
                  </button>
                </div>
              )}

              <form onSubmit={handleConfirmJoin} className="mt-4 space-y-4">
                {/* Slot Selector Grid */}
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-2">
                    Select Your Slot Number ({joiningMatch.joinedSlotsCount}/{joiningMatch.totalSlots})
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {Array.from({ length: joiningMatch.totalSlots }, (_, i) => i + 1).map((slotNum) => {
                      const isOccupied = slotNum <= joiningMatch.joinedSlotsCount;
                      const isSelected = selectedSlot === slotNum;

                      return (
                        <button
                          key={slotNum}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setSelectedSlot(slotNum)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-400'
                          }`}
                        >
                          Slot #{slotNum} {isOccupied && '(Full)'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Free Fire Ingame Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Free Fire In-Game Name (Mandatory)
                  </label>
                  <input
                    type="text"
                    value={ingameNameInput}
                    onChange={(e) => setIngameNameInput(e.target.value)}
                    placeholder="e.g. ⚡RAIHAN_FF⚡"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                {/* Free Fire UID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Free Fire UID Number (Mandatory)
                  </label>
                  <input
                    type="text"
                    value={ffUidInput}
                    onChange={(e) => setFfUidInput(e.target.value)}
                    placeholder="e.g. 849204821"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                {/* Fee & Confirm button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Entry Fee Deduction</span>
                    <span className="text-lg font-black text-orange-600">৳{joiningMatch.entryFee}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={user.walletBalance < joiningMatch.entryFee}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm & Pay ৳{joiningMatch.entryFee}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
