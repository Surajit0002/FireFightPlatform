# replit.md

## Overview

FireFight is a full-stack esports tournament platform built with React, Node.js/Express, and PostgreSQL. The application features two distinct portals: a user portal for gamers to participate in tournaments and an admin portal for tournament management. The system handles tournament creation, team management, user authentication, wallet transactions, and real-time match updates.

## Recent Changes

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