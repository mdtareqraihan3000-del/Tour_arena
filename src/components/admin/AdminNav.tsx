import React from 'react';
import { LayoutDashboard, Gamepad2, Layers, Wallet, Users, Image, CreditCard, Bell, Flag, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminNav: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, deposits, withdraws } = useApp();

  const pendingWalletCount = deposits.filter((d) => d.status === 'pending').length + withdraws.filter((w) => w.status === 'pending').length;

  const adminTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'matches', label: 'Matches', icon: Gamepad2 },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'wallet', label: 'Wallet', icon: Wallet, badge: pendingWalletCount },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Alerts', icon: Bell },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-[#0D111A] border-b border-amber-500/40 px-3 py-2 sticky top-14 z-30 overflow-x-auto scrollbar-none shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center gap-1.5 min-w-max">
        {adminTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeAdminTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveAdminTab(t.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                  : 'bg-[#182030] text-gray-300 hover:text-white border border-gray-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {t.badge && t.badge > 0 ? (
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {t.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
