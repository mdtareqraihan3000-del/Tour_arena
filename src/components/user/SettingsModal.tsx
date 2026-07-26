import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Moon, Bell, Shield, Phone, Mail, FileText, HelpCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CopyButton } from '../common/CopyButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { appSettings, copyEverythingState } = useApp();

  const [darkMode, setDarkMode] = useState(true);
  const [matchNotifs, setMatchNotifs] = useState(true);
  const [walletNotifs, setWalletNotifs] = useState(true);
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms' | 'faq' | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg max-h-[85vh] bg-[#0D111A] border-2 border-red-500/80 rounded-2xl p-5 text-white shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-800 rounded-xl">
                <Settings className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">App Settings & Info</h2>
                <p className="text-xs text-gray-400">FIRE ARENA Version {appSettings.appVersion}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 text-xs">
            {/* Preferences */}
            <div className="p-3 bg-[#182030] rounded-xl border border-gray-800 space-y-3">
              <h3 className="font-bold text-gray-300 uppercase">App Preferences</h3>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-200">
                  <Moon className="w-4 h-4 text-amber-400" /> High Contrast Dark Esports Mode
                </span>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-10 h-6 rounded-full p-1 transition-all cursor-pointer ${
                    darkMode ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      darkMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-200">
                  <Bell className="w-4 h-4 text-emerald-400" /> Match & Room ID Push Alerts
                </span>
                <button
                  type="button"
                  onClick={() => setMatchNotifs(!matchNotifs)}
                  className={`w-10 h-6 rounded-full p-1 transition-all cursor-pointer ${
                    matchNotifs ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      matchNotifs ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-200">
                  <Bell className="w-4 h-4 text-amber-400" /> Wallet Deposit & Cashout Alerts
                </span>
                <button
                  type="button"
                  onClick={() => setWalletNotifs(!walletNotifs)}
                  className={`w-10 h-6 rounded-full p-1 transition-all cursor-pointer ${
                    walletNotifs ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-all ${
                      walletNotifs ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Master Copy Everything Button */}
            <div className="p-3 bg-gradient-to-r from-red-950 to-amber-950 border border-red-500/50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-300">Copy Everything (A to Z)</p>
                <p className="text-[11px] text-gray-300">Copy full profile, wallet, and support details.</p>
              </div>
              <button
                onClick={copyEverythingState}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg uppercase cursor-pointer"
              >
                Copy A-Z 📋
              </button>
            </div>

            {/* Support Links */}
            <div className="p-3 bg-[#182030] rounded-xl border border-gray-800 space-y-2">
              <h3 className="font-bold text-gray-300 uppercase">Contact Support</h3>
              <div className="flex items-center justify-between font-mono">
                <span>WhatsApp: {appSettings.supportPhone}</span>
                <CopyButton textToCopy={appSettings.supportPhone} label="WhatsApp" />
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>Telegram: {appSettings.telegramChannel}</span>
                <CopyButton textToCopy={appSettings.telegramChannel} label="Telegram" />
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>Email: {appSettings.supportEmail}</span>
                <CopyButton textToCopy={appSettings.supportEmail} label="Email" />
              </div>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveDoc('privacy')}
                className="p-2.5 bg-[#182030] hover:bg-gray-800 rounded-xl border border-gray-800 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" /> Privacy Policy
              </button>
              <button
                onClick={() => setActiveDoc('terms')}
                className="p-2.5 bg-[#182030] hover:bg-gray-800 rounded-xl border border-gray-800 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Terms & Rules
              </button>
              <button
                onClick={() => setActiveDoc('faq')}
                className="p-2.5 bg-[#182030] hover:bg-gray-800 rounded-xl border border-gray-800 font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> FAQ Guide
              </button>
            </div>

            {/* Render selected document drawer if clicked */}
            {activeDoc && (
              <div className="p-3 bg-[#182030] rounded-xl border border-red-500/40 space-y-2 text-gray-300">
                <div className="flex justify-between items-center text-white font-bold">
                  <span className="uppercase">{activeDoc} Document</span>
                  <button onClick={() => setActiveDoc(null)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {activeDoc === 'privacy' && (
                  <p className="text-[11px] leading-relaxed">
                    FIRE ARENA strictly protects user privacy, Free Fire UIDs, and payment transactions. No personal user data is ever sold or disclosed to third parties.
                  </p>
                )}
                {activeDoc === 'terms' && (
                  <p className="text-[11px] leading-relaxed">
                    1. Use of hacks or scripts results in permanent ban.<br />
                    2. Players must join custom room within 5 minutes.<br />
                    3. Withdrawals processed manually via bKash/Nagad within 5 minutes.
                  </p>
                )}
                {activeDoc === 'faq' && (
                  <p className="text-[11px] leading-relaxed">
                    Q: How do I get Room ID?<br />
                    A: Go to My Match tab when match status turns LIVE.<br />
                    Q: How do I cash out?<br />
                    A: Go to Wallet → Withdraw tab → Enter bKash/Nagad number.
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
