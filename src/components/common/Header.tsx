import React, { useState } from 'react';
import { Flame, Wallet, Bell, Shield, UserCheck, Copy, Settings, KeyRound, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyEverythingModal } from './CopyEverythingModal';
import { AdminPasscodeModal } from './AdminPasscodeModal';
import { TournamentRulesModal } from './TournamentRulesModal';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenNotifications }) => {
  const { user, appRole, setAppRole, notifications, setActiveTab, appSettings, showToast } = useApp();
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isAdminPasscodeOpen, setIsAdminPasscodeOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
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

  const unreadCount = notifications.filter((n) => !n.read && (n.userId === user.id || n.userId === 'all')).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 backdrop-blur-md px-4 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-500 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="https://i.ibb.co.com/mC3kndP7/file-000000009f108207a989f5caf0fe98b3.png"
                  alt="Fire Arena Logo"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-orange-600 font-sans">
                  Fire Arena
                </span>
                {appRole === 'admin' && (
                  <span className="text-[10px] font-black px-1.5 py-0.2 bg-orange-100 text-orange-700 border border-orange-200 rounded uppercase">
                    AP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Rules Button */}
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Tournament Rules & Guidelines"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">Rules</span>
            </button>

            {/* Quick Wallet Balance Badge */}
            {appRole === 'user' && (
              <button
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 font-black text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
                title="Wallet Balance"
              >
                <Wallet className="w-3.5 h-3.5 text-orange-600" />
                <span>৳{user.walletBalance}</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* AP Tap Button */}
            {appRole === 'user' && (
              <button
                onClick={handleApClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-600/10 border border-orange-200 hover:bg-orange-600/20 text-orange-600 text-xs font-black transition-all cursor-pointer active:scale-95"
                title="AP Access"
              >
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                <span>AP</span>
              </button>
            )}

            {/* Exit AP Button */}
            {appRole === 'admin' && (
              <button
                onClick={() => setAppRole('user')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs tracking-wide border transition-all cursor-pointer bg-red-100 text-red-600 border-red-200 hover:bg-red-200 shadow-2xs"
                title="Exit AP"
              >
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>Exit AP</span>
              </button>
            )}

            {/* User Profile Avatar Icon button */}
            <button
              onClick={() => setActiveTab('profile')}
              className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-all cursor-pointer shadow-2xs"
              title="Profile"
            >
              <UserCheck className="w-4 h-4 text-orange-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Copy Everything Modal */}
      <CopyEverythingModal isOpen={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} />

      {/* Admin Passcode Modal */}
      <AdminPasscodeModal
        isOpen={isAdminPasscodeOpen}
        onClose={() => setIsAdminPasscodeOpen(false)}
      />

      {/* Tournament Rules Modal */}
      <TournamentRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </>
  );
};
