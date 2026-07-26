import {
  AppSettings,
  Category,
  DepositRequest,
  LeaderboardUser,
  PaymentMethods,
  PromoBanner,
  TournamentMatch,
  UserProfile,
  WithdrawRequest,
  WalletTransaction,
  AppNotification,
  ChatMessage
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user_101',
  email: 'player@firearena.com',
  phone: '+8801700112233',
  username: 'FirePro_Raihan',
  ingameName: '⚡RAIHAN_FF⚡',
  freeFireUid: '849204821',
  role: 'user',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  walletBalance: 250,
  winningBalance: 120,
  totalEarnings: 850,
  totalWins: 14,
  totalMatches: 28,
  mvpCount: 8,
  joinedDate: '2026-01-15',
  isBanned: false,
  rememberMe: true
};

export const INITIAL_ADMIN: UserProfile = {
  id: 'admin_001',
  email: 'admin@firearena.com',
  phone: '+8801800998877',
  username: 'FIRE_ADMIN',
  ingameName: 'ADMIN_OFFICIAL',
  freeFireUid: '999000111',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  walletBalance: 10000,
  winningBalance: 5000,
  totalEarnings: 0,
  totalWins: 99,
  totalMatches: 100,
  mvpCount: 50,
  joinedDate: '2025-12-01',
  isBanned: false
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'Lone Wolf 1v1',
    type: 'lone_wolf_1v1',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    description: 'Direct 1v1 Free Fire combat arena. Show off your headshot accuracy!',
    activeMatchesCount: 6
  },
  {
    id: 'cat_2',
    name: 'Lone Wolf 2v2',
    type: 'lone_wolf_2v2',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    description: 'Duo tactical team showdown. Team up with your best partner.',
    activeMatchesCount: 4
  },
  {
    id: 'cat_3',
    name: 'Weekly Championship',
    type: 'weekly_tournament',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    description: 'Big prize pool weekly tournament for top Lone Wolf contenders.',
    activeMatchesCount: 2
  },
  {
    id: 'cat_4',
    name: 'Special Tournament',
    type: 'special_tournament',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    description: 'High stake custom room special tournaments with exclusive badges!',
    activeMatchesCount: 3
  }
];

export const INITIAL_BANNERS: PromoBanner[] = [
  {
    id: 'ban_1',
    title: '🔥 LONE WOLF SEASON 12 🔥',
    subtitle: 'Win up to ৳2,500 Cash Prize Every Night! Join Now.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    targetMatchId: 'm_101',
    active: true
  },
  {
    id: 'ban_2',
    title: '⚡ INSTANT BKASH & NAGAD CASHOUT ⚡',
    subtitle: 'Fast 5-Minute Withdrawal Approval Guaranteed!',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'ban_3',
    title: '👑 WEEKLY DUO CHAMPIONSHIP 👑',
    subtitle: 'Entry Fee ৳50 - 1st Prize ৳1,000 + Per Kill ৳20!',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    targetMatchId: 'm_102',
    active: true
  }
];

const now = Date.now();
const hourInMs = 3600 * 1000;

