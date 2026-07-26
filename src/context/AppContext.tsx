import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AppNotification,
  AppRole,
  AppSettings,
  Category,
  ChatMessage,
  DepositRequest,
  JoinedMatch,
  LeaderboardUser,
  MatchCategoryType,
  PaymentMethods,
  PromoBanner,
  ReportCategory,
  ReportItem,
  TournamentMatch,
  UserProfile,
  WalletTransaction,
  WithdrawRequest
} from '../types';
import {
  INITIAL_ADMIN,
  INITIAL_APP_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_CHAT,
  INITIAL_DEPOSITS,
  INITIAL_LEADERBOARD,
  INITIAL_MATCHES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  INITIAL_WITHDRAWS
} from '../data/initialData';

interface AppContextType {
  // Navigation & View state
  appRole: AppRole;
  setAppRole: (role: AppRole) => void;
  activeAppPortal: AppRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  showLoadingScreen: boolean;
  setShowLoadingScreen: (show: boolean) => void;

  // Auth & Profile
  user: UserProfile;
  isLoggedIn: boolean;
  login: (emailPhone: string, pass: string, role?: AppRole) => { success: boolean; message: string };
  register: (data: { email: string; phone: string; username: string; ingameName: string; freeFireUid: string; pass: string }) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Data Collections
  categories: Category[];
  banners: PromoBanner[];
  matches: TournamentMatch[];
  joinedMatches: JoinedMatch[];
  transactions: WalletTransaction[];
  deposits: DepositRequest[];
  withdraws: WithdrawRequest[];
  notifications: AppNotification[];
  leaderboard: LeaderboardUser[];
  reports: ReportItem[];
  paymentMethods: PaymentMethods;
  appSettings: AppSettings;
  chatMessages: ChatMessage[];
  usersList: UserProfile[];

  // Actions
  joinMatch: (matchId: string, slotNumber: number, ingameName: string, freeFireUid: string) => { success: boolean; message: string };
  requestDeposit: (amount: number, method: 'bKash' | 'Nagad', trxId: string) => { success: boolean; message: string };
  requestWithdraw: (amount: number, method: 'bKash' | 'Nagad', accountNumber: string) => { success: boolean; message: string };
  
  // Admin Actions
  createMatch: (matchData: Omit<TournamentMatch, 'id' | 'joinedSlotsCount' | 'status' | 'createdAt'>) => void;
  editMatch: (matchId: string, matchData: Partial<TournamentMatch>) => void;
  publishRoomInfo: (matchId: string, roomId: string, pass: string) => void;
  declareMatchWinner: (matchId: string, winnerUserId: string, winnerIngameName: string, prizeAmount: number) => void;
  cancelMatch: (matchId: string, reason?: string) => void;

  approveDeposit: (depositId: string) => void;
  rejectDeposit: (depositId: string, note?: string) => void;

  approveWithdraw: (withdrawId: string) => void;
  rejectWithdraw: (withdrawId: string, note?: string) => void;

