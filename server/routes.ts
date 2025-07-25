import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";

import { 
  insertTournamentSchema, 
  insertTeamSchema, 
  insertTransactionSchema,
  insertAnnouncementSchema,
  insertSupportTicketSchema,
  insertKycDocumentSchema 
} from "@shared/schema";
import { z } from "zod";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import type { Request } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storageConfig = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'tournament-posters');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `tournament-poster-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Email verification route
  app.get('/action-code', async (req, res) => {
    try {
      const { mode, oobCode, apiKey, lang } = req.query;

      if (mode === 'verifyEmail' && oobCode) {
        // Verify the email verification token
        const verificationToken = await storage.verifyToken(oobCode as string, 'email_verification');

        if (!verificationToken) {
          return res.status(400).send(`
            <html>
              <head><title>Email Verification Failed</title></head>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #e74c3c;">Email Verification Failed</h1>
                <p>The verification link is invalid or has expired.</p>
                <p><a href="/" style="color: #3498db;">Return to FireFight</a></p>
              </body>
            </html>
          `);
        }

        // Mark user as email verified
        await storage.updateUser(verificationToken.userId, { 
          emailVerified: true 
        });

        // Mark token as used
        await storage.markTokenAsUsed(verificationToken.id);

        return res.send(`
          <html>
            <head><title>Email Verified Successfully</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1 style="color: #27ae60;">Email Verified Successfully!</h1>
              <p>Your email has been verified. You can now fully access your FireFight account.</p>
              <p><a href="/" style="color: #3498db; text-decoration: none; background: #3498db; color: white; padding: 10px 20px; border-radius: 5px;">Continue to FireFight</a></p>
            </body>
          </html>
        `);
      }

      // Handle other verification modes (password reset, phone verification)
      if (mode === 'resetPassword' && oobCode) {
        const verificationToken = await storage.verifyToken(oobCode as string, 'password_reset');

        if (!verificationToken) {
          return res.status(400).send(`
            <html>
              <head><title>Password Reset Failed</title></head>
              <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #e74c3c;">Password Reset Failed</h1>
                <p>The password reset link is invalid or has expired.</p>
                <p><a href="/" style="color: #3498db;">Return to FireFight</a></p>
              </body>
            </html>
          `);
        }

        // Redirect to password reset form with valid token
        return res.redirect(`/reset-password?token=${oobCode}`);
      }

      // Default response for unhandled modes
      res.status(400).send(`
        <html>
          <head><title>Invalid Request</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #e74c3c;">Invalid Request</h1>
            <p>The verification request is not valid.</p>
            <p><a href="/" style="color: #3498db;">Return to FireFight</a></p>
          </body>
        </html>
      `);

    } catch (error) {
      console.error("Error handling action code:", error);
      res.status(500).send(`
        <html>
          <head><title>Error</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #e74c3c;">Something went wrong</h1>
            <p>Please try again later or contact support.</p>
            <p><a href="/" style="color: #3498db;">Return to FireFight</a></p>
          </body>
        </html>
      `);
    }
  });



  // File upload route for tournament posters
  app.post('/api/upload/tournament-poster', upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // Generate the URL for the uploaded image
      const imageUrl = `/uploads/tournament-posters/${req.file.filename}`;

      res.json({ 
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });

  // Serve uploaded images
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Tournament routes
  app.get('/api/tournaments', async (req, res) => {
    try {
      const { status, game } = req.query;
      const tournaments = await storage.getTournaments({ status, game });
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournament = await storage.getTournament(parseInt(req.params.id));
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post('/api/tournaments', isAuthenticated, async (req: any, res) => {
    try {
      const {
        startTime,
        endTime,
        regOpenTime,
        regCloseTime,
        checkInTime,
        registrationEnd,
        ...otherFields
      } = req.body;

      const tournamentData = insertTournamentSchema.parse({
        ...otherFields,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : null,
        registrationStart: regOpenTime ? new Date(regOpenTime) : new Date(),
        registrationEnd: registrationEnd ? new Date(registrationEnd) : new Date(new Date(startTime || Date.now()).getTime() - 30 * 60 * 1000),
        checkInStart: checkInTime ? new Date(checkInTime) : null,
        checkInEnd: checkInTime ? new Date(new Date(checkInTime).getTime() + 30 * 60 * 1000) : null,
        createdBy: req.user.claims.sub
      });

      const tournament = await storage.createTournament(tournamentData);
      res.json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });

  app.post('/api/tournaments/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { teamId } = req.body;

      await storage.joinTournament(tournamentId, userId, teamId);
      res.json({ message: "Successfully joined tournament" });
    } catch (error) {
      console.error("Error joining tournament:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to join tournament" });
    }
  });

  app.get('/api/tournaments/:id/participants', async (req, res) => {
    try {
      const participants = await storage.getTournamentParticipants(parseInt(req.params.id));
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  // Team routes
  app.get('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getTeams(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const { players, ...teamFields } = req.body;

      // Generate unique team code if not provided or if it already exists
      let teamCode = teamFields.code;
      if (!teamCode) {
        teamCode = `TEAM-${Date.now()}`;
      }

      // Check if team code already exists and generate a unique one
      let codeExists = true;
      let attempts = 0;
      while (codeExists && attempts < 10) {
        try {
          const existingTeam = await storage.getTeamByCode(teamCode);
          if (!existingTeam) {
            codeExists = false;
          } else {
            teamCode = `${teamFields.code || 'TEAM'}-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            attempts++;
          }
        } catch (error) {
          codeExists = false; // If error checking, assume code is unique
        }
      }

      const teamData = insertTeamSchema.parse({
        ...teamFields,
        code: teamCode,
        captainId: req.user.claims.sub
      });

      const team = await storage.createTeam(teamData);

      // Add players to the team if provided
      if (players && Array.isArray(players)) {
        for (const player of players) {
          try {
            // Generate unique user ID
            const userId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Generate unique username if needed
            let username = player.username || player.playerName || `Player${Date.now()}`;
            let email = player.email;

            // If no email provided, generate one
            if (!email) {
              email = `${username.toLowerCase().replace(/\s+/g, '')}${Date.now()}@firefit.example.com`;
            }

            // Ensure email is unique
            let emailUnique = false;
            let emailAttempts = 0;
            while (!emailUnique && emailAttempts < 5) {
              try {
                const existingUser = await storage.getUserByEmail(email);
                if (!existingUser) {
                  emailUnique = true;
                } else {
                  email = `${username.toLowerCase().replace(/\s+/g, '')}${Date.now()}_${emailAttempts}@firefit.example.com`;
                  emailAttempts++;
                }
              } catch (error) {
                emailUnique = true; // If error checking, assume email is unique
              }
            }

            // Ensure username is unique
            let usernameUnique = false;
            let usernameAttempts = 0;
            const baseUsername = username;
            while (!usernameUnique && usernameAttempts < 5) {
              try {
                const existingUser = await storage.getUserByUsername(username);
                if (!existingUser) {
                  usernameUnique = true;
                } else {
                  username = `${baseUsername}_${Date.now()}_${usernameAttempts}`;
                  usernameAttempts++;
                }
              } catch (error) {
                usernameUnique = true; // If error checking, assume username is unique
              }
            }

            await storage.upsertUser({
              id: userId,
              username: username,
              email: email,
              profileImageUrl: player.avatar || player.avatarUrl,
              phoneNumber: player.phone,
              role: 'user',
              isActive: true,
              walletBalance: '0.00',
              kycStatus: 'pending'
            });

            // Add player to team
            await storage.addTeamMember(team.id, userId, player.role || 'player', player.gameId, player.phone);
          } catch (playerError) {
            console.error(`Error adding player ${player.username}:`, playerError);
            // Continue with other players if one fails
          }
        }
      }

      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);

      // Handle specific database constraint errors
      if (error.code === '23505') {
        if (error.constraint === 'teams_code_unique') {
          return res.status(409).json({ message: "Team code already exists. Please try again." });
        } else if (error.constraint === 'teams_name_unique') {
          return res.status(409).json({ message: "Team name already exists. Please choose a different name." });
        }
      }

      res.status(500).json({ message: "Failed to create team. Please try again." });
    }
  });

  // Update team
  app.put('/api/teams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { name, logoUrl } = req.body;

      if (!name?.trim()) {
        return res.status(400).json({ message: 'Team name is required' });
      }

      // Check if user is team captain
      const team = await storage.getTeam(teamId);
      if (!team || team.captainId !== req.user.claims.sub) {
        return res.status(403).json({ message: 'Only team captain can edit team' });
      }

      const updatedTeam = await storage.updateTeam(teamId, {
        name: name.trim(),
        logoUrl
      });

      res.json(updatedTeam);
    } catch (error) {
      console.error('Error updating team:', error);
      res.status(500).json({ message: 'Failed to update team' });
    }
  });

  // Delete team
  app.delete('/api/teams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);

      // Check if user is team captain
      const team = await storage.getTeam(teamId);
      if (!team || team.captainId !== req.user.claims.sub) {
        return res.status(403).json({ message: 'Only team captain can delete team' });
      }

      await storage.deleteTeam(teamId);

      res.json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('Error deleting team:', error);
      res.status(500).json({ message: 'Failed to delete team' });
    }
  });

  app.get('/api/teams/:id/members', async (req, res) => {
    try {
      const members = await storage.getTeamMembers(parseInt(req.params.id));
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post('/api/teams/:id/members', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { playerName, email, phone, gameId, role, avatarUrl, profileImageUrl } = req.body;

      // Create user for the new player
      const userId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await storage.upsertUser({
        id: userId,
        username: playerName,
        email: email || `${playerName}@example.com`,
        profileImageUrl: avatarUrl || profileImageUrl,
        phoneNumber: phone,
        role: 'user',
        isActive: true,
        walletBalance: '0.00',
        kycStatus: 'pending'
      });

      // Add player to team
      await storage.addTeamMember(teamId, userId, role || 'player', gameId, phone);
      res.json({ message: "Member added successfully" });
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Failed to add team member" });
    }
  });

  // Add player API endpoint for player modal
  app.post('/api/teams/:teamId/players', isAuthenticated, async (req: any, res) => {
    try {
      const { teamId } = req.params;
      const { playerName, email, phone, role, gameId, avatarUrl, profileImageUrl } = req.body;

      // Validate required fields
      if (!playerName || !gameId) {
        return res.status(400).json({ error: "Player name and game ID are required" });
      }

      // Use the provided avatar or profile image
      const finalAvatarUrl = avatarUrl || profileImageUrl || null;

      // Generate unique email if not provided or if email already exists
      let finalEmail = email;
      if (!finalEmail) {
        finalEmail = `${playerName.toLowerCase().replace(/\s+/g, '')}${Date.now()}@firefit.example.com`;
      }

      // Check if email already exists and generate unique one if needed
      let emailUnique = false;
      let emailAttempts = 0;
      while (!emailUnique && emailAttempts < 5) {
        try {
          const existingUser = await storage.getUserByEmail(finalEmail);
          if (!existingUser) {
            emailUnique = true;
          } else {
            finalEmail = `${playerName.toLowerCase().replace(/\s+/g, '')}${Date.now()}_${emailAttempts}@firefit.example.com`;
            emailAttempts++;
          }
        } catch (error) {
          emailUnique = true; // If error checking, assume email is unique
        }
      }

      // Create user for the new player
      const userId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await storage.upsertUser({
        id: userId,
        username: playerName,
        email: finalEmail,
        profileImageUrl: finalAvatarUrl,
        phoneNumber: phone,
        role: 'user',
        isActive: true,
        walletBalance: '0.00',
        kycStatus: 'pending'
      });

      // Add player to team
      await storage.addTeamMember(parseInt(teamId), userId, role || 'player', gameId, phone);

      res.json({ message: "Player added successfully", userId });
    } catch (error) {
      console.error("Error adding player:", error);
      res.status(500).json({ message: "Failed to add player" });
    }
  });

  // Update team member endpoint
  app.put('/api/teams/:teamId/members/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const { teamId, userId } = req.params;
      const { playerName, email, phone, gameId, role, avatarUrl, profileImageUrl } = req.body;

      // Use the provided avatar or profile image
      const finalAvatarUrl = avatarUrl || profileImageUrl || null;

      // Update user information
      await storage.upsertUser({
        id: userId,
        username: playerName,
        email: email,
        profileImageUrl: finalAvatarUrl,
        phoneNumber: phone,
        role: 'user',
        isActive: true,
        walletBalance: '0.00',
        kycStatus: 'pending'
      });

      // Update team member information
      await storage.updateTeamMember(teamId, userId, {
        role: role || 'player',
        gameId: gameId,
        contactInfo: phone
      });

      res.json({ message: "Player updated successfully" });
    } catch (error) {
      console.error("Error updating player:", error);
      res.status(500).json({ message: "Failed to update player" });
    }
  });

  // Wallet routes
  app.get('/api/wallet/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/wallet/deposit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;

      const transaction = await storage.createTransaction({
        userId,
        amount,
        type: 'deposit',
        status: 'completed', // In real app, this would be pending until payment is verified
        description: 'Wallet deposit'
      });

      await storage.updateUserWallet(userId, amount, 'add');
      res.json(transaction);
    } catch (error) {
      console.error("Error processing deposit:", error);
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  app.post('/api/wallet/withdraw', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;

      const transaction = await storage.createTransaction({
        userId,
        amount,
        type: 'withdrawal',
        status: 'pending',
        description: 'Wallet withdrawal'
      });

      res.json(transaction);
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard/:type', async (req, res) => {
    try {
      const { type } = req.params;
      const { game } = req.query;

      if (type !== 'players' && type !== 'teams') {
        return res.status(400).json({ message: "Invalid leaderboard type" });
      }

      const leaderboard = await storage.getLeaderboard(type, game as string);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Announcement routes
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  // Support routes
  app.get('/api/support/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getSupportTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  app.post('/api/support/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const ticketData = insertSupportTicketSchema.parse({
        ...req.body,
        userId: req.user.claims.sub
      });
      const ticket = await storage.createSupportTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  // Admin routes
  app.get('/api/admin/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return res.status(403).json({ message: "Access denied" });
      }

      const { role, kycStatus } = req.query;
      const users = await storage.getUsers({ role, kycStatus });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return res.status(403).json({ message: "Access denied" });
      }

      const withdrawals = await storage.getPendingWithdrawals();
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  app.post('/api/admin/withdrawals/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return res.status(403).json({ message: "Access denied" });
      }

      const transactionId = parseInt(req.params.id);
      await storage.updateTransaction(transactionId, {
        status: 'completed',
        processedBy: req.user.claims.sub,
        processedAt: new Date()
      });

      res.json({ message: "Withdrawal approved" });
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      res.status(500).json({ message: "Failed to approve withdrawal" });
    }
  });

  app.post('/api/admin/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin' && user?.role !== 'moderator') {
        return res.status(403).json({ message: "Access denied" });
      }

      const announcementData = insertAnnouncementSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub
      });
      const announcement = await storage.createAnnouncement(announcementData);
      res.json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup - Temporarily disabled to fix connection errors
  // const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // wss.on('connection', (ws: WebSocket) => {
  //   console.log('Client connected to WebSocket');

  //   ws.on('message', (message: string) => {
  //     try {
  //       const data = JSON.parse(message);
  //       console.log('Received:', data);

  //       // Handle different types of messages
  //       switch (data.type) {
  //         case 'join_tournament_room':
  //           // Broadcast to all clients that someone joined
  //           wss.clients.forEach((client) => {
  //             if (client !== ws && client.readyState === WebSocket.OPEN) {
  //               client.send(JSON.stringify({
  //                 type: 'tournament_update',
  //                 tournamentId: data.tournamentId,
  //                 message: 'New participant joined'
  //               }));
  //             }
  //           });
  //           break;

  //         case 'tournament_status_update':
  //           // Broadcast tournament status changes
  //           wss.clients.forEach((client) => {
  //             if (client.readyState === WebSocket.OPEN) {
  //               client.send(JSON.stringify(data));
  //             }
  //           });
  //           break;
  //       }
  //     } catch (error) {
  //       console.error('WebSocket message error:', error);
  //     }
  //   });

  //   ws.on('close', () => {
  //     console.log('Client disconnected from WebSocket');
  //   });

  //   // Send welcome message
  //   ws.send(JSON.stringify({
  //     type: 'connected',
  //     message: 'Connected to FireFight WebSocket'
  //   }));
  // });

  return httpServer;
}