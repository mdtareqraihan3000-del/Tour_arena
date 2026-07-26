export type AppRole = 'user' | 'admin';

export type MatchCategoryType = 'lone_wolf_1v1' | 'lone_wolf_2v2' | 'weekly_tournament' | 'special_tournament';

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export type TransactionType = 'deposit' | 'withdraw' | 'entry_fee' | 'prize_won' | 'refund';

export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export type ReportCategory = 'hacker' | 'abuse' | 'fake_player' | 'room_issue' | 'other';

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  username: string;
  ingameName: string;
  freeFireUid: string;
  role: AppRole;
  avatarUrl: string;
  walletBalance: number;
  winningBalance: number;
  totalEarnings: number;
  totalWins: number;
  totalMatches: number;
  mvpCount: number;
  joinedDate: string;
  isBanned: boolean;
  banReason?: string;
  rememberMe?: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: MatchCategoryType;
  imageUrl: string;
  description: string;
  activeMatchesCount: number;
}

export interface TournamentMatch {
  id: string;
  title: string;
  categoryId: string;
  categoryType: MatchCategoryType;
  categoryName: string;
  matchDate: string; // YYYY-MM-DD
  matchTime: string; // HH:mm
  startTimestamp: number; // unix timestamp in ms
  entryFee: number;
  prizePool: number;
  firstPrize: number;
  secondPrize: number;
  perKillPrize: number;
  totalSlots: number;
  joinedSlotsCount: number;
  mapName: string;
  rules: string[];
  status: MatchStatus;
  roomId?: string;
  roomPassword?: string;
  roomPublishedAt?: number;
  winnerUserId?: string;
  winnerIngameName?: string;
  winnerPrizeAmount?: number;
  bannerUrl?: string;
  createdAt: number;
}

export interface SlotBooking {
  slotNumber: number;
  userId: string;
  userName: string;
  ingameName: string;
  freeFireUid: string;
  joinedAt: number;
}

export interface JoinedMatch {
  id: string;
  matchId: string;
  userId: string;
  slotNumber: number;
  ingameName: string;
  freeFireUid: string;
  joinedAt: number;
  entryFeePaid: number;
  prizeWon?: number;
  status: MatchStatus;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: TransactionType;
  amount: number;
  method?: 'bKash' | 'Nagad' | 'Wallet' | 'Admin';
  paymentNumber?: string;
  transactionId?: string; // TrxID
  status: TransactionStatus;
  note?: string;
  createdAt: number;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  amount: number;
  method: 'bKash' | 'Nagad';
  adminNumberSentTo: string;
  transactionId: string;
  status: TransactionStatus;
  createdAt: number;
  adminNote?: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'bKash' | 'Nagad';
  accountNumber: string;
  status: TransactionStatus;
  createdAt: number;
  adminNote?: string;
}

export interface AppNotification {
  id: string;
  userId: string | 'all'; // 'all' for broadcast
  title: string;
  message: string;
  type: 'match' | 'wallet' | 'announcement' | 'system' | 'ban' | 'winner';
  read: boolean;
  createdAt: number;
  matchId?: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  ingameName: string;
  avatarUrl: string;
  totalWins: number;
  totalKills: number;
  totalEarnings: number;
  totalMatches: number;
  mvpCount: number;
  winRate: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  targetMatchId?: string;
  targetUrl?: string;
  active: boolean;
}

export interface ReportItem {
  id: string;
  userId: string;
  userName: string;
  reportedUserOrMatch: string;
  category: ReportCategory;
  description: string;
  evidenceUrl?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: number;
}

export interface PaymentMethods {
  bkashNumber: string;
  nagadNumber: string;
  bkashInstructions: string;
  nagadInstructions: string;
  minDeposit: number;
  minWithdraw: number;
}

export interface AppSettings {
  maintenanceMode: boolean;
  appVersion: string;
  globalAnnouncement: string;
  supportPhone: string;
  supportEmail: string;
  whatsappGroup: string;
  telegramChannel: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  role: AppRole;
  text: string;
  channel: 'global' | 'support';
  createdAt: number;
}
