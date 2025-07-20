import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { authService } from "./authService";
import crypto from "crypto";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
  ipAddress?: string,
  userAgent?: string
) {
  const user = await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    emailVerified: true, // Replit users have verified emails
  });

  // Track successful login
  await authService.trackSuccessfulLogin(
    claims["sub"], 
    ipAddress, 
    userAgent,
    { provider: 'replit' }
  );

  return user;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback,
    req?: any
  ) => {
    try {
      const user = {};
      updateUserSession(user, tokens);
      const ipAddress = req?.ip || req?.connection?.remoteAddress;
      const userAgent = req?.get('User-Agent');
      
      const claims = tokens.claims();
      if (claims) {
        await upsertUser(claims, ipAddress, userAgent);
        
        // Create secure session
        const sessionId = crypto.randomUUID();
        await authService.createUserSession({
          id: sessionId,
          userId: claims["sub"],
          sessionToken: crypto.randomBytes(32).toString('hex'),
          deviceInfo: { userAgent, platform: req?.get('Sec-CH-UA-Platform') },
          ipAddress,
          userAgent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        
        (user as any).sessionId = sessionId;
      }
      verified(null, user);
    } catch (error) {
      console.error('Auth verification error:', error);
      verified(error);
    }
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // Use the first configured domain if hostname doesn't match
    const hostname = req.hostname;
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    const domain = domains.includes(hostname) ? hostname : domains[0];
    
    passport.authenticate(`replitauth:${domain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Use the first configured domain if hostname doesn't match
    const hostname = req.hostname;
    const domains = process.env.REPLIT_DOMAINS!.split(",");
    const domain = domains.includes(hostname) ? hostname : domains[0];
    
    passport.authenticate(`replitauth:${domain}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

// Enhanced authentication middleware with security logging
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;
  const ipAddress = req.ip || req.connection?.remoteAddress;
  const userAgent = req.get('User-Agent');

  if (!req.isAuthenticated() || !user.expires_at) {
    if (user?.claims?.sub) {
      await authService.logSecurityEvent({
        userId: user.claims.sub,
        action: 'unauthorized_access_attempt',
        details: { path: req.path, method: req.method },
        ipAddress,
        userAgent,
        success: false,
        riskScore: 40,
      });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if user account is locked
  const dbUser = await storage.getUser(user.claims.sub);
  if (dbUser?.accountLocked) {
    await authService.logSecurityEvent({
      userId: user.claims.sub,
      action: 'locked_account_access_attempt',
      details: { lockReason: dbUser.lockReason },
      ipAddress,
      userAgent,
      success: false,
      riskScore: 80,
    });
    return res.status(403).json({ message: "Account locked", reason: dbUser.lockReason });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    // Log successful access for analytics
    await authService.logSecurityEvent({
      userId: user.claims.sub,
      action: 'authenticated_access',
      details: { path: req.path, method: req.method },
      ipAddress,
      userAgent,
      success: true,
      riskScore: 0,
    });
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    await authService.logSecurityEvent({
      userId: user.claims.sub,
      action: 'token_refresh_failed',
      details: { reason: 'no_refresh_token' },
      ipAddress,
      userAgent,
      success: false,
      riskScore: 30,
    });
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    
    await authService.logSecurityEvent({
      userId: user.claims.sub,
      action: 'token_refreshed',
      ipAddress,
      userAgent,
      success: true,
      riskScore: 0,
    });
    
    return next();
  } catch (error) {
    await authService.logSecurityEvent({
      userId: user.claims.sub,
      action: 'token_refresh_failed',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      ipAddress,
      userAgent,
      success: false,
      riskScore: 50,
    });
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return async (req: any, res: any, next: any) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check basic role
    if (user.role && roleArray.includes(user.role)) {
      return next();
    }

    // Check advanced role assignments
    const userRoles = await authService.getUserRoles(userId);
    const hasRole = userRoles.some(({ role }) => roleArray.includes(role.name));

    if (hasRole) {
      return next();
    }

    await authService.logSecurityEvent({
      userId,
      action: 'insufficient_permissions',
      details: { requiredRoles: roleArray, userRole: user.role, path: req.path },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      success: false,
      riskScore: 20,
    });

    return res.status(403).json({ message: "Insufficient permissions" });
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return async (req: any, res: any, next: any) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const hasPermission = await authService.hasPermission(userId, permission);

    if (hasPermission) {
      return next();
    }

    await authService.logSecurityEvent({
      userId,
      action: 'permission_denied',
      details: { requiredPermission: permission, path: req.path },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      success: false,
      riskScore: 25,
    });

    return res.status(403).json({ message: "Permission denied" });
  };
};
