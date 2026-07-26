import React, { useState } from 'react';
import { Gamepad2, Plus, Edit2, Trash2, Key, Trophy, RefreshCw, CheckCircle2, AlertTriangle, X, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TournamentMatch } from '../../types';

export const AdminMatchManager: React.FC = () => {
  const {
    matches,
    categories,
    createMatch,
    updateMatch,
    publishRoomId,
    setMatchWinner,
    cancelMatch,
    deleteMatch,
    joinedMatches,
    showToast
  } = useApp();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<TournamentMatch | null>(null);

  // Room Publish Drawer
  const [publishingMatchId, setPublishingMatchId] = useState<string | null>(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('123');

  // Winner Declare Drawer
  const [declaringMatchId, setDeclaringMatchId] = useState<string | null>(null);
  const [winnerUserIdInput, setWinnerUserIdInput] = useState('');
  const [winnerNameInput, setWinnerNameInput] = useState('');
  const [winnerPrizeInput, setWinnerPrizeInput] = useState<number>(300);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [matchDate, setMatchDate] = useState('2026-07-28');
  const [matchTime, setMatchTime] = useState('08:00 PM');
  const [mapName, setMapName] = useState('Bermuda');
  const [entryFee, setEntryFee] = useState<number>(30);
  const [prizePool, setPrizePool] = useState<number>(300);
  const [firstPrize, setFirstPrize] = useState<number>(200);
  const [secondPrize, setSecondPrize] = useState<number>(100);
  const [perKillPrize, setPerKillPrize] = useState<number>(10);
  const [totalSlots, setTotalSlots] = useState<number>(2);

  const handleOpenCreate = () => {
    setEditingMatch(null);
    setTitle('Lone Wolf 1v1 High Stakes Match');
    setCategoryId(categories[0]?.id || 'cat-1');
    setMatchDate('2026-07-28');
    setMatchTime('09:00 PM');
    setMapName('Iron Cage');
    setEntryFee(50);
    setPrizePool(500);
    setFirstPrize(350);
    setSecondPrize(150);
    setPerKillPrize(15);
    setTotalSlots(2);
    setIsCreateOpen(true);
  };

  const handleSubmitMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId) {
      showToast('Please fill out all match details!');
      return;
    }

    const catObj = categories.find((c) => c.id === categoryId);

    if (editingMatch) {
      updateMatch(editingMatch.id, {
        title,
        categoryId,
        categoryName: catObj?.name || 'Lone Wolf',
        categoryType: catObj?.type || '1v1',
        matchDate,
        matchTime,
        mapName,
        entryFee,
        prizePool,
        firstPrize,
        secondPrize,
        perKillPrize,
        totalSlots
      });
    } else {
      createMatch({
        title,
        categoryId,
        categoryName: catObj?.name || 'Lone Wolf 1v1',
        categoryType: catObj?.type || '1v1',
        matchDate,
        matchTime,
        mapName,
        entryFee,
        prizePool,
        firstPrize,
        secondPrize,
        perKillPrize,
        totalSlots,
        rules: [
          'Lone Wolf 1v1 Custom Room Format',
          'Gun Property: Off / Limited Ammo: Yes',
          'No Emote toxic behavior during match',
          'Winner must take screenshot of victory screen'
        ]
      });
    }

    setIsCreateOpen(false);
  };

  const handlePublishRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishingMatchId || !roomIdInput.trim()) return;
    publishRoomId(publishingMatchId, roomIdInput.trim(), roomPassInput.trim());
    setPublishingMatchId(null);
  };

  const handleSetWinnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaringMatchId || !winnerUserIdInput || !winnerNameInput) return;
    setMatchWinner(declaringMatchId, winnerUserIdInput, winnerNameInput, winnerPrizeInput);
    setDeclaringMatchId(null);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 px-3 sm:px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#121722] rounded-2xl p-4 border border-amber-500/40 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-red-500" /> TOURNAMENT MATCH MANAGER
          </h2>
          <p className="text-xs text-gray-400">Create matches, publish live Room ID & Pass, declare winners & auto-refund.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Match
        </button>
      </div>

      {/* MATCH CREATION / EDIT DRAWER */}
      {isCreateOpen && (
        <form onSubmit={handleSubmitMatch} className="bg-[#121722] p-5 rounded-2xl border-2 border-red-500/60 space-y-3 shadow-2xl">
          <div className="flex justify-between items-center pb-2 border-b border-gray-800">
            <h3 className="font-extrabold text-white text-sm">
              {editingMatch ? 'Edit Tournament Match' : 'Create New Tournament Match'}
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Match Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lone Wolf 1v1 High Stakes"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Select Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Map Name</label>
              <input
                type="text"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                placeholder="Bermuda / Iron Cage"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Match Date</label>
              <input
                type="text"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Match Time</label>
              <input
                type="text"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Total Player Slots</label>
              <input
                type="number"
                value={totalSlots}
                onChange={(e) => setTotalSlots(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Entry Fee (৳)</label>
              <input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Total Prize Pool (৳)</label>
              <input
                type="number"
                value={prizePool}
                onChange={(e) => setPrizePool(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">1st Champion Prize (৳)</label>
              <input
                type="number"
                value={firstPrize}
                onChange={(e) => setFirstPrize(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 bg-gray-800 text-gray-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Save Tournament Match ✅
            </button>
          </div>
        </form>
      )}

      {/* PUBLISH ROOM DRAWER */}
      {publishingMatchId && (
        <form onSubmit={handlePublishRoomSubmit} className="bg-[#121722] p-4 rounded-2xl border-2 border-amber-500/80 space-y-3 shadow-2xl">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-amber-300 text-xs uppercase flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" /> Publish Custom Room ID & Password
            </h3>
            <button type="button" onClick={() => setPublishingMatchId(null)} className="text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Custom Room ID</label>
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="e.g. 849204"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Room Password</label>
              <input
                type="text"
                value={roomPassInput}
                onChange={(e) => setRoomPassInput(e.target.value)}
                placeholder="e.g. 123"
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
          >
            Publish Live Room Now 🔴
          </button>
        </form>
      )}

      {/* DECLARE WINNER DRAWER */}
      {declaringMatchId && (
        <form onSubmit={handleSetWinnerSubmit} className="bg-[#121722] p-4 rounded-2xl border-2 border-emerald-500/80 space-y-3 shadow-2xl">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-emerald-400 text-xs uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" /> Declare Match Winner & Award Prize
            </h3>
            <button type="button" onClick={() => setDeclaringMatchId(null)} className="text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Select Winner Player from Joined Slot</label>
              <select
                onChange={(e) => {
                  const [uid, name] = e.target.value.split('||');
                  setWinnerUserIdInput(uid);
                  setWinnerNameInput(name);
                }}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="">-- Choose Registered Winner --</option>
                {joinedMatches
                  .filter((jm) => jm.matchId === declaringMatchId)
                  .map((jm) => (
                    <option key={jm.id} value={`${jm.userId}||${jm.ingameName}`}>
                      Slot #{jm.slotNumber}: {jm.ingameName} (UID: {jm.freeFireUid})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Winner Cash Prize Amount (৳)</label>
              <input
                type="number"
                value={winnerPrizeInput}
                onChange={(e) => setWinnerPrizeInput(Number(e.target.value))}
                className="w-full bg-[#182030] border border-gray-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
          >
            Award Prize Money & Close Match 🎉
          </button>
        </form>
      )}

      {/* Matches List */}
      <div className="space-y-3">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-[#121722] rounded-2xl p-4 border border-gray-800 hover:border-gray-700 shadow-md space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-600/30 text-red-400 border border-red-500/40 text-[10px] font-bold rounded uppercase">
                    {m.categoryName}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">📅 {m.matchDate} at {m.matchTime}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    m.status === 'live' ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">{m.title}</h3>
                <p className="text-xs text-amber-300 font-mono mt-0.5">
                  Fee: ৳{m.entryFee} | Prize: ৳{m.prizePool} | Joined: {m.joinedSlotsCount}/{m.totalSlots}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    setPublishingMatchId(m.id);
                    setRoomIdInput(m.roomId || '');
                    setRoomPassInput(m.roomPassword || '123');
                  }}
                  className="px-2.5 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" /> Room ID
                </button>

                <button
                  onClick={() => {
                    setDeclaringMatchId(m.id);
                    setWinnerPrizeInput(m.firstPrize);
                  }}
                  className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trophy className="w-3.5 h-3.5" /> Set Winner
                </button>

                <button
                  onClick={() => cancelMatch(m.id)}
                  className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Cancel & Refund Players"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refund
                </button>

                <button
                  onClick={() => deleteMatch(m.id)}
                  className="p-1.5 bg-gray-800 hover:bg-red-950 text-red-400 rounded-xl cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