export const INITIAL_MATCHES: TournamentMatch[] = [
  {
    id: 'm_101',
    title: 'Lone Wolf 1v1 Headshot King #402',
    categoryId: 'cat_1',
    categoryType: 'lone_wolf_1v1',
    categoryName: 'Lone Wolf 1v1',
    matchDate: new Date(now + hourInMs * 1.5).toISOString().split('T')[0],
    matchTime: '20:30',
    startTimestamp: now + hourInMs * 1.5,
    entryFee: 30,
    prizePool: 300,
    firstPrize: 200,
    secondPrize: 100,
    perKillPrize: 15,
    totalSlots: 2,
    joinedSlotsCount: 1,
    mapName: 'Iron Cage (Lone Wolf)',
    rules: [
      'Gun Attributes: OFF',
      'Character Skills: ON',
      'No Grenade Spamming',
      'Must join room within 5 mins of Room ID publication',
      'Emote BM / Hackers will be instantly disqualified & banned'
    ],
    status: 'upcoming',
    roomId: '8849201',
    roomPassword: '123',
    roomPublishedAt: now - 300000,
    createdAt: now - 3600000
  },
  {
    id: 'm_102',
    title: 'Lone Wolf 2v2 Duo Destruction #18',
    categoryId: 'cat_2',
    categoryType: 'lone_wolf_2v2',
    categoryName: 'Lone Wolf 2v2',
    matchDate: new Date(now + hourInMs * 3).toISOString().split('T')[0],
    matchTime: '22:00',
    startTimestamp: now + hourInMs * 3,
    entryFee: 50,
    prizePool: 600,
    firstPrize: 400,
    secondPrize: 200,
    perKillPrize: 20,
    totalSlots: 4,
    joinedSlotsCount: 2,
    mapName: 'Science Lab (Lone Wolf)',
    rules: [
      'Duo Team Play',
      'Both players must enter correct FF UID',
      'No Emulator / PC players allowed',
      'Fair play strictly enforced'
    ],
    status: 'upcoming',
    createdAt: now - 7200000
  },
  {
    id: 'm_103',
    title: 'Special Mega Lone Wolf 1v1 Showdown',
    categoryId: 'cat_4',
    categoryType: 'special_tournament',
    categoryName: 'Special Tournament',
    matchDate: new Date(now + hourInMs * 6).toISOString().split('T')[0],
    matchTime: '23:30',
    startTimestamp: now + hourInMs * 6,
    entryFee: 100,
    prizePool: 1500,
    firstPrize: 1000,
    secondPrize: 500,
    perKillPrize: 50,
    totalSlots: 16,
    joinedSlotsCount: 12,
    mapName: 'Bermuda Arena',
    rules: [
      'Bo5 Lone Wolf Custom Format',
      'Admin will spectate live',
      'Screen recording mandatory for finals'
    ],
    status: 'upcoming',
    createdAt: now - 10000000
  },
  {
    id: 'm_104',
    title: 'LIVE NOW: Lone Wolf Pro Duel #099',
    categoryId: 'cat_1',
    categoryType: 'lone_wolf_1v1',
    categoryName: 'Lone Wolf 1v1',
    matchDate: new Date(now).toISOString().split('T')[0],
    matchTime: '19:00',
    startTimestamp: now - 600000,
    entryFee: 20,
    prizePool: 200,
    firstPrize: 150,
    secondPrize: 50,
    perKillPrize: 10,
    totalSlots: 2,
    joinedSlotsCount: 2,
    mapName: 'Iron Cage',
    rules: ['No hacks', 'Respect opponent'],
    status: 'live',
    roomId: '7729104',
    roomPassword: '777',
    roomPublishedAt: now - 900000,
    createdAt: now - 2000000
  },
  {
    id: 'm_105',
    title: 'COMPLETED: Lone Wolf Midnight Clash #390',
    categoryId: 'cat_1',
    categoryType: 'lone_wolf_1v1',
    categoryName: 'Lone Wolf 1v1',
    matchDate: new Date(now - hourInMs * 24).toISOString().split('T')[0],
    matchTime: '21:00',
    startTimestamp: now - hourInMs * 24,
    entryFee: 25,
    prizePool: 250,
    firstPrize: 180,
    secondPrize: 70,
    perKillPrize: 15,
    totalSlots: 2,
    joinedSlotsCount: 2,
    mapName: 'Iron Cage',
    rules: ['Standard Lone Wolf'],
    status: 'completed',
    roomId: '9012384',
    roomPassword: '999',
    winnerUserId: 'user_101',
    winnerIngameName: '⚡RAIHAN_FF⚡',
    winnerPrizeAmount: 180,
    createdAt: now - hourInMs * 30
  }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethods = {
  bkashNumber: '01712345678',
  nagadNumber: '01887654321',
  bkashInstructions: '1. Go to your bKash app or dial *247#\n2. Select "Send Money"\n3. Enter target number: 01712345678\n4. Enter Amount & Reference "FIREARENA"\n5. Copy Transaction ID (TrxID) & paste below.',
  nagadInstructions: '1. Open Nagad app or dial *167#\n2. Choose "Send Money"\n3. Target number: 01887654321\n4. Enter Amount & complete transaction\n5. Copy Transaction ID (TrxID) & paste below.',
  minDeposit: 50,
  minWithdraw: 100
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    userId: 'user_101',
    username: 'FirePro_Raihan',
    ingameName: '⚡RAIHAN_FF⚡',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    totalWins: 42,
    totalKills: 184,
    totalEarnings: 3850,
    totalMatches: 58,
    mvpCount: 24,
    winRate: 72.4
  },
  {
    rank: 2,
    userId: 'user_202',
    username: 'SniperGod_Afridi',
    ingameName: 'AFRIDI_ONE_TAP',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    totalWins: 38,
    totalKills: 215,
    totalEarnings: 3200,
    totalMatches: 52,
    mvpCount: 19,
    winRate: 73.1
  },
  {
    rank: 3,
    userId: 'user_303',
    username: 'AWM_King_Tanvir',
    ingameName: 'TANVIR_444',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    totalWins: 31,
    totalKills: 162,
    totalEarnings: 2750,
    totalMatches: 49,
    mvpCount: 15,
    winRate: 63.2
  },
  {
    rank: 4,
    userId: 'user_404',
    username: 'Toxic_Siam',
    ingameName: 'SIAM_M1887',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    totalWins: 27,
    totalKills: 145,
    totalEarnings: 2100,
    totalMatches: 44,
    mvpCount: 11,
    winRate: 61.3
  },
  {
    rank: 5,
    userId: 'user_505',
    username: 'NoobToPro_Tamim',
    ingameName: 'TAMIM_BOSS',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    totalWins: 22,
    totalKills: 110,
    totalEarnings: 1850,
    totalMatches: 40,
    mvpCount: 9,
    winRate: 55.0
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_01',
    userId: 'user_101',
    userEmail: 'player@firearena.com',
    userName: 'FirePro_Raihan',
    type: 'deposit',
    amount: 200,
    method: 'bKash',
    paymentNumber: '01712345678',
    transactionId: 'BK8920192A',
    status: 'approved',
    createdAt: now - 86400000 * 2
  },
  {
    id: 'tx_02',
    userId: 'user_101',
    userEmail: 'player@firearena.com',
    userName: 'FirePro_Raihan',
    type: 'entry_fee',
    amount: 30,
    method: 'Wallet',
    status: 'approved',
    note: 'Joined Lone Wolf 1v1 Headshot King #402',
    createdAt: now - 3600000
  },
  {
    id: 'tx_03',
    userId: 'user_101',
    userEmail: 'player@firearena.com',
    userName: 'FirePro_Raihan',
    type: 'prize_won',
    amount: 180,
    method: 'Wallet',
    status: 'approved',
    note: 'Winner Prize for Lone Wolf Midnight Clash #390',
    createdAt: now - 86400000
  }
];

