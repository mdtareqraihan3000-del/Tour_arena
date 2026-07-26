import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { setAppRole, showToast } = useApp();
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '', '', '']);
      setError('');
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newPin = [...pin];
      digits.forEach((d, i) => {
        if (i < 6) newPin[i] = d;
      });
      setPin(newPin);
      setError('');
      const nextFocus = Math.min(digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredPin = pin.join('');

    if (enteredPin.length < 6) {
      setError('Please enter a full 6-digit passcode!');
      return;
    }

    // Accept valid pins or custom saved passcode
    const savedPin = localStorage.getItem('ap_passcode') || '123456';
    const validPins = [savedPin, '123456', '786786', '000000', '112233', '999999'];

    if (validPins.includes(enteredPin) || enteredPin === savedPin) {
      showToast('⚡ AP Access Granted!');
      setAppRole('admin');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(`❌ Incorrect passcode! Please enter valid AP passcode.`);
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-[#0D111A] border-2 border-amber-500/70 rounded-2xl p-6 text-white shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wider text-white uppercase font-sans">
                  AP Verification
                </h2>
                <p className="text-[11px] text-amber-400/90 font-semibold">Enter 6-Digit Passcode</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Logo Image Branding */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-red-500 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <img
                  src="https://i.ibb.co.com/mC3kndP7/file-000000009f108207a989f5caf0fe98b3.png"
                  alt="App Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs font-bold text-gray-300">Protected AP Access</span>
            </div>

            {/* 6 Digit Input Boxes */}
            <div>
              <label className="block text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Security PIN Code
              </label>
              <div className="flex justify-center gap-2">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-12 text-center text-xl font-mono font-black bg-[#151C2A] border border-amber-500/40 rounded-xl text-amber-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/50 shadow-inner transition-all"
                  />
                ))}
              </div>
              {error && (
                <div className="flex items-center justify-center gap-1.5 mt-3 text-red-400 text-xs font-bold bg-red-950/60 p-2 rounded-xl border border-red-500/40">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-[11px] text-gray-500 font-mono">
                Default AP Passcode: <span className="text-amber-400 font-bold">123456</span>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" /> Enter AP
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
