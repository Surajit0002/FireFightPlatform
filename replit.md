# replit.md

## Overview

FireFight is a full-stack esports tournament platform built with React, Node.js/Express, and PostgreSQL. The application features two distinct portals: a user portal for gamers to participate in tournaments and an admin portal for tournament management. The system handles tournament creation, team management, user authentication, wallet transactions, and real-time match updates.

## Recent Changes

### Complete Database Setup and Migration (July 17, 2025)
- Successfully created PostgreSQL database instance with all required environment variables
- Pushed all 16 database tables using Drizzle Kit migrations
- Created comprehensive database schema including:
  - Core tables: users, tournaments, teams, team_members, tournament_participants, matches
  - Transaction system: transactions table with comprehensive type and status enums
  - Support system: announcements, support_tickets, kyc_documents tables
  - Enhanced security: user_sessions, security_logs, user_roles, user_role_assignments, verification_tokens
  - Session management: sessions table for Replit Auth integration
- Established 5 custom PostgreSQL enums for game types, tournament/match statuses, and transaction types
- Set up 39 foreign key relationships ensuring proper data integrity
- Created unique constraints for critical fields (emails, usernames, session tokens, verification tokens)
- Successfully started development server with full database connectivity
- All database operations now fully functional with Drizzle ORM integration

### Enhanced Authentication System with Advanced Security Features (July 17, 2025)
- Implemented comprehensive authentication system with enhanced security features
- Added advanced security middleware with role-based and permission-based authorization
- Created extensive authentication routes including session management, 2FA, and verification
- Enhanced database storage with security logging, user sessions, and verification tokens
- Built SecurityDashboard component with risk assessment, session management, and security logs
- Created AuthGuard component with role-based access control and account status checking
- Added security event logging for all authentication activities with risk scoring
- Implemented two-factor authentication support with QR code generation
- Added email and phone verification systems with token-based verification
- Enhanced user profile management with security status indicators
- Created admin security management endpoints for account locking and role assignment
- All authentication features now include comprehensive audit logging and risk assessment

### Database Error Fix and Full Data Population (July 16, 2025)
- Fixed database connection issues by creating new PostgreSQL database instance
- Successfully pushed all database schemas using Drizzle migrations
- Populated database with comprehensive sample data including:
  - 4 users with realistic profiles (3 players + 1 admin)
  - 5 tournaments across different games (Free Fire, BGMI, Valorant, PUBG)
  - 3 active teams with proper member relationships
  - 5 financial transactions covering all transaction types
  - 3 system announcements for platform communication
  - 3 support tickets demonstrating the help system
- Resolved email verification URL error by ensuring proper database setup
- All database tables and relationships now working correctly
- Development server restarted and application ready for use

### Team Creation and Member Management Fix (July 16, 2025)
- Fixed "request entity too large" error in team creation by adding 10MB request limit
- Implemented automatic image compression for team logos (~50KB) and player avatars (~30KB)
- Updated team creation API to properly save players added in the team modal
- Enhanced team members retrieval to include user profile information
- Created comprehensive team details modal showing all team members with roles and avatars
- Fixed team member display in team cards to show actual database members
- Added proper team member management with role-based permissions

### Database Setup and Sample Data Population (July 16, 2025)
- Successfully created PostgreSQL database with all required tables and schemas
- Populated database with comprehensive sample data including:
  - 4 users (3 players + 1 admin) with realistic profiles and statistics
  - 5 tournaments (4 upcoming + 1 completed) across different games
  - 3 teams with proper member management
  - Tournament participation records with winner/placement tracking
  - 5 financial transactions (deposits, withdrawals, prizes, entry fees)
  - 3 system announcements for different categories
  - 3 support tickets with various status levels
- Fixed all database schema TypeScript errors in storage implementation
- Created database population script for easy data refresh
- All database relationships and constraints working correctly

### Website Error Fixes and Enhancements (July 16, 2025)
- Fixed critical JavaScript error with invalid 'Fire' import from lucide-react (replaced with 'Flame')
- Removed all invalid icon imports causing website crashes
- Added comprehensive error handling with ErrorBoundary components
- Implemented proper loading states with LoadingSpinner and LoadingCard components
- Enhanced tournament page with better error recovery and retry functionality
- Added improved empty state handling with contextual messages
- Implemented proper TypeScript error handling and query error management
- Added loading spinners and skeleton screens for better user experience
- Fixed all import paths and type definitions for consistent functionality
- Enhanced overall website stability and error resilience