  createCategory: (cat: Omit<Category, 'id' | 'activeMatchesCount'>) => void;
  editCategory: (id: string, cat: Partial<Category>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBanner: (banner: Omit<PromoBanner, 'id'>) => void;
  createBanner: (banner: Omit<PromoBanner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<PromoBanner>) => void;
  deleteBanner: (id: string) => void;

  updatePaymentMethods: (pm: PaymentMethods) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  
  sendNotification: (title: string, message: string, userId?: string | 'all', type?: AppNotification['type']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  sendChatMessage: (text: string, channel?: 'global' | 'support') => void;
  submitReport: (reportedUserOrMatch: string, category: ReportCategory, description: string, evidenceUrl?: string) => void;
  
  banUser: (userId: string, reason: string) => void;
  unbanUser: (userId: string) => void;
  adjustUserWallet: (userId: string, amount: number, note: string) => void;

  // Utilities
  toastMessage: string | null;
  showToast: (msg: string) => void;
  copyToClipboard: (text: string, label: string) => void;
  copyEverythingState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Splash loading screen
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // App Role: 'user' | 'admin'
  const [appRole, setAppRoleState] = useState<AppRole>(() => {
    return (localStorage.getItem('fa_role') as AppRole) || 'user';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('home');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  // Active User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fa_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('fa_logged_in') !== 'false';
  });

  // Data Collections with localStorage caching
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fa_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [banners, setBanners] = useState<PromoBanner[]>(() => {
    const saved = localStorage.getItem('fa_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [matches, setMatches] = useState<TournamentMatch[]>(() => {
    const saved = localStorage.getItem('fa_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [joinedMatches, setJoinedMatches] = useState<JoinedMatch[]>(() => {
    const saved = localStorage.getItem('fa_joined_matches');
    return saved ? JSON.parse(saved) : [
      {
        id: 'jm_101',
        matchId: 'm_101',
        userId: 'user_101',
        slotNumber: 1,
        ingameName: '⚡RAIHAN_FF⚡',
        freeFireUid: '849204821',
        joinedAt: Date.now() - 3600000,
        entryFeePaid: 30,
        status: 'upcoming'
      },
      {
        id: 'jm_105',
        matchId: 'm_105',
        userId: 'user_101',
        slotNumber: 1,
        ingameName: '⚡RAIHAN_FF⚡',
        freeFireUid: '849204821',
        joinedAt: Date.now() - 86400000,
        entryFeePaid: 25,
        prizeWon: 180,
        status: 'completed'
      }
    ];
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('fa_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('fa_deposits');
    return saved ? JSON.parse(saved) : INITIAL_DEPOSITS;
  });

  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>(() => {
    const saved = localStorage.getItem('fa_withdraws');
    return saved ? JSON.parse(saved) : INITIAL_WITHDRAWS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('fa_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() => {
    const saved = localStorage.getItem('fa_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>(() => {
    const saved = localStorage.getItem('fa_payment_methods');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_METHODS;
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('fa_app_settings');
    return saved ? JSON.parse(saved) : INITIAL_APP_SETTINGS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fa_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('fa_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [usersList, setUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fa_users_list');
    return saved ? JSON.parse(saved) : [INITIAL_USER, INITIAL_ADMIN];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('fa_role', appRole); }, [appRole]);
  useEffect(() => { localStorage.setItem('fa_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('fa_logged_in', String(isLoggedIn)); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem('fa_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('fa_banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('fa_matches', JSON.stringify(matches)); }, [matches]);
  useEffect(() => { localStorage.setItem('fa_joined_matches', JSON.stringify(joinedMatches)); }, [joinedMatches]);
  useEffect(() => { localStorage.setItem('fa_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('fa_deposits', JSON.stringify(deposits)); }, [deposits]);
  useEffect(() => { localStorage.setItem('fa_withdraws', JSON.stringify(withdraws)); }, [withdraws]);
  useEffect(() => { localStorage.setItem('fa_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('fa_leaderboard', JSON.stringify(leaderboard)); }, [leaderboard]);
  useEffect(() => { localStorage.setItem('fa_payment_methods', JSON.stringify(paymentMethods)); }, [paymentMethods]);
  useEffect(() => { localStorage.setItem('fa_app_settings', JSON.stringify(appSettings)); }, [appSettings]);
  useEffect(() => { localStorage.setItem('fa_chat', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('fa_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('fa_users_list', JSON.stringify(usersList)); }, [usersList]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(`Copied ${label} to clipboard! 📋`);
  };

  // Copy Everything master utility
  const copyEverythingState = () => {
    const summary = `
=== FIRE ARENA MASTER DETAILS ===
App Version: ${appSettings.appVersion}
User: ${user.username} (${user.ingameName}) | UID: ${user.freeFireUid}
Wallet Balance: ৳${user.walletBalance}
bKash Deposit: ${paymentMethods.bkashNumber}
Nagad Deposit: ${paymentMethods.nagadNumber}
Support Whatsapp: ${appSettings.whatsappGroup}
Telegram: ${appSettings.telegramChannel}
Joined Matches Count: ${joinedMatches.length}
    `.trim();
    copyToClipboard(summary, 'Complete App & Account Details');
  };

  // Role Setter
  const setAppRole = (role: AppRole) => {
    setAppRoleState(role);
    if (role === 'admin') {
      const adminUser = usersList.find((u) => u.role === 'admin') || INITIAL_ADMIN;
      setUser(adminUser);
      showToast('Switched to Admin Portal Mode ⚡');
    } else {
      const normalUser = usersList.find((u) => u.role === 'user') || INITIAL_USER;
      setUser(normalUser);
      showToast('Switched to User App Mode 🎮');
    }
  };

  // Auth
  const login = (emailPhone: string, pass: string, roleOverride?: AppRole) => {
    if (emailPhone.toLowerCase().includes('admin') || roleOverride === 'admin') {
      const adminUser = usersList.find((u) => u.role === 'admin') || INITIAL_ADMIN;
      setUser(adminUser);
      setAppRoleState('admin');
      setIsLoggedIn(true);
      showToast('Welcome Admin! Accessing Admin Portal 🔥');
      return { success: true, message: 'Admin login successful!' };
    } else {
      const normalUser = usersList.find((u) => u.email === emailPhone || u.phone === emailPhone) || usersList.find((u) => u.role === 'user') || INITIAL_USER;
      setUser(normalUser);
      setAppRoleState('user');
      setIsLoggedIn(true);
      showToast(`Welcome back, ${normalUser.ingameName}! 🔥`);
      return { success: true, message: 'User login successful!' };
    }
  };

  const register = (data: { email: string; phone: string; username: string; ingameName: string; freeFireUid: string; pass: string }) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: data.email,
      phone: data.phone,
      username: data.username,
      ingameName: data.ingameName,
      freeFireUid: data.freeFireUid,
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      walletBalance: 50, // Welcome signup bonus ৳50!
      winningBalance: 0,
      totalEarnings: 0,
      totalWins: 0,
      totalMatches: 0,
      mvpCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      isBanned: false
    };

    setUser(newUser);
    setUsersList((prev) => [...prev, newUser]);
    setIsLoggedIn(true);
    setAppRoleState('user');

    // Add bonus transaction
    const bonusTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: newUser.id,
      userEmail: newUser.email,
      userName: newUser.username,
      type: 'deposit',
      amount: 50,
      method: 'Admin',
      status: 'approved',
      note: '🎁 Welcome Signup Bonus ৳50!',
      createdAt: Date.now()
    };
    setTransactions((prev) => [bonusTx, ...prev]);

    showToast('Registration successful! ৳50 Welcome Bonus added to Wallet! 🎉');
    return { success: true, message: 'Registered successfully!' };
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast('Logged out successfully.');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    setUsersList((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...data } : u)));
    showToast('Profile details updated successfully! ✅');
  };

  // Join Match System
  const joinMatch = (matchId: string, slotNumber: number, ingameName: string, freeFireUid: string) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return { success: false, message: 'Match not found!' };

    if (targetMatch.status !== 'upcoming') {
      return { success: false, message: 'This match is no longer open for registration!' };
    }

    if (targetMatch.joinedSlotsCount >= targetMatch.totalSlots) {
      return { success: false, message: 'Match is already FULL!' };
    }

    // Check if user already joined
    const alreadyJoined = joinedMatches.some((jm) => jm.matchId === matchId && jm.userId === user.id);
    if (alreadyJoined) {
      return { success: false, message: 'You have already joined this match!' };
    }

    // Check wallet balance
    if (user.walletBalance < targetMatch.entryFee) {
      return { success: false, message: `Insufficient Balance! Entry fee is ৳${targetMatch.entryFee}, but you have ৳${user.walletBalance}. Please Deposit first.` };
    }

    // Deduct entry fee
    const newBalance = user.walletBalance - targetMatch.entryFee;
    setUser((prev) => ({ ...prev, walletBalance: newBalance, totalMatches: prev.totalMatches + 1 }));
    setUsersList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, walletBalance: newBalance, totalMatches: u.totalMatches + 1 } : u))
    );

    // Update match slot count
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, joinedSlotsCount: m.joinedSlotsCount + 1 } : m))
    );

    // Create JoinedMatch record
    const newJoined: JoinedMatch = {
      id: `jm_${Date.now()}`,
      matchId,
      userId: user.id,
      slotNumber,
      ingameName,
      freeFireUid,
      joinedAt: Date.now(),
      entryFeePaid: targetMatch.entryFee,
      status: 'upcoming'
    };
    setJoinedMatches((prev) => [newJoined, ...prev]);

    // Create Transaction log
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      type: 'entry_fee',
      amount: targetMatch.entryFee,
      method: 'Wallet',
      status: 'approved',
      note: `Joined Match: ${targetMatch.title} (Slot #${slotNumber})`,
      createdAt: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);

    // Push notification
    sendNotification(
      '🎮 Match Joined Successfully!',
      `You joined ${targetMatch.title} in Slot #${slotNumber}. Check My Match tab for Room ID.`,
      user.id,
      'match'
    );

    // Confetti celebration animation!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Successfully Joined Match #${targetMatch.title}! 🎯`);
    return { success: true, message: 'Joined match successfully!' };
  };

  // Deposit Request
  const requestDeposit = (amount: number, method: 'bKash' | 'Nagad', trxId: string) => {
    if (amount < paymentMethods.minDeposit) {
      return { success: false, message: `Minimum deposit amount is ৳${paymentMethods.minDeposit}` };
    }

    if (!trxId.trim()) {
      return { success: false, message: 'Please enter valid Transaction ID (TrxID)!' };
    }

    const adminNum = method === 'bKash' ? paymentMethods.bkashNumber : paymentMethods.nagadNumber;

    const req: DepositRequest = {
      id: `dep_${Date.now()}`,
      userId: user.id,
      userName: user.username,
      userPhone: user.phone,
      amount,
      method,
      adminNumberSentTo: adminNum,
      transactionId: trxId.trim().toUpperCase(),
      status: 'pending',
      createdAt: Date.now()
    };

    setDeposits((prev) => [req, ...prev]);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      type: 'deposit',
      amount,
      method,
      paymentNumber: adminNum,
      transactionId: trxId.trim().toUpperCase(),
      status: 'pending',
      note: `Deposit Request via ${method}`,
      createdAt: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);

    sendNotification(
      '⌛ Deposit Request Submitted',
      `Your ৳${amount} deposit request via ${method} (TrxID: ${trxId}) is under review by Admin.`,
      user.id,
      'wallet'
    );

    showToast('Deposit Request Submitted! Admin will verify within 5 mins. ⚡');
    return { success: true, message: 'Deposit request submitted!' };
  };

  // Withdraw Request
  const requestWithdraw = (amount: number, method: 'bKash' | 'Nagad', accountNumber: string) => {
    if (amount < paymentMethods.minWithdraw) {
      return { success: false, message: `Minimum withdraw amount is ৳${paymentMethods.minWithdraw}` };
    }

    if (user.walletBalance < amount) {
      return { success: false, message: `Insufficient Balance! Your current balance is ৳${user.walletBalance}` };
    }

    if (!accountNumber.trim()) {
      return { success: false, message: 'Please enter your valid bKash / Nagad phone number!' };
    }

    // Deduct pending withdraw amount from balance
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance - amount }));
    setUsersList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, walletBalance: u.walletBalance - amount } : u))
    );

    const req: WithdrawRequest = {
      id: `wd_${Date.now()}`,
      userId: user.id,
      userName: user.username,
      amount,
      method,
      accountNumber,
      status: 'pending',
      createdAt: Date.now()
    };

    setWithdraws((prev) => [req, ...prev]);

    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.username,
      type: 'withdraw',
      amount,
      method,
      paymentNumber: accountNumber,
      status: 'pending',
      note: `Withdrawal Request to ${accountNumber}`,
      createdAt: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);

    sendNotification(
      '⌛ Withdraw Request Pending',
      `Your ৳${amount} cashout request to ${accountNumber} (${method}) is pending approval.`,
      user.id,
      'wallet'
    );

    showToast('Withdrawal Request Submitted! 💳');
    return { success: true, message: 'Withdraw request submitted!' };
  };

  // Admin match management
  const createMatch = (matchData: Omit<TournamentMatch, 'id' | 'joinedSlotsCount' | 'status' | 'createdAt'>) => {
    const newMatch: TournamentMatch = {
      ...matchData,
      id: `m_${Date.now()}`,
      joinedSlotsCount: 0,
      status: 'upcoming',
      createdAt: Date.now()
    };

    setMatches((prev) => [newMatch, ...prev]);
    sendNotification('🔥 New Tournament Match Published!', `New Match "${newMatch.title}" is now open for registration! Prize Pool: ৳${newMatch.prizePool}`, 'all', 'announcement');
    showToast('New Match Created & Published! 🎮');
  };

  const editMatch = (matchId: string, data: Partial<TournamentMatch>) => {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, ...data } : m)));
    showToast('Match details updated! ⚡');
  };

  const publishRoomInfo = (matchId: string, roomId: string, roomPassword: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, roomId, roomPassword, roomPublishedAt: Date.now(), status: 'live' }
          : m
      )
    );

    // Notify all players who joined this match
    const joined = joinedMatches.filter((jm) => jm.matchId === matchId);
    joined.forEach((jm) => {
      sendNotification(
        '🔑 Room ID & Password Available!',
        `Room ID: ${roomId} | Pass: ${roomPassword}. Join the custom room immediately!`,
        jm.userId,
        'match'
      );
    });

    showToast('Room ID & Password published to players! 🔑');
  };

  const declareMatchWinner = (matchId: string, winnerUserId: string, winnerIngameName: string, prizeAmount: number) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'completed',
              winnerUserId,
              winnerIngameName,
              winnerPrizeAmount: prizeAmount
            }
          : m
      )
    );

    // Update joined match status
    setJoinedMatches((prev) =>
      prev.map((jm) =>
        jm.matchId === matchId
          ? {
              ...jm,
              status: 'completed',
              prizeWon: jm.userId === winnerUserId ? prizeAmount : 0
            }
          : jm
      )
    );

    // Add winnings to user balance if winner is current active user or in usersList
    if (user.id === winnerUserId) {
      setUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + prizeAmount,
        winningBalance: prev.winningBalance + prizeAmount,
        totalEarnings: prev.totalEarnings + prizeAmount,
        totalWins: prev.totalWins + 1
      }));
    }

    setUsersList((prev) =>
      prev.map((u) =>
        u.id === winnerUserId
          ? {
              ...u,
              walletBalance: u.walletBalance + prizeAmount,
              winningBalance: u.winningBalance + prizeAmount,
              totalEarnings: u.totalEarnings + prizeAmount,
              totalWins: u.totalWins + 1
            }
          : u
      )
    );

    // Log transaction
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: winnerUserId,
      userEmail: 'winner@firearena.com',
      userName: winnerIngameName,
      type: 'prize_won',
      amount: prizeAmount,
      method: 'Wallet',
      status: 'approved',
      note: `1st Place Prize Winnings for Match #${matchId}`,
      createdAt: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);

    // Send broadcast notification
    sendNotification(
      '🏆 Match Winner Announced!',
      `Congratulations to ${winnerIngameName} for winning ৳${prizeAmount} in Match #${matchId}!`,
      'all',
      'winner'
    );

    showToast(`Declared ${winnerIngameName} as winner (৳${prizeAmount})! 👑`);
  };

  const cancelMatch = (matchId: string, reason?: string) => {
    const target = matches.find((m) => m.id === matchId);
    if (!target) return;

    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: 'cancelled' } : m)));

    // Refund players who joined
    const joined = joinedMatches.filter((jm) => jm.matchId === matchId);
    joined.forEach((jm) => {
      // Refund wallet balance
      if (user.id === jm.userId) {
        setUser((u) => ({ ...u, walletBalance: u.walletBalance + jm.entryFeePaid }));
      }
      setUsersList((list) =>
        list.map((u) => (u.id === jm.userId ? { ...u, walletBalance: u.walletBalance + jm.entryFeePaid } : u))
      );

      // Refund transaction log
      const tx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        userId: jm.userId,
        userEmail: 'user@firearena.com',
        userName: jm.ingameName,
        type: 'refund',
        amount: jm.entryFeePaid,
        method: 'Wallet',
        status: 'approved',
        note: `Match Cancelled Refund (${target.title}). Reason: ${reason || 'Admin cancelled'}`,
        createdAt: Date.now()
      };
      setTransactions((t) => [tx, ...t]);

      sendNotification(
        '⚠️ Match Cancelled & Fee Refunded',
        `Match "${target.title}" was cancelled. ৳${jm.entryFeePaid} has been refunded to your wallet.`,
        jm.userId,
        'system'
      );
    });

    showToast(`Match cancelled and ৳${target.entryFee * joined.length} total entry fees refunded! 🔄`);
  };

  // Admin Deposit Approval
  const approveDeposit = (depositId: string) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return;

    setDeposits((prev) => prev.map((d) => (d.id === depositId ? { ...d, status: 'approved' } : d)));

    // Add balance to target user in usersList
    setUsersList((list) =>
      list.map((u) => (u.id === dep.userId ? { ...u, walletBalance: u.walletBalance + dep.amount } : u))
    );

    // Update active user state if user ID matches or if active user is demo/registered player
    setUser((u) => {
      if (u.id === dep.userId || (u.role === 'user' && (dep.userId === 'user_101' || u.id === 'user_101'))) {
        return { ...u, walletBalance: u.walletBalance + dep.amount };
      }
      return u;
    });

    // Update transaction status
    setTransactions((prev) =>
      prev.map((t) =>
        t.transactionId === dep.transactionId || (t.userId === dep.userId && t.amount === dep.amount && t.type === 'deposit' && t.status === 'pending')
          ? { ...t, status: 'approved' }
          : t
      )
    );

    sendNotification(
      '✅ Deposit Approved!',
      `Your ৳${dep.amount} deposit via ${dep.method} (TrxID: ${dep.transactionId}) has been approved and added to your wallet!`,
      dep.userId,
      'wallet'
    );

    showToast(`Approved Deposit of ৳${dep.amount} for ${dep.userName}! 💰`);
  };

  const rejectDeposit = (depositId: string, note?: string) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return;

    setDeposits((prev) => prev.map((d) => (d.id === depositId ? { ...d, status: 'rejected', adminNote: note } : d)));
    setTransactions((prev) =>
      prev.map((t) => (t.transactionId === dep.transactionId ? { ...t, status: 'rejected', note: note || 'Rejected' } : t))
    );

    sendNotification(
      '❌ Deposit Rejected',
      `Your deposit request of ৳${dep.amount} was rejected. Note: ${note || 'Invalid Transaction ID or payment not received.'}`,
      dep.userId,
      'wallet'
    );

    showToast(`Rejected Deposit request from ${dep.userName}`);
  };

  // Admin Withdraw Approval
  const approveWithdraw = (withdrawId: string) => {
    const wd = withdraws.find((w) => w.id === withdrawId);
    if (!wd) return;

    setWithdraws((prev) => prev.map((w) => (w.id === withdrawId ? { ...w, status: 'approved' } : w)));
    setTransactions((prev) =>
      prev.map((t) => (t.paymentNumber === wd.accountNumber && t.amount === wd.amount ? { ...t, status: 'approved' } : t))
    );

    sendNotification(
      '✅ Withdrawal Dispatched!',
      `Your ৳${wd.amount} cashout to ${wd.method} (${wd.accountNumber}) has been sent successfully!`,
      wd.userId,
      'wallet'
    );

    showToast(`Approved & Dispatched ৳${wd.amount} cashout to ${wd.accountNumber}! 💳`);
  };

  const rejectWithdraw = (withdrawId: string, note?: string) => {
    const wd = withdraws.find((w) => w.id === withdrawId);
    if (!wd) return;

    setWithdraws((prev) => prev.map((w) => (w.id === withdrawId ? { ...w, status: 'rejected', adminNote: note } : w)));

    // Refund deducted balance back to user
    if (user.id === wd.userId) {
      setUser((u) => ({ ...u, walletBalance: u.walletBalance + wd.amount }));
    }
    setUsersList((list) =>
      list.map((u) => (u.id === wd.userId ? { ...u, walletBalance: u.walletBalance + wd.amount } : u))
    );

    sendNotification(
      '❌ Withdrawal Rejected & Refunded',
      `Your withdrawal request of ৳${wd.amount} was rejected. ৳${wd.amount} has been refunded to your wallet. Note: ${note || 'Incorrect number'}`,
      wd.userId,
      'wallet'
    );

    showToast(`Rejected Withdraw request & refunded ৳${wd.amount} to user!`);
  };

  // Category management
  const createCategory = (cat: Omit<Category, 'id' | 'activeMatchesCount'>) => {
    const newCat: Category = { ...cat, id: `cat_${Date.now()}`, activeMatchesCount: 0 };
    setCategories((prev) => [...prev, newCat]);
    showToast('Category created successfully!');
  };

  const editCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...cat } : c)));
    showToast('Category updated!');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted!');
  };

  // Banner management
  const addBanner = (banner: Omit<PromoBanner, 'id'>) => {
    const newB: PromoBanner = { ...banner, id: `ban_${Date.now()}` };
    setBanners((prev) => [...prev, newB]);
    showToast('Promo banner added!');
  };

  const createBanner = addBanner;

  const updateBanner = (id: string, banner: Partial<PromoBanner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...banner } : b)));
    showToast('Promo banner updated!');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Promo banner removed!');
  };

  // Payment methods
  const updatePaymentMethods = (pm: PaymentMethods) => {
    setPaymentMethods(pm);
    showToast('Payment methods & numbers updated! ⚡');
  };

  // App Settings
  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings((prev) => ({ ...prev, ...settings }));
    showToast('App Settings updated! ⚡');
  };

  // Notifications
  const sendNotification = (title: string, message: string, userId: string | 'all' = 'all', type: AppNotification['type'] = 'announcement') => {
    const notif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: Date.now()
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Marked all notifications as read!');
  };

  // Chat
  const sendChatMessage = (text: string, channel: 'global' | 'support' = 'global') => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `chat_${Date.now()}`,
      userId: user.id,
      userName: user.ingameName || user.username,
      userAvatar: user.avatarUrl,
      role: appRole,
      text,
      channel,
      createdAt: Date.now()
    };
    setChatMessages((prev) => [...prev, msg]);
  };

  // Reports
  const submitReport = (reportedUserOrMatch: string, category: ReportCategory, description: string, evidenceUrl?: string) => {
    const rep: ReportItem = {
      id: `rep_${Date.now()}`,
      userId: user.id,
      userName: user.username,
      reportedUserOrMatch,
      category,
      description,
      evidenceUrl,
      status: 'pending',
      createdAt: Date.now()
    };
    setReports((prev) => [rep, ...prev]);
    showToast('Report submitted! Admin team will review evidence. 🛡️');
  };

  // Ban / Unban
  const banUser = (userId: string, reason: string) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: true, banReason: reason } : u)));
    sendNotification('🚫 Account Banned', `Your account has been suspended by Admin. Reason: ${reason}`, userId, 'ban');
    showToast('User account banned.');
  };

  const unbanUser = (userId: string) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: false, banReason: undefined } : u)));
    sendNotification('✅ Account Unbanned', 'Your account access has been restored.', userId, 'system');
    showToast('User account unbanned.');
  };

  const adjustUserWallet = (userId: string, amount: number, note: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, walletBalance: Math.max(0, u.walletBalance + amount) } : u))
    );
    if (user.id === userId) {
      setUser((u) => ({ ...u, walletBalance: Math.max(0, u.walletBalance + amount) }));
    }
    const tx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      userEmail: 'user@firearena.com',
      userName: 'User',
      type: amount >= 0 ? 'deposit' : 'withdraw',
      amount: Math.abs(amount),
      method: 'Admin',
      status: 'approved',
      note: `Admin Adjustment: ${note}`,
      createdAt: Date.now()
    };
    setTransactions((prev) => [tx, ...prev]);
    showToast(`Adjusted wallet balance by ${amount >= 0 ? '+' : ''}৳${amount}`);
  };

  return (
    <AppContext.Provider
      value={{
        appRole,
        setAppRole,
        activeAppPortal: appRole,
        activeTab,
        setActiveTab,
        activeAdminTab,
        setActiveAdminTab,
        showLoadingScreen,
        setShowLoadingScreen,
        user,
        isLoggedIn,
        login,
        register,
        logout,
        updateProfile,
        categories,
        banners,
        matches,
        joinedMatches,
        transactions,
        deposits,
        withdraws,
        notifications,
        leaderboard,
        reports,
        paymentMethods,
        appSettings,
        chatMessages,
        usersList,
        joinMatch,
        requestDeposit,
        requestWithdraw,
        createMatch,
        editMatch,
        publishRoomInfo,
        declareMatchWinner,
        cancelMatch,
        approveDeposit,
        rejectDeposit,
        approveWithdraw,
        rejectWithdraw,
        createCategory,
        editCategory,
        updateCategory: editCategory,
        deleteCategory,
        addBanner,
        createBanner,
        updateBanner,
        deleteBanner,
        updatePaymentMethods,
        updateAppSettings,
        sendNotification,
        markNotificationAsRead,
        markAllNotificationsRead,
        sendChatMessage,
        submitReport,
        banUser,
        unbanUser,
        adjustUserWallet,
        toastMessage,
        showToast,
        copyToClipboard,
        copyEverythingState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
