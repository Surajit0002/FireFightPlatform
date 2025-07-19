import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

export const tournaments = sqliteTable('tournaments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug'),
  game: text('game').notNull(),
  gameCategory: text('game_category'),
  platform: text('platform'),
  description: text('description'),
  prizePool: text('prize_pool').notNull().default('0'),
  entryFee: text('entry_fee').notNull().default('0'),
  entryMode: text('entry_mode').default('free'),
  prizePoolType: text('prize_pool_type').default('fixed'),
  prizeBreakdown: text('prize_breakdown', { mode: 'json' }),
  maxSlots: integer('max_slots').notNull(),
  minSlots: integer('min_slots').default(1),
  currentSlots: integer('current_slots').notNull().default(0),
  format: text('format').notNull(),
  teamSize: integer('team_size').notNull().default(1),
  regOpenTime: integer('reg_open_time', { mode: 'timestamp' }),
  regCloseTime: integer('reg_close_time', { mode: 'timestamp' }),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  checkInRequired: integer('check_in_required', { mode: 'boolean' }).default(false),
  checkInTime: integer('check_in_time', { mode: 'timestamp' }),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  spectatorUrl: text('spectator_url'),
  status: text('status').notNull().default('upcoming'),
  mapInfo: text('map_info'),
  rules: text('rules'),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  posterUrl: text('poster_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});