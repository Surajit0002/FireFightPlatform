import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertTournamentSchema, 
  insertTeamSchema, 
  insertTransactionSchema,
  insertAnnouncementSchema,
  insertSupportTicketSchema,
  insertKycDocumentSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserStats(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

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
      const tournamentData = insertTournamentSchema.parse({
        ...req.body,
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
      const teamData = insertTeamSchema.parse({
        ...teamFields,
        captainId: req.user.claims.sub
      });
      
      const team = await storage.createTeam(teamData);
      
      // Add players to the team if provided
      if (players && Array.isArray(players)) {
        for (const player of players) {
          // Create user if not exists (for demo purposes, in real app you'd invite existing users)
          const userId = `player_${player.id}`;
          await storage.upsertUser({
            id: userId,
            username: player.username,
            email: player.email || `${player.username}@example.com`,
            avatarUrl: player.avatar,
            phoneNumber: player.phone,
            gameId: player.gameId,
            role: 'user',
            isActive: true,
            walletBalance: '0.00',
            kycStatus: 'pending',
            profileCompleted: true,
            totalEarnings: '0.00',
            totalTournaments: 0,
            winRate: 0,
            avgPlacement: 0,
            skillRating: 1000,
            reputation: 100
          });
          
          // Add player to team
          await storage.addTeamMember(team.id, userId, player.role);
        }
      }
      
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Failed to create team" });
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
      const { userId, role } = req.body;
      await storage.addTeamMember(teamId, userId, role);
      res.json({ message: "Member added successfully" });
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Failed to add team member" });
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

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);

        // Handle different types of messages
        switch (data.type) {
          case 'join_tournament_room':
            // Broadcast to all clients that someone joined
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'tournament_update',
                  tournamentId: data.tournamentId,
                  message: 'New participant joined'
                }));
              }
            });
            break;
          
          case 'tournament_status_update':
            // Broadcast tournament status changes
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to FireFight WebSocket'
    }));
  });

  return httpServer;
}
