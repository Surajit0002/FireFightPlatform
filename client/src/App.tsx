import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";

// User Portal Pages
import UserHome from "@/pages/user/home";
import Tournaments from "@/pages/user/tournaments";
import TournamentDetails from "@/pages/user/tournament-details";
import MatchCenter from "@/pages/user/match-center";
import MyTournaments from "@/pages/user/my-tournaments";
import Wallet from "@/pages/user/wallet";
import Teams from "@/pages/user/teams";
import Leaderboard from "@/pages/user/leaderboard";
import Profile from "@/pages/user/profile";
import Support from "@/pages/user/support";
import Announcements from "@/pages/user/announcements";

// Admin Portal Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTournaments from "@/pages/admin/tournaments";
import AdminMatchResults from "@/pages/admin/match-results";
import AdminWalletFinance from "@/pages/admin/wallet-finance";
import AdminUsersTeams from "@/pages/admin/users-teams";
import AdminKycManagement from "@/pages/admin/kyc-management";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminSupportTickets from "@/pages/admin/support-tickets";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location] = useLocation();
  
  const isAdminRoute = location.startsWith('/admin');
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {/* User Portal Routes */}
          <Route path="/" component={UserHome} />
          <Route path="/tournaments" component={Tournaments} />
          <Route path="/tournaments/:id" component={TournamentDetails} />
          <Route path="/match-center" component={MatchCenter} />
          <Route path="/my-tournaments" component={MyTournaments} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/teams" component={Teams} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/support" component={Support} />
          <Route path="/announcements" component={Announcements} />

          {/* Admin Portal Routes */}
          {isAdmin && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/tournaments" component={AdminTournaments} />
              <Route path="/admin/match-results" component={AdminMatchResults} />
              <Route path="/admin/wallet-finance" component={AdminWalletFinance} />
              <Route path="/admin/users-teams" component={AdminUsersTeams} />
              <Route path="/admin/kyc-management" component={AdminKycManagement} />
              <Route path="/admin/announcements" component={AdminAnnouncements} />
              <Route path="/admin/analytics" component={AdminAnalytics} />
              <Route path="/admin/support-tickets" component={AdminSupportTickets} />
            </>
          )}
        </>
      )}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
