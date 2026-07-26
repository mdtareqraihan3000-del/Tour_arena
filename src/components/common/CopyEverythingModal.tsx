import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from './CopyButton';

interface CopyEverythingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopyEverythingModal: React.FC<CopyEverythingModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    paymentMethods,
    joinedMatches,
    matches,
    notifications,
    transactions,
    appSettings,
    copyEverythingState
  } = useApp();

  if (!isOpen) return null;

  // Active or latest match
  const latestJoined = joinedMatches[0];
  const matchDetails = latestJoined
    ? matches.find((m) => m.id === latestJoined.matchId)
    : matches[0];

  const latestNotif = notifications[0];
  const latestTx = transactions[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[85vh] bg-[#0E121B] border-2 border-red-500/60 rounded-2xl p-5 text-white overflow-hidden flex flex-col shadow-[0_0_50px_rgba(255,42,77,0.3)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-red-600 to-amber-500 rounded-lg">
                <Copy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-wide text-white uppercase flex items-center gap-1.5">
                  COPY EVERYTHING <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-gray-400">Instant Copy Utility (A to Z Details)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Copy Everything Button */}
          <div className="mt-4 p-3 bg-gradient-to-r from-red-900/40 via-red-800/30 to-amber-900/40 rounded-xl border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-amber-300">Master Copy All Information</p>
              <p className="text-xs text-gray-300">Copies user profile, wallet, room info & support details in 1 click.</p>
            </div>
            <button
              onClick={() => {
                copyEverythingState();
              }}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs rounded-lg uppercase tracking-wider shadow-lg hover:shadow-red-500/50 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Copy Everything (A TO Z)
            </button>
          </div>

          {/* List of items */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {/* 1. Room ID & Pass */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">1. Room ID & Password</p>
                <p className="text-amber-400 font-mono mt-0.5">
                  Room ID: {matchDetails?.roomId || '8849201'} | Pass: {matchDetails?.roomPassword || '123'}
                </p>
              </div>
              <div className="flex gap-1">
                <CopyButton textToCopy={matchDetails?.roomId || '8849201'} label="Room ID" />
                <CopyButton textToCopy={matchDetails?.roomPassword || '123'} label="Password" />
              </div>
            </div>

            {/* 2. Match Details */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">2. Match Details</p>
                <p className="text-gray-400 truncate max-w-xs">
                  {matchDetails?.title || 'Lone Wolf Headshot King'} | Fee: ৳{matchDetails?.entryFee || 30} | Prize: ৳{matchDetails?.prizePool || 300}
                </p>
              </div>
              <CopyButton
                textToCopy={`Match: ${matchDetails?.title || 'Lone Wolf'} | Date: ${matchDetails?.matchDate} ${matchDetails?.matchTime} | Fee: ৳${matchDetails?.entryFee} | Prize: ৳${matchDetails?.prizePool}`}
                label="Copy Match Details"
              />
            </div>

            {/* 3. Tournament Rules */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">3. Tournament Rules</p>
                <p className="text-gray-400 truncate max-w-xs">
                  {matchDetails?.rules?.join(', ') || 'Gun Attributes OFF, Character Skills ON, No Emote BM'}
                </p>
              </div>
              <CopyButton
                textToCopy={`RULES: ${matchDetails?.rules?.join('\n- ') || 'Gun Attributes OFF'}`}
                label="Copy Rules"
              />
            </div>

            {/* 4. Wallet Information */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">4. Wallet Information</p>
                <p className="text-emerald-400 font-bold">
                  Balance: ৳{user.walletBalance} (Winnings: ৳{user.winningBalance})
                </p>
              </div>
              <CopyButton
                textToCopy={`User: ${user.username} | Wallet Balance: ৳${user.walletBalance} | Winning Balance: ৳${user.winningBalance}`}
                label="Copy Wallet Info"
              />
            </div>

            {/* 5. Payment Numbers */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">5. Deposit Numbers (bKash & Nagad)</p>
                <p className="text-amber-400 font-mono">
                  bKash: {paymentMethods.bkashNumber} | Nagad: {paymentMethods.nagadNumber}
                </p>
              </div>
              <div className="flex gap-1">
                <CopyButton textToCopy={paymentMethods.bkashNumber} label="bKash" />
                <CopyButton textToCopy={paymentMethods.nagadNumber} label="Nagad" />
              </div>
            </div>

            {/* 6. Transaction ID */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">6. Last Transaction ID (TrxID)</p>
                <p className="text-gray-400 font-mono">
                  TrxID: {latestTx?.transactionId || 'BK8920192A'} ({latestTx?.type || 'deposit'})
                </p>
              </div>
              <CopyButton
                textToCopy={latestTx?.transactionId || 'BK8920192A'}
                label="Copy TrxID"
              />
            </div>

            {/* 7. Profile Information */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">7. Profile Information</p>
                <p className="text-gray-400">
                  {user.ingameName} | FF UID: {user.freeFireUid} | Phone: {user.phone}
                </p>
              </div>
              <CopyButton
                textToCopy={`Username: ${user.username}\nIn-game Name: ${user.ingameName}\nFF UID: ${user.freeFireUid}\nPhone: ${user.phone}\nEmail: ${user.email}`}
                label="Copy Profile Info"
              />
            </div>

            {/* 8. Notification Text */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">8. Latest Notification</p>
                <p className="text-gray-400 truncate max-w-xs">
                  {latestNotif?.title}: {latestNotif?.message}
                </p>
              </div>
              <CopyButton
                textToCopy={`${latestNotif?.title}\n${latestNotif?.message}`}
                label="Copy Notification"
              />
            </div>

            {/* 9. Support Contacts */}
            <div className="p-3 bg-[#151B27] rounded-xl border border-gray-800 flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-300">9. Official Support & Socials</p>
                <p className="text-gray-400">
                  WhatsApp: {appSettings.supportPhone} | Telegram: @FireArena
                </p>
              </div>
              <CopyButton
                textToCopy={`WhatsApp: ${appSettings.supportPhone}\nTelegram: ${appSettings.telegramChannel}\nEmail: ${appSettings.supportEmail}`}
                label="Copy Support"
              />
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-800 text-center">
            <p className="text-[11px] text-gray-500">FIRE ARENA Esports Utility System • Version {appSettings.appVersion}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
