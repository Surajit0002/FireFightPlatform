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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameEnum = pgEnum("game", ["free_fire", "bgmi", "valorant", "csgo", "pubg"]);
export const tournamentStatusEnum = pgEnum("tournament_status", ["upcoming", "live", "completed", "cancelled"]);
export const matchStatusEnum = pgEnum("match_status", ["pending", "live", "completed", "cancelled"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal", "prize", "entry_fee", "refund"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed", "cancelled"]);

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  game: gameEnum("game").notNull(),
  prizePool: decimal("prize_pool", { precision: 10, scale: 2 }).notNull(),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  maxSlots: integer("max_slots").notNull(),
  currentSlots: integer("current_slots").default(0),
  format: varchar("format").notNull(), // solo, duo, squad
  teamSize: integer("team_size").default(1),
  status: tournamentStatusEnum("status").default("upcoming"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  rules: text("rules"),
  mapInfo: varchar("map_info"),
  posterUrl: varchar("poster_url"), // Tournament poster image URL
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdBy: varchar("created_by").references(() => users.id),
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
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default("member"), // captain, member
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
  kills: integer("kills").default(0),
  points: integer("points").default(0),
  prizeWon: decimal("prize_won", { precision: 10, scale: 2 }).default("0.00"),
  status: varchar("status").default("registered"), // registered, disqualified, winner
  screenshotUrl: varchar("screenshot_url"),
  submittedAt: timestamp("submitted_at"),
  verifiedAt: timestamp("verified_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  status: matchStatusEnum("status").default("pending"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  winnerId: varchar("winner_id").references(() => users.id),
  winnerTeamId: integer("winner_team_id").references(() => teams.id),
  roomId: varchar("room_id"),
  roomPassword: varchar("room_password"),
  mapInfo: varchar("map_info"),
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

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