### Compact Tournament Card Redesign (July 16, 2025)
- Completely redesigned tournament cards to be compact and modern following popular esports designs
- Implemented 4-column stats grid showing Prize Pool, Slots, Entry Fee, and Start Time in color-coded sections
- Added dynamic status badges (LIVE, COMPLETED, FREE ENTRY, countdown timer)
- Created game-specific color schemes with rounded icon badges
- Added visual progress bar showing slots filled percentage with color-coded urgency
- Implemented responsive grid layout (1-4 columns based on screen size)
- Added proper action buttons with context-aware text and icons
- Reduced card height while maintaining all essential information visibility
- Enhanced mobile responsiveness with compact layout design
- Improved typography and spacing for better readability

### Dynamic Tournament Cards Implementation (July 16, 2025)
- Added poster image support to tournaments database schema with `posterUrl` field
- Completely redesigned tournament card component following modern esports design specifications
- Implemented dynamic poster banners with gradient overlays and responsive image handling
- Added dynamic overlay tags system (Featured, Free Entry, Beginner Friendly)
- Created game-specific color schemes and enhanced visual hierarchy
- Added hover animations, scale effects, and smooth transitions
- Implemented slot fill progress bars with visual feedback
- Added notification bell for upcoming tournaments
- Enhanced responsive design with mobile-first approach
- Added comprehensive fallback system for missing poster images

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with session-based authentication
- **WebSocket**: WebSocket Server for real-time features
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migration System**: Drizzle Kit for database migrations
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions stored in PostgreSQL
- **Authorization**: Role-based access control (user, admin, moderator)
- **User Management**: User profiles with KYC verification support

### Tournament Management
- **Tournament Types**: Solo, duo, squad, team formats
- **Game Support**: Free Fire, BGMI, Valorant, and other games
- **Status Tracking**: Upcoming, live, completed, cancelled states
- **Room Management**: Automated room ID/password generation

### Team System
- **Team Creation**: User-initiated team formation with invite codes
- **Role Management**: Captain-based team hierarchy
- **Member Management**: Add/remove team members functionality

### Wallet & Finance
- **Balance Management**: Decimal-based wallet balance tracking
- **Transaction History**: Comprehensive transaction logging
- **Deposit/Withdrawal**: UPI-based payment integration
- **Prize Distribution**: Automated prize pool distribution

### Real-time Features
- **WebSocket Integration**: Live tournament updates
- **Match Status**: Real-time match progress tracking
- **Notifications**: Live notification system for users

## Data Flow

### Tournament Participation Flow
1. User browses tournaments on the main portal
2. User joins tournament (solo or with team)
3. Tournament status updates trigger WebSocket notifications
4. Match results are uploaded and verified
5. Prize distribution occurs automatically

### Admin Management Flow
1. Admin creates tournaments through admin portal
2. Tournament details are stored in PostgreSQL
3. User participation is tracked in real-time
4. Admin can manage results and resolve disputes
5. Financial transactions are processed and logged

### Authentication Flow
1. User initiates login through Replit Auth
2. OpenID Connect handles authentication
3. Session is created and stored in PostgreSQL
4. User role determines portal access (user vs admin)
5. Session validation occurs on each request

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: UI component primitives
- **wouter**: Lightweight routing solution
- **ws**: WebSocket implementation

### Authentication Dependencies
- **openid-client**: OpenID Connect client
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Dependencies
- **vite**: Frontend build tool
- **tsx**: TypeScript execution
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with auto-restart on file changes
- **Database**: Neon serverless PostgreSQL
- **Environment**: Replit-optimized with auto-scaling

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Assets**: Served through Express static middleware
- **Database**: Production PostgreSQL with connection pooling

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **SESSION_SECRET**: Session encryption secret
- **REPLIT_DOMAINS**: Allowed domains for CORS
- **ISSUER_URL**: OpenID Connect issuer URL

### File Structure
```
/client          # Frontend React application
/server          # Backend Express application
/shared          # Shared TypeScript definitions and schemas
/migrations      # Database migration files
/attached_assets # Project documentation and assets
```

The application uses a monorepo structure with clear separation between frontend, backend, and shared code, making it easy to maintain and scale both portals independently while sharing common data models and utilities.