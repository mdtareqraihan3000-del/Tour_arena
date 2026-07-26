import React, { useState, useEffect } from 'react';
import { Timer, Zap, Flame, Clock } from 'lucide-react';
import { MatchStatus } from '../../types';

interface MatchCountdownTimerProps {
  startTimestamp?: number;
  matchDate?: string;
  matchTime?: string;
  status?: MatchStatus;
  compact?: boolean;
  showLabels?: boolean;
  className?: string;
}

export const MatchCountdownTimer: React.FC<MatchCountdownTimerProps> = ({
  startTimestamp,
  matchDate,
  matchTime,
  status = 'upcoming',
  compact = false,
  showLabels = true,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
    isStartingSoon: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      let targetMs = 0;

      if (startTimestamp && startTimestamp > 0) {
        targetMs = startTimestamp;
      } else if (matchDate && matchTime) {
        // Fallback parse matchDate & matchTime
        const [year, month, day] = matchDate.split('-').map(Number);
        const [hours, minutes] = matchTime.split(':').map(Number);
        if (year && month && day) {
          const targetDate = new Date(year, month - 1, day, hours || 0, minutes || 0, 0);
          targetMs = targetDate.getTime();
        }
      }

      if (!targetMs) {
        return {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOver: true,
          isStartingSoon: false,
        };
      }

      const diff = targetMs - Date.now();

      if (diff <= 0) {
        return {
          total: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isOver: true,
          isStartingSoon: false,
        };
      }

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const isStartingSoon = diff <= 30 * 60 * 1000; // < 30 minutes

      return {
        total: diff,
        days,
        hours,
        minutes,
        seconds,
        isOver: false,
        isStartingSoon,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp, matchDate, matchTime]);

  if (status === 'live') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/30 border border-red-500/60 text-red-400 font-extrabold text-xs animate-pulse ${className}`}>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <span>LIVE NOW 🔴</span>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[11px] font-bold ${className}`}>
        <span>Ended</span>
      </div>
    );
  }

  if (timeLeft.isOver) {
    return (
      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold ${className}`}>
        <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        <span>Room Starting Any Moment</span>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  // Compact Mode for Card headers / list items
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold tracking-wide border transition-all ${
          timeLeft.isStartingSoon
            ? 'bg-red-950/80 border-red-500 text-red-400 shadow-[0_0_12px_rgba(255,42,77,0.4)] animate-pulse'
            : 'bg-[#182030] border-amber-500/40 text-amber-300'
        } ${className}`}
      >
        {timeLeft.isStartingSoon ? (
          <Zap className="w-3.5 h-3.5 text-red-400 animate-bounce shrink-0" />
        ) : (
          <Timer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        )}
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  // Full Boxed Mode for featured section or dedicated countdown cards
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {/* Days box if > 0 */}
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-9 h-10 sm:w-11 sm:h-12 bg-[#0D111A] border border-amber-500/50 rounded-xl flex items-center justify-center shadow-inner">
            <span className="text-sm sm:text-base font-mono font-black text-amber-400">
              {pad(timeLeft.days)}
            </span>
          </div>
          {showLabels && <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Days</span>}
        </div>
      )}

      {timeLeft.days > 0 && <span className="text-amber-400 font-bold font-mono text-sm sm:text-base">:</span>}

      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-10 sm:w-11 sm:h-12 bg-[#0D111A] border rounded-xl flex items-center justify-center shadow-inner ${
          timeLeft.isStartingSoon ? 'border-red-500/80 shadow-[0_0_10px_rgba(255,42,77,0.3)]' : 'border-amber-500/50'
        }`}>
          <span className={`text-sm sm:text-base font-mono font-black ${
            timeLeft.isStartingSoon ? 'text-red-400' : 'text-amber-400'
          }`}>
            {pad(timeLeft.hours)}
          </span>
        </div>
        {showLabels && <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Hrs</span>}
      </div>

      <span className={`${timeLeft.isStartingSoon ? 'text-red-400' : 'text-amber-400'} font-bold font-mono text-sm sm:text-base`}>:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-10 sm:w-11 sm:h-12 bg-[#0D111A] border rounded-xl flex items-center justify-center shadow-inner ${
          timeLeft.isStartingSoon ? 'border-red-500/80 shadow-[0_0_10px_rgba(255,42,77,0.3)]' : 'border-amber-500/50'
        }`}>
          <span className={`text-sm sm:text-base font-mono font-black ${
            timeLeft.isStartingSoon ? 'text-red-400' : 'text-amber-400'
          }`}>
            {pad(timeLeft.minutes)}
          </span>
        </div>
        {showLabels && <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Min</span>}
      </div>

      <span className={`${timeLeft.isStartingSoon ? 'text-red-400' : 'text-amber-400'} font-bold font-mono text-sm sm:text-base`}>:</span>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-10 sm:w-11 sm:h-12 bg-[#0D111A] border rounded-xl flex items-center justify-center shadow-inner ${
          timeLeft.isStartingSoon ? 'border-red-500/80 bg-red-950/40 shadow-[0_0_12px_rgba(255,42,77,0.5)]' : 'border-amber-500/50'
        }`}>
          <span className={`text-sm sm:text-base font-mono font-black animate-pulse ${
            timeLeft.isStartingSoon ? 'text-red-400' : 'text-amber-400'
          }`}>
            {pad(timeLeft.seconds)}
          </span>
        </div>
        {showLabels && <span className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Sec</span>}
      </div>
    </div>
  );
};
