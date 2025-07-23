import {
  users,
  tournaments,
  teams,
  teamMembers,
  tournamentParticipants,
  matches,
  transactions,
  announcements,
  supportTickets,
  kycDocuments,
  userSessions,
  securityLogs,
  userRoles,
  userRoleAssignments,
  verificationTokens,
  type User,
  type UpsertUser,
  type Tournament,
  type Team,
  type TeamMember,
  type TournamentParticipant,
  type Match,
  type Transaction,
  type Announcement,
  type SupportTicket,
  type KycDocument,
  type UserSession,
  type SecurityLog,
  type UserRole,
  type VerificationToken,
  type InsertTournament,
  type InsertTeam,
  type InsertTransaction,
  type InsertAnnouncement,
  type InsertSupportTicket,
  type InsertKycDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserWallet(userId: string, amount: string, operation: 'add' | 'subtract'): Promise<void>;
  getUserStats(userId: string): Promise<any>;

  // Tournament operations
  getTournaments(filters?: any): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: number, tournament: Partial<Tournament>): Promise<Tournament>;
  deleteTournament(id: number): Promise<void>;
  joinTournament(tournamentId: number, userId: string, teamId?: number): Promise<void>;
  getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]>;

  // Team operations
  getTeams(userId?: string): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<Team>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;
  addTeamMember(teamId: number, userId: string, role?: string, gameId?: string, contactInfo?: string): Promise<void>;
  removeTeamMember(teamId: number, userId: string): Promise<void>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;

  // Transaction operations
  getTransactions(userId?: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction>;
  getPendingWithdrawals(): Promise<Transaction[]>;

  // Admin operations
  getUsers(filters?: any): Promise<User[]>;
  getDashboardStats(): Promise<any>;
  updateTournamentParticipant(id: number, data: Partial<TournamentParticipant>): Promise<void>;

  // Announcement operations
  getAnnouncements(isActive?: boolean): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<Announcement>): Promise<Announcement>;

  // Enhanced Auth operations
  getUserSessions(userId: string): Promise<UserSession[]>;
  createUserSession(session: any): Promise<UserSession>;
  revokeUserSession(sessionId: string): Promise<void>;
  getSecurityLogs(userId?: string, limit?: number): Promise<SecurityLog[]>;
  createSecurityLog(log: any): Promise<SecurityLog>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  assignUserRole(userId: string, roleId: number, assignedBy: string): Promise<void>;
  createVerificationToken(token: any): Promise<VerificationToken>;
  verifyToken(token: string, type: string): Promise<VerificationToken | null>;

  // Support operations
  getSupportTickets(userId?: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, ticket: Partial<SupportTicket>): Promise<SupportTicket>;

  // KYC operations
  getKycDocuments(userId?: string, status?: string): Promise<KycDocument[]>;
  createKycDocument(document: InsertKycDocument): Promise<KycDocument>;
  updateKycDocument(id: number, document: Partial<KycDocument>): Promise<KycDocument>;

  // Leaderboard operations
  getLeaderboard(type: 'players' | 'teams', game?: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserWallet(userId: string, amount: string, operation: 'add' | 'subtract'): Promise<void> {
    const currentUser = await this.getUser(userId);
    if (!currentUser) throw new Error('User not found');

    const currentBalance = parseFloat(currentUser.walletBalance || '0');
    const changeAmount = parseFloat(amount);
    const newBalance = operation === 'add' 
      ? currentBalance + changeAmount 
      : currentBalance - changeAmount;

    if (newBalance < 0) throw new Error('Insufficient balance');

    await db
      .update(users)
      .set({ 
        walletBalance: newBalance.toFixed(2),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getUserStats(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    if (!user) return null;

    const participations = await db
      .select({ count: count() })
      .from(tournamentParticipants)
      .where(eq(tournamentParticipants.userId, userId));

    const wins = await db
      .select({ count: count() })
      .from(tournamentParticipants)
      .where(and(
        eq(tournamentParticipants.userId, userId),
        sql`${tournamentParticipants.status} = 'completed'`
      ));

    return {
      ...user,
      totalParticipations: participations[0]?.count || 0,
      totalWins: wins[0]?.count || 0,
    };
  }

  // Tournament operations
  async getTournaments(filters?: any): Promise<Tournament[]> {
    let conditions = [];

    if (filters?.status) {
      conditions.push(eq(tournaments.status, filters.status));
    }
    if (filters?.game) {
      conditions.push(eq(tournaments.game, filters.game));
    }

    return await db
      .select()
      .from(tournaments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(tournaments.startTime));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const [newTournament] = await db
      .insert(tournaments)
      .values(tournament)
      .returning();
    return newTournament;
  }

  async updateTournament(id: number, tournament: Partial<Tournament>): Promise<Tournament> {
    const [updatedTournament] = await db
      .update(tournaments)
      .set({ ...tournament, updatedAt: new Date() })
      .where(eq(tournaments.id, id))
      .returning();
    return updatedTournament;
  }

  async deleteTournament(id: number): Promise<void> {
    await db.delete(tournaments).where(eq(tournaments.id, id));
  }

  async joinTournament(tournamentId: number, userId: string, teamId?: number): Promise<void> {
    // Check if already joined
    const existing = await db
      .select()
      .from(tournamentParticipants)
      .where(and(
        eq(tournamentParticipants.tournamentId, tournamentId),
        eq(tournamentParticipants.userId, userId)
      ));

    if (existing.length > 0) {
      throw new Error('Already joined this tournament');
    }

    // Add participant
    await db.insert(tournamentParticipants).values({
      tournamentId,
      userId,
      teamId,
    });

    // Update tournament slot count
    await db
      .update(tournaments)
      .set({ 
        currentSlots: sql`${tournaments.currentSlots} + 1`,
        updatedAt: new Date()
      })
      .where(eq(tournaments.id, tournamentId));
  }

  async getTournamentParticipants(tournamentId: number): Promise<TournamentParticipant[]> {
    return await db
      .select()
      .from(tournamentParticipants)
      .where(eq(tournamentParticipants.tournamentId, tournamentId))
      .orderBy(desc(tournamentParticipants.joinedAt));
  }

  // Team operations
  async getTeams(userId?: string): Promise<Team[]> {
    if (userId) {
      return await db
        .select({
          id: teams.id,
          name: teams.name,
          code: teams.code,
          logoUrl: teams.logoUrl,
          captainId: teams.captainId,
          totalMembers: teams.totalMembers,
          winRate: teams.winRate,
          totalEarnings: teams.totalEarnings,
          matchesPlayed: teams.matchesPlayed,
          isActive: teams.isActive,
          createdAt: teams.createdAt,
          updatedAt: teams.updatedAt,
        })
        .from(teams)
        .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
        .where(eq(teamMembers.userId, userId));
    }

    return await db.select().from(teams).orderBy(desc(teams.createdAt));
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db
      .insert(teams)
      .values(team)
      .returning();

    // Add captain as team member
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: team.captainId,
      role: 'captain',
    });

    return newTeam;
  }

  async updateTeam(id: number, team: Partial<Team>): Promise<Team> {
    const [updatedTeam] = await db
      .update(teams)
      .set({ ...team, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.teamId, id));
    await db.delete(teams).where(eq(teams.id, id));
  }

  async addTeamMember(teamId: number, userId: string, role = 'member', gameId?: string, contactInfo?: string): Promise<void> {
    await db.insert(teamMembers).values({
      teamId,
      userId,
      role,
      gameId,
      contactInfo,
    });

    // Update team member count
    await db
      .update(teams)
      .set({ 
        totalMembers: sql`${teams.totalMembers} + 1`,
        updatedAt: new Date()
      })
      .where(eq(teams.id, teamId));
  }

  async removeTeamMember(teamId: number, userId: string): Promise<void> {
    await db
      .delete(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      ));

    // Update team member count
    await db
      .update(teams)
      .set({ 
        totalMembers: sql`${teams.totalMembers} - 1`,
        updatedAt: new Date()
      })
      .where(eq(teams.id, teamId));
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const results = await db
      .select({
        id: teamMembers.id,
        teamId: teamMembers.teamId,
        userId: teamMembers.userId,
        role: teamMembers.role,
        gameId: teamMembers.gameId,
        contactInfo: teamMembers.contactInfo,
        joinedAt: teamMembers.joinedAt,
        username: users.username,
        email: users.email,
        avatarUrl: users.profileImageUrl,
        phoneNumber: users.upiId, // Using upiId as phone for now
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId))
      .orderBy(asc(teamMembers.role));

    return results;
  }

  // Transaction operations
  async getTransactions(userId?: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(userId ? eq(transactions.userId, userId) : undefined)
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set(transaction)
      .where(eq(transactions.id, id))
      .returning();
    return updatedTransaction;
  }

  async getPendingWithdrawals(): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(and(
        eq(transactions.type, 'withdrawal'),
        eq(transactions.status, 'pending')
      ))
      .orderBy(desc(transactions.createdAt));
  }

  // Admin operations
  async getUsers(filters?: any): Promise<User[]> {
    let conditions = [];

    if (filters?.role) {
      conditions.push(eq(users.role, filters.role));
    }
    if (filters?.kycStatus) {
      conditions.push(eq(users.kycStatus, filters.kycStatus));
    }

    return await db
      .select()
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt));
  }

  async getDashboardStats(): Promise<any> {
    const totalUsers = await db.select({ count: count() }).from(users);
    const activeTournaments = await db
      .select({ count: count() })
      .from(tournaments)
      .where(or(
        eq(tournaments.status, 'upcoming'),
        eq(tournaments.status, 'live')
      ));

    const totalPayouts = await db
      .select({ sum: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(and(
        eq(transactions.type, 'withdrawal'),
        eq(transactions.status, 'completed')
      ));

    const pendingReviews = await db
      .select({ count: count() })
      .from(tournamentParticipants)
      .where(and(
        sql`${tournamentParticipants.screenshotUrls} IS NOT NULL`,
        sql`${tournamentParticipants.verifiedAt} IS NULL`
      ));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      activeTournaments: activeTournaments[0]?.count || 0,
      totalPayouts: totalPayouts[0]?.sum || 0,
      pendingReviews: pendingReviews[0]?.count || 0,
    };
  }

  async updateTournamentParticipant(id: number, data: Partial<TournamentParticipant>): Promise<void> {
    await db
      .update(tournamentParticipants)
      .set(data)
      .where(eq(tournamentParticipants.id, id));
  }

  // Announcement operations
  async getAnnouncements(isActive = true): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .where(isActive ? eq(announcements.isActive, true) : undefined)
      .orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<Announcement>): Promise<Announcement> {
    const [updatedAnnouncement] = await db
      .update(announcements)
      .set({ ...announcement, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    return updatedAnnouncement;
  }

  // Support operations
  async getSupportTickets(userId?: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(userId ? eq(supportTickets.userId, userId) : undefined)
      .orderBy(desc(supportTickets.createdAt));
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db
      .insert(supportTickets)
      .values(ticket)
      .returning();
    return newTicket;
  }

  async updateSupportTicket(id: number, ticket: Partial<SupportTicket>): Promise<SupportTicket> {
    const [updatedTicket] = await db
      .update(supportTickets)
      .set({ ...ticket, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket;
  }

  // KYC operations
  async getKycDocuments(userId?: string, status?: string): Promise<KycDocument[]> {
    let conditions = [];

    if (userId) {
      conditions.push(eq(kycDocuments.userId, userId));
    }
    if (status) {
      conditions.push(eq(kycDocuments.status, status));
    }

    return await db
      .select()
      .from(kycDocuments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(kycDocuments.createdAt));
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const [newDocument] = await db
      .insert(kycDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async updateKycDocument(id: number, document: Partial<KycDocument>): Promise<KycDocument> {
    const [updatedDocument] = await db
      .update(kycDocuments)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(kycDocuments.id, id))
      .returning();
    return updatedDocument;
  }

  // Enhanced Auth operations
  async getUserSessions(userId: string): Promise<UserSession[]> {
    return await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true)
      ))
      .orderBy(desc(userSessions.lastAccessedAt));
  }

  async createUserSession(session: any): Promise<UserSession> {
    const [newSession] = await db
      .insert(userSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async revokeUserSession(sessionId: string): Promise<void> {
    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(eq(userSessions.id, sessionId));
  }

  async getSecurityLogs(userId?: string, limit: number = 100): Promise<SecurityLog[]> {
    const whereClause = userId ? eq(securityLogs.userId, userId) : undefined;

    return await db
      .select()
      .from(securityLogs)
      .where(whereClause)
      .orderBy(desc(securityLogs.createdAt))
      .limit(limit);
  }

  async createSecurityLog(log: any): Promise<SecurityLog> {
    const [newLog] = await db
      .insert(securityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const roles = await db
      .select({ role: userRoles })
      .from(userRoleAssignments)
      .innerJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
      .where(
        and(
          eq(userRoleAssignments.userId, userId),
          eq(userRoles.isActive, true),
          sql`(${userRoleAssignments.expiresAt} IS NULL OR ${userRoleAssignments.expiresAt} > NOW())`
        )
      );

    return roles.map(r => r.role);
  }

  async assignUserRole(userId: string, roleId: number, assignedBy: string): Promise<void> {
    await db
      .insert(userRoleAssignments)
      .values({
        userId,
        roleId,
        assignedBy,
      });
  }

  async createVerificationToken(token: any): Promise<VerificationToken> {
    const [newToken] = await db
      .insert(verificationTokens)
      .values(token)
      .returning();
    return newToken;
  }

  async verifyToken(token: string, type: string): Promise<VerificationToken | null> {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, type),
          eq(verificationTokens.used, false),
          sql`${verificationTokens.expiresAt} > NOW()`
        )
      );

    return verificationToken || null;
  }

  async markTokenAsUsed(tokenId: number): Promise<void> {
    await db
      .update(verificationTokens)
      .set({
        used: true,
        usedAt: new Date()
      })
      .where(eq(verificationTokens.id, tokenId));
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  // Leaderboard operations
  async getLeaderboard(type: 'players' | 'teams', game?: string): Promise<any[]> {
    if (type === 'players') {
      return await db
        .select({
          id: users.id,
          username: users.username,
          profileImageUrl: users.profileImageUrl,
          totalEarnings: users.totalEarnings,
          winRate: users.winRate,
          matchesPlayed: users.matchesPlayed,
          xpPoints: users.xpPoints,
          level: users.level,
        })
        .from(users)
        .where(eq(users.role, 'user'))
        .orderBy(desc(users.totalEarnings))
        .limit(50);
    } else {
      return await db
        .select({
          id: teams.id,
          name: teams.name,
          logoUrl: teams.logoUrl,
          totalEarnings: teams.totalEarnings,
          winRate: teams.winRate,
          matchesPlayed: teams.matchesPlayed,
          totalMembers: teams.totalMembers,
        })
        .from(teams)
        .where(eq(teams.isActive, true))
        .orderBy(desc(teams.totalEarnings))
        .limit(50);
    }
  }
}

export const storage = new DatabaseStorage();