import React from 'react';
import { Home, Gamepad2, Wallet, Trophy, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, joinedMatches } = useApp();

  const myMatchesCount = joinedMatches.length;

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tournament', label: 'Matches', icon: Gamepad2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'mymatch', label: 'Results', icon: Trophy, badge: myMatchesCount },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-3 max-w-lg mx-auto pointer-events-auto">
      <nav className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-2 py-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-orange-100/90 text-orange-600 font-bold scale-105 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-slate-500'}`} />
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-sans">
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

