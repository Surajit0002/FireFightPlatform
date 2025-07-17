import React, { ErrorInfo, ReactNode } from "react";
import { Router } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Landing from "@/pages/landing";
import UserHome from "@/pages/user/home";
import UserTournaments from "@/pages/user/tournaments";
import UserTeams from "@/pages/user/teams";
import UserLeaderboard from "@/pages/user/leaderboard";
import UserWallet from "@/pages/user/wallet";
import UserProfile from "@/pages/user/profile";
import UserSupport from "@/pages/user/support";
import UserAnnouncements from "@/pages/user/announcements";
import UserMyTournaments from "@/pages/user/my-tournaments";
import UserTournamentDetails from "@/pages/user/tournament-details";
import UserMatchCenter from "@/pages/user/match-center";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTournaments from "@/pages/admin/tournaments";
import AdminUsersTeams from "@/pages/admin/users-teams";
import AdminWalletFinance from "@/pages/admin/wallet-finance";
import AdminKycManagement from "@/pages/admin/kyc-management";
import AdminSupportTickets from "@/pages/admin/support-tickets";
import AdminMatchResults from "@/pages/admin/match-results";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminAnalytics from "@/pages/admin/analytics";
import NotFound from "@/pages/not-found";
import { Route, Switch } from "wouter";

class AppErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundary
          error={this.state.error}
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
            window.location.reload();
          }}
          title="Application Error"
          description="The application encountered an error. Please try refreshing the page."
        />
      );
    }

    return this.props.children;
  }
}

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AppErrorBoundary>
      <Router>
        {!user ? (
          <Landing />
        ) : (
          <Switch>
            {/* User Routes */}
            <Route path="/" component={UserHome} />
            <Route path="/tournaments" component={UserTournaments} />
            <Route path="/teams" component={UserTeams} />
            <Route path="/leaderboard" component={UserLeaderboard} />
            <Route path="/wallet" component={UserWallet} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/support" component={UserSupport} />
            <Route path="/announcements" component={UserAnnouncements} />
            <Route path="/my-tournaments" component={UserMyTournaments} />
            <Route path="/tournaments/:id" component={UserTournamentDetails} />
            <Route path="/match-center" component={UserMatchCenter} />

            {/* Admin Routes */}
            {(user.role === 'admin' || user.role === 'moderator') && (
              <>
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/admin/tournaments" component={AdminTournaments} />
                <Route path="/admin/users-teams" component={AdminUsersTeams} />
                <Route path="/admin/wallet-finance" component={AdminWalletFinance} />
                <Route path="/admin/kyc-management" component={AdminKycManagement} />
                <Route path="/admin/support-tickets" component={AdminSupportTickets} />
                <Route path="/admin/match-results" component={AdminMatchResults} />
                <Route path="/admin/announcements" component={AdminAnnouncements} />
                <Route path="/admin/analytics" component={AdminAnalytics} />
              </>
            )}

            <Route component={NotFound} />
          </Switch>
        )}
      </Router>
    </AppErrorBoundary>
  );
}

export default App;