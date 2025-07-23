import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
  matchesPlayed: integer("matches_played").default(0),
  xpPoints: integer("xp_points").default(0),
  level: integer("level").default(1),
  kycStatus: varchar("kyc_status").default("pending"), // pending, approved, rejected
  upiId: varchar("upi_id"),
  isActive: boolean("is_active").default(true),
  role: varchar("role").default("user"), // user, admin, moderator
  // Enhanced security fields
  emailVerified: boolean("email_verified").default(false),
  phoneNumber: varchar("phone_number"),
  phoneVerified: boolean("phone_verified").default(false),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: varchar("two_factor_secret"),
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").default(0),
  accountLocked: boolean("account_locked").default(false),
  lockReason: varchar("lock_reason"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lastFailedLoginAt: timestamp("last_failed_login_at"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  preferences: jsonb("preferences").default('{}'),
  metadata: jsonb("metadata").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Sessions & Security
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: varchar("session_token").unique().notNull(),
  deviceInfo: jsonb("device_info"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

// Security logs for audit trail
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action").notNull(), // login, logout, failed_login, password_reset, etc.
  details: jsonb("details").default('{}'),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  success: boolean("success").default(true),
  riskScore: integer("risk_score").default(0), // 0-100 risk assessment
  location: varchar("location"), // geo location
  createdAt: timestamp("created_at").defaultNow(),
});

// User permissions and roles
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  permissions: jsonb("permissions").default('[]'), // Array of permission strings
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userRoleAssignments = pgTable("user_role_assignments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => userRoles.id).notNull(),
  assignedBy: varchar("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Email verification tokens
export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").unique().notNull(),
  type: varchar("type").notNull(), // email_verification, phone_verification, password_reset
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameEnum = pgEnum("game", ["free_fire", "bgmi", "valorant", "csgo", "pubg", "codm", "apex_legends"]);
export const tournamentStatusEnum = pgEnum("tournament_status", ["draft", "upcoming", "live", "completed", "cancelled", "archived"]);
export const matchStatusEnum = pgEnum("match_status", ["pending", "live", "completed", "cancelled", "disputed"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal", "prize", "entry_fee", "refund", "penalty", "bonus"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed", "cancelled", "processing"]);
export const tournamentTypeEnum = pgEnum("tournament_type", ["public", "private", "invite_only", "premium"]);
export const bracketTypeEnum = pgEnum("bracket_type", ["single_elimination", "double_elimination", "round_robin", "swiss", "custom"]);
export const participantStatusEnum = pgEnum("participant_status", ["registered", "checked_in", "confirmed", "disqualified", "withdrawn", "banned"]);

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  game: gameEnum("game").notNull(),
  platform: varchar("platform").default("mobile"), // mobile, pc, console
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  maxSlots: integer("max_slots").notNull(),
  currentSlots: integer("current_slots").default(0),
  format: varchar("format").notNull(), // solo, duo, squad
  teamSize: integer("team_size").default(1),
  status: tournamentStatusEnum("status").default("draft"),
  type: tournamentTypeEnum("type").default("public"),
  bracketType: bracketTypeEnum("bracket_type").default("single_elimination"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  registrationStart: timestamp("registration_start").defaultNow(),
  registrationEnd: timestamp("registration_end").notNull(),
  checkInStart: timestamp("check_in_start"),
  checkInEnd: timestamp("check_in_end"),
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  streamUrl: varchar("stream_url"), // Twitch/YouTube stream
  discordUrl: varchar("discord_url"),
  rules: text("rules"),
  mapInfo: varchar("map_info"),
  posterUrl: varchar("poster_url"),
  bannerUrl: varchar("banner_url"), // Large banner for details page
  killPoints: integer("kill_points").default(1), // Points per kill
  winPoints: integer("win_points").default(10), // Points for winning
  placementPoints: jsonb("placement_points").default('{}'), // Points by rank placement
  prizeDistribution: jsonb("prize_distribution").default('{}'), // Custom prize breakdown
  settings: jsonb("settings").default('{}'), // Additional tournament settings
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  allowGuests: boolean("allow_guests").default(false),
  autoStart: boolean("auto_start").default(true),
  maxTeamsPerUser: integer("max_teams_per_user").default(1),
  timezone: varchar("timezone").default("UTC"),
  createdBy: varchar("created_by").references(() => users.id),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  code: varchar("code").unique().notNull(),
  logoUrl: varchar("logo_url"),
  captainId: varchar("captain_id").references(() => users.id).notNull(),
  totalMembers: integer("total_members").default(1),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  matchesPlayed: integer("matches_played").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").notNull(),
  gameId: varchar("game_id"),
  contactInfo: varchar("contact_info"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const tournamentParticipants = pgTable("tournament_participants", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  rank: integer("rank"),
  finalRank: integer("final_rank"), // Final tournament position
  kills: integer("kills").default(0),
  points: integer("points").default(0),
  placementPoints: integer("placement_points").default(0),
  totalPoints: integer("total_points").default(0), // kills + placement + bonus
  prizeWon: decimal("prize_won", { precision: 10, scale: 2 }).default("0.00"),
  status: participantStatusEnum("status").default("registered"),
  checkInTime: timestamp("check_in_time"),
  screenshotUrls: text("screenshot_urls").array(), // Multiple screenshots
  submittedAt: timestamp("submitted_at"),
  verifiedAt: timestamp("verified_at"),
  disqualifiedReason: text("disqualified_reason"),
  disqualifiedBy: varchar("disqualified_by").references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  bracketRound: integer("bracket_round").default(1),
  matchNumber: integer("match_number"),
  status: matchStatusEnum("status").default("pending"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  winnerId: varchar("winner_id").references(() => users.id),
  winnerTeamId: integer("winner_team_id").references(() => teams.id),
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  lobbyId: varchar("lobby_id"),
  mapInfo: varchar("map_info"),
  resultScreenshots: text("result_screenshots").array(),
  streamUrl: varchar("stream_url"),
  replayUrl: varchar("replay_url"),
  notes: text("notes"),
  participantIds: jsonb("participant_ids").default('[]'), // Array of participant IDs
  matchResults: jsonb("match_results").default('{}'), // Detailed match results
  isDisputed: boolean("is_disputed").default(false),
  disputeReason: text("dispute_reason"),
  disputedBy: varchar("disputed_by").references(() => users.id),
  disputeResolvedBy: varchar("dispute_resolved_by").references(() => users.id),
  disputeResolvedAt: timestamp("dispute_resolved_at"),
  createdBy: varchar("created_by").references(() => users.id),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Prize Distribution System
export const prizeDistributions = pgTable("prize_distributions", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  rank: integer("rank").notNull(),
  prizeAmount: decimal("prize_amount", { precision: 10, scale: 2 }).notNull(),
  prizeType: varchar("prize_type").default("cash"), // cash, item, credits
  prizeDescription: text("prize_description"),
  isDisbursed: boolean("is_disbursed").default(false),
  disbursedAt: timestamp("disbursed_at"),
  disbursedBy: varchar("disbursed_by").references(() => users.id),
  recipientId: varchar("recipient_id").references(() => users.id),
  recipientTeamId: integer("recipient_team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit Logs for Admin Actions
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  action: varchar("action").notNull(), // created, updated, deleted, banned, etc.
  entityType: varchar("entity_type").notNull(), // tournament, match, user, team
  entityId: varchar("entity_id").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  reason: text("reason"),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  metadata: jsonb("metadata").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Media Uploads (Posters, Screenshots, etc.)
export const mediaUploads = pgTable("media_uploads", {
  id: serial("id").primaryKey(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  url: varchar("url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  entityType: varchar("entity_type"), // tournament, match, user, team
  entityId: varchar("entity_id"),
  uploadedBy: varchar("uploaded_by").references(() => users.id).notNull(),
  isPublic: boolean("is_public").default(true),
  metadata: jsonb("metadata").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tournament Templates for Quick Creation
export const tournamentTemplates = pgTable("tournament_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  game: gameEnum("game").notNull(),
  settings: jsonb("settings").notNull(), // Template configuration
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  status: transactionStatusEnum("status").default("pending"),
  description: text("description"),
  tournamentId: integer("tournament_id").references(() => tournaments.id),
  upiTransactionId: varchar("upi_transaction_id"),
  adminNotes: text("admin_notes"),
  processedBy: varchar("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  type: varchar("type").default("general"), // general, tournament, maintenance, winner
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  targetAudience: varchar("target_audience").default("all"), // all, users, teams, specific_game
  gameFilter: gameEnum("game_filter"),
  isActive: boolean("is_active").default(true),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: varchar("category").notNull(), // match, wallet, general, kyc
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("open"), // open, in_progress, resolved, closed
  priority: varchar("priority").default("normal"), // low, normal, high, urgent
  assignedTo: varchar("assigned_to").references(() => users.id),
  attachmentUrls: text("attachment_urls").array(),
  adminNotes: text("admin_notes"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentType: varchar("document_type").notNull(), // aadhaar, pan
  documentNumber: varchar("document_number"),
  documentUrl: varchar("document_url").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected
  rejectionReason: text("rejection_reason"),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tournamentsCreated: many(tournaments),
  teamsCaptained: many(teams),
  teamMemberships: many(teamMembers),
  tournamentParticipations: many(tournamentParticipants),
  transactions: many(transactions),
  announcements: many(announcements),
  supportTickets: many(supportTickets),
  kycDocuments: many(kycDocuments),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  creator: one(users, {
    fields: [tournaments.createdBy],
    references: [users.id],
  }),
  participants: many(tournamentParticipants),
  matches: many(matches),
  transactions: many(transactions),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  captain: one(users, {
    fields: [teams.captainId],
    references: [users.id],
  }),
  members: many(teamMembers),
  tournamentParticipations: many(tournamentParticipants),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  currentSlots: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Enhanced auth schemas
export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  createdAt: true,
  lastAccessedAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVerificationTokenSchema = createInsertSchema(verificationTokens).omit({
  id: true,
  used: true,
  usedAt: true,
  createdAt: true,
});

// New table insert schemas
export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPrizeDistributionSchema = createInsertSchema(prizeDistributions).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertMediaUploadSchema = createInsertSchema(mediaUploads).omit({
  id: true,
  createdAt: true,
});

export const insertTournamentTemplateSchema = createInsertSchema(tournamentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
export type UserRoleAssignment = typeof userRoleAssignments.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type PrizeDistribution = typeof prizeDistributions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type MediaUpload = typeof mediaUploads.$inferSelect;
export type TournamentTemplate = typeof tournamentTemplates.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type KycDocument = typeof kycDocuments.$inferSelect;

// Insert types
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type InsertPrizeDistribution = z.infer<typeof insertPrizeDistributionSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertMediaUpload = z.infer<typeof insertMediaUploadSchema>;
export type InsertTournamentTemplate = z.infer<typeof insertTournamentTemplateSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type InsertVerificationToken = z.infer<typeof insertVerificationTokenSchema>;

export const tournamentSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().optional(),
  game: z.string(),
  gameCategory: z.string().optional(),
  platform: z.string().optional(),
  description: z.string().nullable(),
  prizePool: z.string(),
  entryFee: z.string(),
  entryMode: z.string().optional(),
  prizePoolType: z.string().optional(),
  prizeBreakdown: z.any().optional(),
  maxSlots: z.number(),
  minSlots: z.number().optional(),
  currentSlots: z.number().default(0),
  format: z.string(),
  teamSize: z.number(),
  regOpenTime: z.date().optional(),
  regCloseTime: z.date().optional(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  checkInRequired: z.boolean().default(false),
  checkInTime: z.date().nullable(),
  isPublic: z.boolean().default(true),
  spectatorUrl: z.string().nullable(),
  status: z.enum(['upcoming', 'live', 'completed', 'cancelled']).default('upcoming'),
  mapInfo: z.string().nullable(),
  rules: z.string().nullable(),
  isFeatured: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  posterUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});