import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Lock, Mail, Phone, User, Shield, Gamepad2, CheckSquare, Square, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [emailPhone, setEmailPhone] = useState('player@firearena.com');
  const [password, setPassword] = useState('player123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register states
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regIngameName, setRegIngameName] = useState('');
  const [regFreeFireUid, setRegFreeFireUid] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailPhone.trim() || !password.trim()) {
      showToast('Please enter Email/Phone and Password!');
      return;
    }
    const res = login(emailPhone, password);
    if (res.success) {
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPhone || !regIngameName || !regFreeFireUid || !regPassword) {
      showToast('Please fill out all registration fields!');
      return;
    }
    const res = register({
      email: regEmail,
      phone: regPhone,
      username: regUsername || regIngameName,
      ingameName: regIngameName,
      freeFireUid: regFreeFireUid,
      pass: regPassword
    });
    if (res.success) {
      onClose();
    }
  };

  const handlePresetLogin = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      login('admin@firearena.com', 'admin123', 'admin');
    } else {
      login('player@firearena.com', 'player123', 'user');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-[#0D111A] border-2 border-red-500/70 rounded-2xl p-6 text-white shadow-[0_0_50px_rgba(255,42,77,0.4)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 p-0.5 bg-gradient-to-tr from-red-600 to-amber-500 rounded-xl shadow-lg overflow-hidden">
                <img
                  src="https://i.ibb.co.com/mC3kndP7/file-000000009f108207a989f5caf0fe98b3.png"
                  alt="FIRE ARENA Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-wider text-white uppercase font-sans">
                  FIRE ARENA
                </h2>
                <p className="text-xs text-red-400 font-semibold">Esports Tournament Account</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preset Instant Login Shortcuts */}
          <div className="my-4 p-3 bg-[#151C2A] rounded-xl border border-red-500/30">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" /> One-Click Quick Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePresetLogin('user')}
                className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Gamepad2 className="w-4 h-4" /> Demo Player
              </button>
              <button
                onClick={() => handlePresetLogin('admin')}
                className="px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4" /> Demo Admin
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#121622] rounded-xl p-1 mb-5 border border-gray-800">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'login' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                tab === 'register' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Form */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={emailPhone}
                    onChange={(e) => setEmailPhone(e.target.value)}
                    placeholder="player@firearena.com or 01700000000"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-gray-200"
                >
                  {rememberMe ? (
                    <CheckSquare className="w-4 h-4 text-red-500" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-600" />
                  )}
                  <span>Remember Me</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-red-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm rounded-xl uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,77,0.5)] transition-all cursor-pointer active:scale-95"
              >
                Login Account ⚡
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="gamer@gmail.com"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number (bKash/Nagad)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Free Fire In-Game Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={regIngameName}
                    onChange={(e) => setRegIngameName(e.target.value)}
                    placeholder="e.g. ⚡RAIHAN_FF⚡"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Free Fire UID Number</label>
                <div className="relative">
                  <Gamepad2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={regFreeFireUid}
                    onChange={(e) => setRegFreeFireUid(e.target.value)}
                    placeholder="e.g. 849204821"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#151C2A] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Create Account & Get ৳50 Bonus! 🎉
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-xs text-gray-300">
                Contact Fire Arena Admin Support or WhatsApp to reset your password instantly without OTP!
              </p>
              <div className="p-3 bg-[#151C2A] rounded-xl text-left text-xs font-mono text-amber-300">
                Support WhatsApp: +8801700001122
                <br />
                Support Email: reset@firearena.com
              </div>
              <button
                onClick={() => setTab('login')}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
