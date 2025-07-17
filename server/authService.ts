import crypto from 'crypto';
import { db } from './db';
import { 
  users, 
  userSessions, 
  securityLogs, 
  userRoles, 
  userRoleAssignments,
  verificationTokens,
  type User,
  type UserSession,
  type SecurityLog,
  type InsertUserSession,
  type InsertSecurityLog,
  type InsertVerificationToken
} from '@shared/schema';
import { eq, and, gt, desc, sql } from 'drizzle-orm';

export interface AuthContext {
  userId: string;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: any;
}

export interface SecurityEvent {
  userId?: string;
  action: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  riskScore?: number;
  location?: string;
}

export class AuthService {
  // Enhanced user management
  async enhanceUserProfile(userId: string, updates: Partial<User>) {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    await this.logSecurityEvent({
      userId,
      action: 'profile_updated',
      details: { updatedFields: Object.keys(updates) },
      success: true,
    });

    return updatedUser;
  }

  // Session management
  async createUserSession(sessionData: InsertUserSession): Promise<UserSession> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const [session] = await db
      .insert(userSessions)
      .values({
        ...sessionData,
        sessionToken,
        expiresAt,
      })
      .returning();

    await this.logSecurityEvent({
      userId: sessionData.userId,
      action: 'session_created',
      details: { sessionId: session.id, deviceInfo: sessionData.deviceInfo },
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      success: true,
    });

