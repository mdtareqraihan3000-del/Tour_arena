import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] bg-[#121824]/95 border-2 border-red-500/80 text-white px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(255,42,77,0.4)] backdrop-blur-md flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-tr from-red-600 to-amber-500 rounded-lg shrink-0 shadow-md">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-100 leading-snug flex-1">
            {toastMessage}
          </p>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