export const INITIAL_DEPOSITS: DepositRequest[] = [
  {
    id: 'dep_101',
    userId: 'user_101',
    userName: 'FirePro_Raihan',
    userPhone: '+8801700112233',
    amount: 200,
    method: 'bKash',
    adminNumberSentTo: '01712345678',
    transactionId: 'BK8920192A',
    status: 'approved',
    createdAt: now - 86400000 * 2
  }
];

export const INITIAL_WITHDRAWS: WithdrawRequest[] = [
  {
    id: 'wd_101',
    userId: 'user_101',
    userName: 'FirePro_Raihan',
    amount: 100,
    method: 'bKash',
    accountNumber: '01700112233',
    status: 'approved',
    createdAt: now - 86400000
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'all',
    title: '🔥 Welcome to FIRE ARENA!',
    message: 'Join daily Free Fire Lone Wolf Tournaments and win instant bKash/Nagad prize money!',
    type: 'announcement',
    read: false,
    createdAt: now - 86400000 * 3
  },
  {
    id: 'notif_2',
    userId: 'user_101',
    title: '🎮 Room ID Published!',
    message: 'Room ID: 8849201 | Pass: 123 for Match #402 is now available in your My Match tab.',
    type: 'match',
    read: false,
    createdAt: now - 300000,
    matchId: 'm_101'
  },
  {
    id: 'notif_3',
    userId: 'user_101',
    title: '💰 Deposit Approved',
    message: 'Your ৳200 bKash deposit has been approved and added to your wallet balance.',
    type: 'wallet',
    read: true,
    createdAt: now - 86400000 * 2
  }
];

export const INITIAL_APP_SETTINGS: AppSettings = {
  maintenanceMode: false,
  appVersion: 'v2.4.0',
  globalAnnouncement: '🔥 SEASON 12 LONE WOLF TOURNAMENT IS LIVE! JOIN MATCHES NOW & WIN INSTANT BKASH CASH PRIZES!',
  supportPhone: '+8801700001122',
  supportEmail: 'support@firearena.com',
  whatsappGroup: 'https://chat.whatsapp.com/FireArenaEsports',
  telegramChannel: 'https://t.me/FireArenaEsportsOfficial'
};

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'c1',
    userId: 'user_202',
    userName: 'AFRIDI_ONE_TAP',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    text: 'Who is ready for Lone Wolf 1v1 tonight at 8:30 PM?',
    channel: 'global',
    createdAt: now - 1800000
  },
  {
    id: 'c2',
    userId: 'user_101',
    userName: '⚡RAIHAN_FF⚡',
    userAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    text: 'I am joined in Slot 1! Good luck everyone 🔥',
    channel: 'global',
    createdAt: now - 1200000
  },
  {
    id: 'c3',
    userId: 'admin_001',
    userName: 'FIRE_ADMIN',
    userAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    text: 'Room ID & Password will be published 10 minutes before match start. Keep your apps open!',
    channel: 'global',
    createdAt: now - 600000
  }
];