    return session;
  }

  async validateSession(sessionToken: string): Promise<UserSession | null> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          eq(userSessions.isActive, true),
          gt(userSessions.expiresAt, new Date())
        )
      );

    if (session) {
      // Update last accessed time
      await db
        .update(userSessions)
        .set({ lastAccessedAt: new Date() })
        .where(eq(userSessions.id, session.id));
    }

    return session || null;
  }

  async revokeSession(sessionId: string, userId?: string) {
    const whereClause = userId 
      ? and(eq(userSessions.id, sessionId), eq(userSessions.userId, userId))
      : eq(userSessions.id, sessionId);

    await db
      .update(userSessions)
      .set({ isActive: false })
      .where(whereClause);

    await this.logSecurityEvent({
      userId,
      action: 'session_revoked',
      details: { sessionId },
      success: true,
    });
  }

  async revokeAllUserSessions(userId: string, exceptSessionId?: string) {
    const whereClause = exceptSessionId
      ? and(eq(userSessions.userId, userId), sql`${userSessions.id} != ${exceptSessionId}`)
      : eq(userSessions.userId, userId);

    const result = await db
      .update(userSessions)
      .set({ isActive: false })
      .where(whereClause);

    await this.logSecurityEvent({
      userId,
      action: 'all_sessions_revoked',
      details: { exceptSessionId, revokedCount: result.rowCount },
      success: true,
    });
  }

  // Security monitoring
  async logSecurityEvent(event: SecurityEvent) {
    const securityLog: InsertSecurityLog = {
      userId: event.userId,
      action: event.action,
      details: event.details || {},
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      success: event.success ?? true,
      riskScore: event.riskScore ?? 0,
      location: event.location,
    };

    await db.insert(securityLogs).values(securityLog);
  }

  async trackFailedLogin(userId: string, ipAddress?: string, userAgent?: string) {
    await db
      .update(users)
      .set({
        failedLoginAttempts: sql`${users.failedLoginAttempts} + 1`,
        lastFailedLoginAt: new Date(),
      })
      .where(eq(users.id, userId));

    await this.logSecurityEvent({
      userId,
      action: 'failed_login',
      ipAddress,
      userAgent,
      success: false,
      riskScore: 30,
    });

    // Check if account should be locked
    const [user] = await db
      .select({ failedLoginAttempts: users.failedLoginAttempts })
      .from(users)
      .where(eq(users.id, userId));

    if (user && user.failedLoginAttempts >= 5) {
      await this.lockAccount(userId, 'Too many failed login attempts');
    }
  }

  async trackSuccessfulLogin(userId: string, ipAddress?: string, userAgent?: string, deviceInfo?: any) {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        loginCount: sql`${users.loginCount} + 1`,
        failedLoginAttempts: 0, // Reset failed attempts
      })
      .where(eq(users.id, userId));

    await this.logSecurityEvent({
      userId,
      action: 'successful_login',
      details: { deviceInfo },
      ipAddress,
      userAgent,
      success: true,
      riskScore: 0,
    });
  }

  async lockAccount(userId: string, reason: string) {
    await db
      .update(users)
      .set({
        accountLocked: true,
        lockReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Revoke all active sessions
    await this.revokeAllUserSessions(userId);

    await this.logSecurityEvent({
      userId,
      action: 'account_locked',
      details: { reason },
      success: true,
      riskScore: 100,
    });
  }

  async unlockAccount(userId: string) {
    await db
      .update(users)
      .set({
        accountLocked: false,
        lockReason: null,
        failedLoginAttempts: 0,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    await this.logSecurityEvent({
      userId,
      action: 'account_unlocked',
      success: true,
      riskScore: 0,
    });
  }

  // Role and permission management
  async assignRole(userId: string, roleId: number, assignedBy: string, expiresAt?: Date) {
    const [assignment] = await db
      .insert(userRoleAssignments)
      .values({
        userId,
        roleId,
        assignedBy,
        expiresAt,
      })
      .returning();

    await this.logSecurityEvent({
      userId,
      action: 'role_assigned',
      details: { roleId, assignedBy, expiresAt },
      success: true,
    });

    return assignment;
  }

  async getUserRoles(userId: string) {
    const roles = await db
      .select({
        role: userRoles,
        assignment: userRoleAssignments,
      })
      .from(userRoleAssignments)
      .innerJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
      .where(
        and(
          eq(userRoleAssignments.userId, userId),
          eq(userRoles.isActive, true),
          sql`(${userRoleAssignments.expiresAt} IS NULL OR ${userRoleAssignments.expiresAt} > NOW())`
        )
      );

    return roles;
  }

  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    
    for (const { role } of roles) {
      const permissions = role.permissions as string[];
      if (permissions.includes(permission) || permissions.includes('*')) {
        return true;
      }
    }

    return false;
  }

  // Two-factor authentication
  async enableTwoFactor(userId: string): Promise<string> {
    const secret = crypto.randomBytes(20).toString('base32');
    
    await db
      .update(users)
      .set({
        twoFactorSecret: secret,
        twoFactorEnabled: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    await this.logSecurityEvent({
      userId,
      action: 'two_factor_enabled',
      success: true,
    });

    return secret;
  }

  async disableTwoFactor(userId: string) {
    await db
      .update(users)
      .set({
        twoFactorSecret: null,
        twoFactorEnabled: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    await this.logSecurityEvent({
      userId,
      action: 'two_factor_disabled',
      success: true,
    });
  }

  // Email/Phone verification
  async createVerificationToken(
    userId: string, 
    type: 'email_verification' | 'phone_verification' | 'password_reset',
    expirationMinutes: number = 60
  ): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    await db.insert(verificationTokens).values({
      userId,
      token,
      type,
      expiresAt,
    });

    await this.logSecurityEvent({
      userId,
      action: 'verification_token_created',
      details: { type, expirationMinutes },
      success: true,
    });

    return token;
  }

  async verifyToken(token: string, type: string): Promise<string | null> {
    const [verificationToken] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, type),
          eq(verificationTokens.used, false),
          gt(verificationTokens.expiresAt, new Date())
        )
      );

    if (!verificationToken) {
      return null;
    }

    // Mark token as used
    await db
      .update(verificationTokens)
      .set({
        used: true,
        usedAt: new Date(),
      })
      .where(eq(verificationTokens.id, verificationToken.id));

    // Update user verification status
    if (type === 'email_verification') {
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, verificationToken.userId));
    } else if (type === 'phone_verification') {
      await db
        .update(users)
        .set({ phoneVerified: true })
        .where(eq(users.id, verificationToken.userId));
    }

    await this.logSecurityEvent({
      userId: verificationToken.userId,
      action: 'token_verified',
      details: { type },
      success: true,
    });

    return verificationToken.userId;
  }

  // Security analytics
  async getSecurityLogs(userId?: string, limit: number = 100) {
    const whereClause = userId ? eq(securityLogs.userId, userId) : undefined;
    
    return await db
      .select()
      .from(securityLogs)
      .where(whereClause)
      .orderBy(desc(securityLogs.createdAt))
      .limit(limit);
  }

  async getUserSessions(userId: string) {
    return await db
      .select()
      .from(userSessions)
      .where(and(
        eq(userSessions.userId, userId),
        eq(userSessions.isActive, true)
      ))
      .orderBy(desc(userSessions.lastAccessedAt));
  }

  // Risk assessment
  async calculateRiskScore(
    userId: string, 
    ipAddress?: string, 
    userAgent?: string,
    location?: string
  ): Promise<number> {
    let riskScore = 0;

    // Check for recent failed logins
    const recentFailures = await db
      .select({ count: sql<number>`count(*)` })
      .from(securityLogs)
      .where(
        and(
          eq(securityLogs.userId, userId),
          eq(securityLogs.action, 'failed_login'),
          gt(securityLogs.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        )
      );

    if (recentFailures[0]?.count > 0) {
      riskScore += Math.min(recentFailures[0].count * 10, 50);
    }

    // Check for new device/location
    if (ipAddress) {
      const knownIP = await db
        .select()
        .from(securityLogs)
        .where(
          and(
            eq(securityLogs.userId, userId),
            eq(securityLogs.ipAddress, ipAddress),
            eq(securityLogs.success, true)
          )
        )
        .limit(1);

      if (knownIP.length === 0) {
        riskScore += 25; // New IP address
      }
    }

    return Math.min(riskScore, 100);
  }
}

export const authService = new AuthService();