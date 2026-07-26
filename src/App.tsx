import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';

// Common Components
import { LoadingScreen } from './components/common/LoadingScreen';
import { Header } from './components/common/Header';
import { NoticeTicker } from './components/common/NoticeTicker';
import { Toast } from './components/common/Toast';
import { CopyEverythingModal } from './components/common/CopyEverythingModal';

// Auth & Settings
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/user/SettingsModal';

// User Views
import { BottomNav } from './components/user/BottomNav';
import { HomeView } from './components/user/HomeView';
import { TournamentView } from './components/user/TournamentView';
import { MyMatchView } from './components/user/MyMatchView';
import { WalletView } from './components/user/WalletView';
import { LeaderboardView } from './components/user/LeaderboardView';
import { ProfileView } from './components/user/ProfileView';

// Admin Views
import { AdminNav } from './components/admin/AdminNav';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminMatchManager } from './components/admin/AdminMatchManager';
import { AdminCategoryManager } from './components/admin/AdminCategoryManager';
import { AdminWalletManager } from './components/admin/AdminWalletManager';
import { AdminUserManager } from './components/admin/AdminUserManager';
import { AdminBannerManager } from './components/admin/AdminBannerManager';
import { AdminPaymentManager } from './components/admin/AdminPaymentManager';
import { AdminNotificationManager } from './components/admin/AdminNotificationManager';
import { AdminReportsManager } from './components/admin/AdminReportsManager';
import { AdminSettingsManager } from './components/admin/AdminSettingsManager';

export function App() {
  const {
    activeAppPortal,
    activeTab,
    setActiveTab,
    activeAdminTab,
    appSettings
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedMatchIdForJoin, setSelectedMatchIdForJoin] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen version={appSettings.appVersion} />;
  }

  const handleJoinMatchClickFromHome = (matchId: string) => {
    setSelectedMatchIdForJoin(matchId);
    setActiveTab('tournament');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white flex flex-col">
      {/* Toast & Floating Modals */}
      <Toast />
      <CopyEverythingModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />

      {/* Main Top Header Navigation */}
      <Header
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Marquee Notice Board Ticker */}
      <NoticeTicker />

      {/* PORTAL ROUTER: USER APP VS ADMIN APP */}
      {activeAppPortal === 'user' ? (
        <main className="flex-1 pb-16">
          {activeTab === 'home' && (
            <HomeView onJoinMatchClick={handleJoinMatchClickFromHome} />
          )}
          {activeTab === 'tournament' && (
            <TournamentView
              selectedMatchIdForJoin={selectedMatchIdForJoin}
              onClearSelectedMatchId={() => setSelectedMatchIdForJoin(null)}
            />
          )}
          {activeTab === 'mymatch' && <MyMatchView />}
          {activeTab === 'wallet' && <WalletView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'profile' && (
            <ProfileView onOpenSettings={() => setIsSettingsModalOpen(true)} />
          )}

          {/* User App Fixed Bottom Navigation */}
          <BottomNav />
        </main>
      ) : (
        <main className="flex-1 pb-10">
          {/* Admin App Sticky Navigation Bar */}
          <AdminNav />

          <div className="pt-2">
            {activeAdminTab === 'dashboard' && <AdminDashboardView />}
            {activeAdminTab === 'matches' && <AdminMatchManager />}
            {activeAdminTab === 'categories' && <AdminCategoryManager />}
            {activeAdminTab === 'wallet' && <AdminWalletManager />}
            {activeAdminTab === 'users' && <AdminUserManager />}
            {activeAdminTab === 'banners' && <AdminBannerManager />}
            {activeAdminTab === 'payments' && <AdminPaymentManager />}
            {activeAdminTab === 'notifications' && <AdminNotificationManager />}
            {activeAdminTab === 'reports' && <AdminReportsManager />}
            {activeAdminTab === 'settings' && <AdminSettingsManager />}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
