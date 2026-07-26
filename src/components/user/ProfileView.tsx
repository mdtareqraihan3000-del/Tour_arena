import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Phone, Mail, Edit3, Flag, MessageSquare, Send, Trophy, Copy, Sparkles, X, Check, Key, LogOut, Settings, KeyRound, Camera, ChevronRight, BookOpen, Headphones, Code2, ShieldAlert, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';
import { ReportCategory } from '../../types';
import { AdminPasscodeModal } from '../common/AdminPasscodeModal';
import { TournamentRulesModal } from '../common/TournamentRulesModal';

interface ProfileViewProps {
  onOpenSettings: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSettings }) => {
  const {
    user,
    appSettings,
    setAppRole,
    updateProfile,
    chatMessages,
    sendChatMessage,
    submitReport,
    logout,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'chat' | 'report'>('profile');
  const [isAdminPasscodeOpen, setIsAdminPasscodeOpen] = useState(false);
  const [apTapCount, setApTapCount] = useState(0);

  const handleApClick = () => {
    const nextCount = apTapCount + 1;
    if (nextCount >= 11) {
      setApTapCount(0);
      setIsAdminPasscodeOpen(true);
      showToast('⚡ Passcode Access Requested! Enter 6-digit passcode.');
    } else {
      setApTapCount(nextCount);
      showToast('Not available right now!');
    }
  };

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editIngameName, setEditIngameName] = useState(user.ingameName);
  const [editFreeFireUid, setEditFreeFireUid] = useState(user.freeFireUid);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);

  // Chat input
  const [chatInput, setChatInput] = useState('');
  const [chatChannel, setChatChannel] = useState<'global' | 'support'>('global');

  // Report Modal
  const [reportedName, setReportedName] = useState('');
  const [reportCat, setReportCat] = useState<ReportCategory>('hacker');
  const [reportDesc, setReportDesc] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      username: editUsername,
      ingameName: editIngameName,
      freeFireUid: editFreeFireUid,
      email: editEmail,
      phone: editPhone
    });
    setIsEditModalOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim(), chatChannel);
    setChatInput('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedName.trim() || !reportDesc.trim()) {
      showToast('Please enter reported player/match and description!');
      return;
    }
    submitReport(reportedName.trim(), reportCat, reportDesc.trim());
    setReportedName('');
    setReportDesc('');
    setActiveTab('profile');
  };

  const currentChannelMessages = chatMessages.filter((c) => c.channel === chatChannel);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  return (
    <div className="space-y-4 pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto font-sans">
      {/* Top Banner & Profile Header Card (Screenshot 1) */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
        {/* Orange Top Background Banner */}
        <div className="h-28 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 relative" />

        {/* Avatar & User Details */}
        <div className="px-5 pb-5 pt-0 -mt-12 text-center relative flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-950 p-1 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={user.avatarUrl}
                alt={user.ingameName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-1 right-0 p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 shadow-md cursor-pointer transition-transform active:scale-95"
              title="Edit Photo & Profile"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-xl font-black text-slate-900 mt-2.5 tracking-tight font-sans">
            {user.ingameName}
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            @{user.username}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{user.email}</span>
          </div>

          {/* Action Buttons: Edit Info & Change Password */}
          <div className="flex items-center justify-center gap-2.5 mt-3.5 w-full max-w-xs">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-full text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-600" /> Edit Info
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-full text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Key className="w-3.5 h-3.5 text-slate-500" /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* 3 Stats Boxes Row (Screenshot 1) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
          <span className="text-lg font-black text-orange-600 block leading-tight">{user.totalMatches}</span>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">Matches</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
          <span className="text-lg font-black text-emerald-600 block leading-tight">{user.totalWins}</span>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">Wins</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
          <span className="text-lg font-black text-amber-600 block leading-tight">{user.walletBalance.toFixed(2)}</span>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 block">BDT</span>
        </div>
      </div>

      {/* Profile Options List (Screenshot 1) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-2xs">
        <button
          onClick={() => setIsRulesModalOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-bold text-slate-800">Rules</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-800">Top Players</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-800">Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => showToast(`Fire Arena Esports App v${appSettings.appVersion}`)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-slate-800">Developer Info</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="text-sm font-bold text-slate-800">Report Hacker</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Rules Modal */}
      <TournamentRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Account Deletion & Logout */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={handleApClick}
          className="w-full sm:flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
        >
          <Trash2 className="w-4 h-4 text-red-600" /> Delete The Account
        </button>
        <button
          onClick={logout}
          className="w-full sm:flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Admin Passcode Modal for AP button */}
      <AdminPasscodeModal
        isOpen={isAdminPasscodeOpen}
        onClose={() => setIsAdminPasscodeOpen(false)}
      />

      {/* TAB 2: GLOBAL & SUPPORT CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3 shadow-2xs flex flex-col h-[480px]">
          {/* Channel selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setChatChannel('global')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chatChannel === 'global' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              🌐 Global Esports Lobby
            </button>
            <button
              onClick={() => setChatChannel('support')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chatChannel === 'support' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              🎧 Support Chat
            </button>
          </div>

          {/* Messages feed */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-sans">
            {currentChannelMessages.map((msg) => {
              const isMe = msg.userId === user.id;
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 text-xs ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div
                    className={`p-2.5 rounded-2xl max-w-[80%] ${
                      isMe
                        ? 'bg-orange-600 text-white rounded-tr-none'
                        : msg.role === 'admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200 rounded-tl-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-80 mb-0.5">
                      <span>{msg.userName}</span>
                      {msg.role === 'admin' && (
                        <span className="bg-amber-500 text-white px-1 rounded uppercase text-[8px] font-black">ADMIN</span>
                      )}
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message ${chatChannel === 'global' ? 'Global Lobby' : 'Support'}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: REPORT HACKER */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-2xs">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2 font-sans">
            <Flag className="w-5 h-5 text-red-600" /> Submit Player or Hacker Report
          </h3>

          <form onSubmit={handleReportSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reported Player Ingame Name / UID or Match Title
              </label>
              <input
                type="text"
                value={reportedName}
                onChange={(e) => setReportedName(e.target.value)}
                placeholder="e.g. Hacker_123 or Match #402"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Report Category</label>
              <select
                value={reportCat}
                onChange={(e) => setReportCat(e.target.value as ReportCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
              >
                <option value="hacker">Hacker / Headshot Script User</option>
                <option value="abuse">Abuse / Toxic Verbal Behavior</option>
                <option value="fake_player">Fake Player / Not Joining Room</option>
                <option value="room_issue">Room ID or Password Issue</option>
                <option value="other">Other Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description & Proof</label>
              <textarea
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                rows={4}
                placeholder="Describe what happened in detail..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-xs transition-all cursor-pointer"
            >
              Submit Report 🛡️
            </button>
          </form>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 text-slate-900 shadow-xl font-sans"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 font-sans">Edit Profile Details</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Free Fire Ingame Name</label>
                  <input
                    type="text"
                    value={editIngameName}
                    onChange={(e) => setEditIngameName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Free Fire UID Number</label>
                  <input
                    type="text"
                    value={editFreeFireUid}
                    onChange={(e) => setEditFreeFireUid(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-xs"
                >
                  Save Profile Changes ✅
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
