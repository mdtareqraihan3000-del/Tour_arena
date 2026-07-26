import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Flame, Gamepad2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoadingScreen: React.FC = () => {
  const { setShowLoadingScreen, appSettings } = useApp();
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowLoadingScreen(false), 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 12;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [setShowLoadingScreen]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none">
      {/* Glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-600/30 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute inset-0 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center"
      >
        {/* Logo Badge Container */}
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-36 h-36 rounded-full border-2 border-dashed border-orange-500/60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-red-600 p-1 shadow-[0_0_40px_rgba(249,115,22,0.8)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center relative overflow-hidden p-1">
                <img
                  src="https://i.ibb.co.com/mC3kndP7/file-000000009f108207a989f5caf0fe98b3.png"
                  alt="Fire Arena Logo"
                  className="w-20 h-20 object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand App Name */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-orange-400 uppercase font-sans drop-shadow-md">
          FIRE ARENA
        </h1>
        <p className="text-xs font-bold text-orange-400 tracking-widest uppercase mt-1 mb-8 flex items-center justify-center gap-1.5">
          <Gamepad2 className="w-3.5 h-3.5 text-orange-400" /> FREE FIRE ESPORTS TOURNAMENTS
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-3 rounded-full p-0.5 border border-orange-500/40 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        {/* Progress Status */}
        <div className="flex justify-between w-full text-xs font-bold text-gray-300 mt-2.5">
          <span className="animate-pulse text-orange-300">Connecting to Fire Arena...</span>
          <span className="text-amber-400 font-mono">{progress}%</span>
        </div>

        {/* Version & Skip */}
        <div className="mt-10 text-[11px] text-gray-400 font-mono tracking-wider flex items-center gap-2">
          <span>v{appSettings.appVersion}</span>
          <span>•</span>
          <button
            onClick={() => setShowLoadingScreen(false)}
            className="text-indigo-400 hover:text-white underline cursor-pointer"
          >
            Skip Intro
          </button>
        </div>
      </motion.div>
    </div>
  );
};

