import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, BookOpen, CheckCircle2, X, AlertTriangle, Trophy, Zap } from 'lucide-react';

interface TournamentRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentRulesModal: React.FC<TournamentRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0D111A] border-2 border-red-500/70 rounded-2xl p-5 text-white shadow-[0_0_40px_rgba(255,42,77,0.3)] overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wider text-white uppercase font-sans">
                  TOURNAMENT RULES & REGULATIONS (নিয়মাবলী)
                </h2>
                <p className="text-[11px] text-gray-400">Strict Guidelines for Fair Gameplay</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rules Body Content */}
          <div className="mt-4 space-y-3.5 overflow-y-auto pr-1 text-xs text-gray-300 font-sans leading-relaxed">
            {/* Rule 1 */}
            <div className="bg-[#151C2A] p-3 rounded-xl border border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. Correct In-Game Details (সঠিক আইডি তথ্য)</span>
              </div>
              <p className="text-gray-300 pl-6">
                You must enter your exact Free Fire Ingame Name (IGN) and Free Fire UID when joining. Joining with an incorrect UID will lead to immediate disqualification without refund.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="bg-[#151C2A] p-3 rounded-xl border border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>2. Custom Room ID & Password (রুম আইডি ও পাসওয়ার্ড)</span>
              </div>
              <p className="text-gray-300 pl-6">
                Room ID & Password will be published 5 to 10 minutes before the match start time strictly in your <strong className="text-white">"My Match"</strong> tab. Do not share Room credentials with non-joined friends!
              </p>
            </div>

            {/* Rule 3 */}
            <div className="bg-[#151C2A] p-3 rounded-xl border border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>3. Strict Anti-Hack Policy (হ্যাক সম্পূর্ণ নিষিদ্ধ)</span>
              </div>
              <p className="text-gray-300 pl-6">
                Use of hacks, scripts, third-party mod APKs, auto-aim, config files, or teaming with enemies is strictly prohibited. Violators will face a permanent account ban & forfeiture of balance.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="bg-[#151C2A] p-3 rounded-xl border border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>4. Slot Position & Timings (নির্দিষ্ট স্লট ও সময়সূচী)</span>
              </div>
              <p className="text-gray-300 pl-6">
                Join the custom room using your assigned Slot Number. Sitting in another player's slot will result in being kicked from the room by the room host.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="bg-[#151C2A] p-3 rounded-xl border border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>5. Prize Distribution & Screenshots (পুরস্কার প্রদান)</span>
              </div>
              <p className="text-gray-300 pl-6">
                Prize money will be credited automatically to your app wallet within 10–30 minutes after match completion and admin verification.
              </p>
            </div>
          </div>

          {/* Footer Close */}
          <div className="mt-4 pt-3 border-t border-gray-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              I Understand The Rules ✅
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
