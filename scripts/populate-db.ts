import { db } from '../server/db';
import { 
  users, 
  tournaments, 
  teams, 
  teamMembers, 
  tournamentParticipants, 
  transactions, 
  announcements, 
  supportTickets 
} from '../shared/schema';

async function populateDatabase() {
  console.log('🚀 Starting database population...');

  try {
    // First check if users already exist
    const existingUsers = await db.select().from(users);
    console.log(`Found ${existingUsers.length} existing users`);

    let sampleUsers;
    if (existingUsers.length === 0) {
      // Create sample users
      console.log('📝 Creating sample users...');
      sampleUsers = await db.insert(users).values([
      {
        id: 'user1',
        username: 'FireGamer',
        email: 'fire@example.com',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fire',
        walletBalance: '1500.00',
        totalEarnings: '2500.00',
        winRate: '75.5',
        matchesPlayed: 45,
        xpPoints: 1250,
        level: 12,
        role: 'user',
        kycStatus: 'verified',
        isActive: true
      },
      {
        id: 'user2',
        username: 'BattleMaster',
        email: 'battle@example.com',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=battle',
        walletBalance: '2200.00',
        totalEarnings: '3800.00',
        winRate: '82.3',
        matchesPlayed: 67,
        xpPoints: 2100,
        level: 18,
        role: 'user',
        kycStatus: 'verified',
        isActive: true
      },
      {
        id: 'user3',
        username: 'ProSniper',
        email: 'sniper@example.com',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sniper',
        walletBalance: '850.00',
        totalEarnings: '1200.00',
        winRate: '68.2',
        matchesPlayed: 28,
        xpPoints: 890,
        level: 8,
        role: 'user',
        kycStatus: 'pending',
        isActive: true
      },
      {
        id: 'admin1',
        username: 'AdminPro',
        email: 'admin@firelight.com',
        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        walletBalance: '0.00',
        totalEarnings: '0.00',
        winRate: '0',
        matchesPlayed: 0,
        xpPoints: 0,
        level: 1,
        role: 'admin',
        kycStatus: 'verified',
        isActive: true
      }
    ]).returning();
    } else {
      console.log('✓ Using existing users');
      sampleUsers = existingUsers;
    }

    // Create sample tournaments
    console.log('🏆 Creating sample tournaments...');
    const sampleTournaments = await db.insert(tournaments).values([
      {
        title: 'Fire Storm Championship',
        description: 'The ultimate Free Fire tournament with massive prizes! Join the most competitive players in an epic battle royale showdown.',
        game: 'free_fire',
        format: 'squad',
        prizePool: '50000.00',
        entryFee: '100.00',
        maxSlots: 100,
        currentSlots: 67,
        teamSize: 4,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // Day after tomorrow
        registrationEnd: new Date(Date.now() + 23 * 60 * 60 * 1000), // 1 hour before start
        status: 'upcoming',
        rules: 'Standard Free Fire rules apply. No cheating, hacking, or exploiting. Fair play only.',
        roomId: 'FF123456',
        roomPassword: 'FIRE2024',
        posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        createdBy: 'admin1'
      },
      {
        title: 'BGMI Pro League',
        description: 'Professional BGMI tournament featuring top-tier teams competing for glory and substantial prize money.',
        game: 'bgmi',
        format: 'squad',
        prizePool: '75000.00',
        entryFee: '150.00',
        maxSlots: 64,
        currentSlots: 48,
        teamSize: 4,
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
        endTime: new Date(Date.now() + 50 * 60 * 60 * 1000), // 2 days + 2 hours
        registrationEnd: new Date(Date.now() + 47 * 60 * 60 * 1000), // 1 hour before start
        status: 'upcoming',
        rules: 'BGMI competitive rules. No third-party apps. Official version only.',
        roomId: 'BGMI789',
        roomPassword: 'BGMI2024',
        posterUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
        createdBy: 'admin1'
      },
      {
        title: 'Valorant Champions Cup',
        description: 'Elite Valorant tournament showcasing the best tactical gameplay and team coordination.',
        game: 'valorant',
        format: 'squad',
        prizePool: '100000.00',
        entryFee: '200.00',
        maxSlots: 32,
        currentSlots: 24,
        teamSize: 5,
        startTime: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(Date.now() + 76 * 60 * 60 * 1000), // 3 days + 4 hours
        registrationEnd: new Date(Date.now() + 71 * 60 * 60 * 1000), // 1 hour before start
        status: 'upcoming',
        rules: 'Valorant official competitive rules. No exploits or unauthorized modifications.',
        roomId: 'VAL456789',
        roomPassword: 'VAL2024',
        posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        createdBy: 'admin1'
      },
      {
        title: 'Free Fire Beginners Cup',
        description: 'Perfect tournament for new players to showcase their skills in a friendly competitive environment.',
        game: 'free_fire',
        format: 'duo',
        prizePool: '5000.00',
        entryFee: '0.00',
        maxSlots: 50,
        currentSlots: 32,
        teamSize: 2,
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        endTime: new Date(Date.now() + 14 * 60 * 60 * 1000), // 14 hours from now
        registrationEnd: new Date(Date.now() + 11 * 60 * 60 * 1000), // 1 hour before start
        status: 'upcoming',
        rules: 'Beginner-friendly rules. New players welcome. No smurfing allowed.',
        roomId: 'FF999',
        roomPassword: 'BEGINNER',
        posterUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
        createdBy: 'admin1'
      },
      {
        title: 'PUBG Mobile Masters',
        description: 'Completed tournament showcasing the best PUBG Mobile players with incredible matches.',
        game: 'pubg',
        format: 'squad',
        prizePool: '30000.00',
        entryFee: '75.00',
        maxSlots: 80,
        currentSlots: 80,
        teamSize: 4,
        startTime: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
        endTime: new Date(Date.now() - 68 * 60 * 60 * 1000), // 3 days ago + 4 hours
        registrationEnd: new Date(Date.now() - 73 * 60 * 60 * 1000), // 1 hour before start
        status: 'completed',
        rules: 'PUBG Mobile official tournament rules applied.',
        roomId: 'PUBG123',
        roomPassword: 'PUBG2024',
        posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        createdBy: 'admin1'
      }
    ]).returning();

    // Create sample teams
    console.log('👥 Creating sample teams...');
    const sampleTeams = await db.insert(teams).values([
      {
        name: 'Fire Legends',
        code: 'FIRE2024',
        captainId: 'user1',
        totalMembers: 4,
        isActive: true
      },
      {
        name: 'Battle Royals',
        code: 'ROYAL123',
        captainId: 'user2',
        totalMembers: 4,
        isActive: true
      },
      {
        name: 'Sniper Squad',
        code: 'SNIPER99',
        captainId: 'user3',
        totalMembers: 3,
        isActive: true
      }
    ]).returning();

    // Create team members
    console.log('👤 Adding team members...');
    await db.insert(teamMembers).values([
      {
        teamId: sampleTeams[0].id,
        userId: 'user1',
        role: 'captain',
        joinedAt: new Date()
      },
      {
        teamId: sampleTeams[1].id,
        userId: 'user2',
        role: 'captain',
        joinedAt: new Date()
      },
      {
        teamId: sampleTeams[2].id,
        userId: 'user3',
        role: 'captain',
        joinedAt: new Date()
      }
    ]);

    // Create tournament participants
    console.log('🎮 Adding tournament participants...');
    await db.insert(tournamentParticipants).values([
      {
        tournamentId: sampleTournaments[0].id,
        userId: 'user1',
        teamId: sampleTeams[0].id,
        status: 'registered',
        prizeWon: '0.00'
      },
      {
        tournamentId: sampleTournaments[1].id,
        userId: 'user2',
        teamId: sampleTeams[1].id,
        status: 'registered',
        prizeWon: '0.00'
      },
      {
        tournamentId: sampleTournaments[4].id, // Completed tournament
        userId: 'user1',
        teamId: sampleTeams[0].id,
        status: 'confirmed',
        rank: 1,
        prizeWon: '15000.00'
      },
      {
        tournamentId: sampleTournaments[4].id, // Completed tournament
        userId: 'user2',
        teamId: sampleTeams[1].id,
        status: 'registered',
        rank: 2,
        prizeWon: '10000.00'
      }
    ]);

    // Create sample transactions
    console.log('💰 Creating sample transactions...');
    await db.insert(transactions).values([
      {
        userId: 'user1',
        type: 'prize',
        amount: '15000.00',
        description: 'Prize money from PUBG Mobile Masters - 1st Place',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: 'user2',
        type: 'prize',
        amount: '10000.00',
        description: 'Prize money from PUBG Mobile Masters - 2nd Place',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        userId: 'user1',
        type: 'deposit',
        amount: '500.00',
        description: 'Wallet deposit via UPI',
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        userId: 'user2',
        type: 'entry_fee',
        amount: '150.00',
        description: 'Entry fee for BGMI Pro League',
        status: 'completed',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        userId: 'user3',
        type: 'withdrawal',
        amount: '300.00',
        description: 'Withdrawal to bank account',
        status: 'pending',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]);

    // Create sample announcements
    console.log('📢 Creating sample announcements...');
    await db.insert(announcements).values([
      {
        title: 'New Tournament: Fire Storm Championship',
        content: 'Join our biggest Free Fire tournament yet! Register now and compete for a massive ₹50,000 prize pool.',
        type: 'tournament',
        isActive: true,
        createdBy: 'admin1'
      },
      {
        title: 'Platform Maintenance Scheduled',
        content: 'We will be performing scheduled maintenance on July 18th from 2:00 AM to 4:00 AM IST. Some features may be temporarily unavailable.',
        type: 'maintenance',
        isActive: true,
        createdBy: 'admin1'
      },
      {
        title: 'New Prize Pool System',
        content: 'We have updated our prize distribution system for better transparency and faster payouts. Check out the new features!',
        type: 'general',
        isActive: true,
        createdBy: 'admin1'
      }
    ]);

    // Create sample support tickets
    console.log('🎫 Creating sample support tickets...');
    await db.insert(supportTickets).values([
      {
        userId: 'user1',
        subject: 'Prize money not received',
        description: 'I won the tournament yesterday but haven\'t received my prize money yet. Please help.',
        category: 'payment',
        priority: 'high',
        status: 'in_progress',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        userId: 'user2',
        subject: 'Unable to join tournament',
        description: 'Getting an error when trying to join the BGMI Pro League. Room ID seems incorrect.',
        category: 'technical',
        priority: 'medium',
        status: 'open',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      },
      {
        userId: 'user3',
        subject: 'KYC verification help',
        description: 'Need help with KYC verification process. Documents keep getting rejected.',
        category: 'kyc',
        priority: 'medium',
        status: 'resolved',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
      }
    ]);

    console.log('✅ Database populated successfully!');
    console.log('📊 Sample data created:');
    console.log('- 4 users (3 players + 1 admin)');
    console.log('- 5 tournaments (4 upcoming + 1 completed)');
    console.log('- 3 teams with members');
    console.log('- Tournament participants and results');
    console.log('- 5 financial transactions');
    console.log('- 3 announcements');
    console.log('- 3 support tickets');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  }
}

// Run the population script
populateDatabase()
  .then(() => {
    console.log('🎉 Database population completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database population failed:', error);
    process.exit(1);
  });