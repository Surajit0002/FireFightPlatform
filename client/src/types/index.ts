export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  username?: string;
  isAdmin: boolean;
  kycStatus: "pending" | "approved" | "rejected";
  kycDocuments?: any;
  xp: number;
  level: number;
  walletBalance: string;
  upiId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: number;
  title: string;
  description?: string;
  gameType: "free_fire" | "bgmi" | "valorant" | "other";
  format: "solo" | "duo" | "squad" | "team";
  maxParticipants: number;
  currentParticipants: number;
  entryFee: string;
  prizePool: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  startTime: string;
  endTime?: string;
  roomId?: string;
  roomPassword?: string;
  rules?: string;
  imageUrl?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
  description?: string;
  captainId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: number;
  teamId: number;
  userId: string;
  role: string;
  gameId?: string;
  joinedAt: string;
}

export interface TournamentParticipant {
  id: number;
  tournamentId: number;
  userId?: string;
  teamId?: number;
  rank?: number;
  kills?: number;
  points?: number;
  screenshotUrl?: string;
  isVerified: boolean;
  notes?: string;
  joinedAt: string;
}

export interface Transaction {
  id: number;
  userId: string;
  type: "deposit" | "withdrawal" | "tournament_fee" | "prize_payout" | "bonus" | "referral";
  amount: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  description?: string;
  referenceId?: string;
  tournamentId?: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: number;
  userId: string;
  subject: string;
  description: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  attachments?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  targetAudience: string;
  gameType?: "free_fire" | "bgmi" | "valorant" | "other";
  isActive: boolean;
  publishedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeTournaments: number;
  totalPayouts: string;
  pendingReviews: number;
}
