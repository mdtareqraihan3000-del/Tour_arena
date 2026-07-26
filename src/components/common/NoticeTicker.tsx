import React from 'react';
import { Flame, Megaphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NoticeTicker: React.FC = () => {
  const { appSettings } = useApp();

  if (!appSettings.globalAnnouncement) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-[#180A10] to-red-950 border-y border-red-500/30 px-3 py-1.5 text-xs text-amber-300 font-medium overflow-hidden flex items-center gap-2 select-none shadow-sm">
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded uppercase shrink-0 tracking-wider shadow">
        <Megaphone className="w-3 h-3 animate-bounce" /> NOTICE
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500 inline" />
            {appSettings.globalAnnouncement}
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500 inline" />
            {appSettings.globalAnnouncement}
          </span>
        </div>
      </div>
    </div>
  );
};
