import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  Upload,
  DollarSign,
  Calendar,
  Users,
  Star,
  Flag,
  AlertTriangle,
} from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function MyTournaments() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  // In a real app, this would be a user-specific endpoint
  // For now, we'll simulate user's tournament participation
  const userTournaments = tournaments.map(tournament => ({
    ...tournament,
    // Simulated user participation data
    userStatus: tournament.status === 'completed' ? 'winner' : 'registered',
    userRank: tournament.status === 'completed' ? Math.floor(Math.random() * 10) + 1 : null,
    userKills: tournament.status === 'completed' ? Math.floor(Math.random() * 15) + 1 : null,
    prizeWon: tournament.status === 'completed' ? (Math.random() * parseFloat(tournament.prizePool) * 0.1).toFixed(2) : "0.00",
    screenshotUploaded: tournament.status === 'live' ? Math.random() > 0.5 : false,
    joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const upcomingTournaments = userTournaments.filter(t => t.status === 'upcoming');
  const liveTournaments = userTournaments.filter(t => t.status === 'live');
  const completedTournaments = userTournaments.filter(t => t.status === 'completed');
  const cancelledTournaments = userTournaments.filter(t => t.status === 'cancelled');

  const getStatusColor = (status: string, userStatus: string) => {
    if (userStatus === 'disqualified') return 'bg-red-500';
    if (userStatus === 'winner') return 'bg-yellow-500';
    
    switch (status) {
      case 'live': return 'bg-fire-red';
      case 'upcoming': return 'bg-fire-blue';
      case 'completed': return 'bg-fire-green';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string, userStatus: string) => {
    if (userStatus === 'disqualified') return 'Disqualified';
    if (userStatus === 'winner') return 'Winner';
    
    switch (status) {
      case 'live': return 'Live';
      case 'upcoming': return 'Registered';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const TournamentCard = ({ tournament }: { tournament: any }) => {
    const gameIcons: Record<string, string> = {
      free_fire: "🔥",
      bgmi: "🎯",
      valorant: "⚡",
      csgo: "💥",
      pubg: "🎮",
    };

    const isLive = tournament.status === 'live';
    const isCompleted = tournament.status === 'completed';
    const isUpcoming = tournament.status === 'upcoming';
    const isWinner = tournament.userStatus === 'winner';
    const isDisqualified = tournament.userStatus === 'disqualified';

    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{gameIcons[tournament.game] || "🎮"}</div>
              <div>
                <CardTitle className="text-lg">{tournament.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  Joined {new Date(tournament.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isWinner && <Star className="w-5 h-5 text-yellow-500" />}
              <Badge className={`${getStatusColor(tournament.status, tournament.userStatus)} text-white`}>
                {getStatusText(tournament.status, tournament.userStatus)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tournament Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Prize Pool:</span>
              <div className="font-semibold fire-green">₹{tournament.prizePool}</div>
            </div>
            <div>
              <span className="text-gray-500">Entry Fee:</span>
              <div className="font-semibold">
                {parseFloat(tournament.entryFee) === 0 ? "FREE" : `₹${tournament.entryFee}`}
              </div>
            </div>
          </div>

          {/* Match Results */}
          {isCompleted && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{tournament.userRank}</div>
                  <div className="text-gray-500">Rank</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{tournament.userKills}</div>
                  <div className="text-gray-500">Kills</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold fire-green">₹{tournament.prizeWon}</div>
                  <div className="text-gray-500">Won</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Match Progress</span>
              <span className="capitalize">{tournament.status}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-fire-green" />
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div 
                  className={`h-2 rounded ${
                    isCompleted ? 'bg-fire-green' : isLive ? 'bg-fire-red' : 'bg-fire-blue'
                  }`}
                  style={{ 
                    width: isCompleted ? '100%' : isLive ? '75%' : '25%' 
                  }}
                ></div>
              </div>
              <Trophy className={`w-4 h-4 ${isCompleted ? 'text-fire-green' : 'text-gray-300'}`} />
            </div>
            <div className="text-xs text-gray-500">
              Joined → {isLive ? 'Playing' : isCompleted ? 'Completed' : 'Waiting'} → {isCompleted ? 'Finished' : 'Pending'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link href={`/tournaments/${tournament.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>

            {isLive && !tournament.screenshotUploaded && (
              <Button size="sm" className="bg-fire-green hover:bg-green-600 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Result
              </Button>
            )}

            {isCompleted && parseFloat(tournament.prizeWon) > 0 && (
              <Button size="sm" className="bg-fire-blue hover:bg-blue-600 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Withdraw Prize
              </Button>
            )}

            {isCompleted && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Certificate
              </Button>
            )}

            {isDisqualified && (
              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4 mr-2" />
                Appeal
              </Button>
            )}
          </div>

          {/* Status Messages */}
          {isLive && tournament.screenshotUploaded && (
            <div className="bg-yellow-50 p-2 rounded text-sm text-yellow-700">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Screenshot uploaded. Awaiting verification.
            </div>
          )}

          {isDisqualified && (
            <div className="bg-red-50 p-2 rounded text-sm text-red-700">
              <XCircle className="w-4 h-4 inline mr-1" />
              Disqualified for rule violation. Contact support if you believe this is an error.
            </div>
          )}

          {isWinner && (
            <div className="bg-green-50 p-2 rounded text-sm text-green-700">
              <Trophy className="w-4 h-4 inline mr-1" />
              Congratulations! You won ₹{tournament.prizeWon} in this tournament.
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const StatsCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold fire-gray">{value}</div>
            <div className="text-sm text-gray-500">{title}</div>
            {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">My Tournaments</h1>
          <p className="text-gray-600">
            Track your tournament history, results, and manage your participations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Tournaments"
            value={userTournaments.length}
            icon={Trophy}
            color="bg-fire-blue"
          />
          <StatsCard
            title="Wins"
            value={userTournaments.filter(t => t.userStatus === 'winner').length}
            subtitle={`${user?.winRate || 0}% win rate`}
            icon={Star}
            color="bg-fire-green"
          />
          <StatsCard
            title="Total Earnings"
            value={`₹${user?.totalEarnings || "0.00"}`}
            icon={DollarSign}
            color="bg-fire-orange"
          />
          <StatsCard
            title="Active Matches"
            value={liveTournaments.length + upcomingTournaments.length}
            icon={Clock}
            color="bg-fire-red"
          />
        </div>

        {/* Tournament History */}
        <Card>
          <CardHeader>
            <CardTitle>Tournament History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({upcomingTournaments.length})</TabsTrigger>
                <TabsTrigger value="live">Live ({liveTournaments.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTournaments.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledTournaments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {userTournaments.length > 0 ? (
                    userTournaments.map((tournament) => (
                      <TournamentCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tournaments Yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't joined any tournaments yet. Start competing now!
                      </p>
                      <Link href="/tournaments">
                        <Button className="bg-fire-red hover:bg-red-600 text-white">
                          Browse Tournaments
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                <div className="space-y-4">
                  {upcomingTournaments.length > 0 ? (
                    upcomingTournaments.map((tournament) => (
                      <TournamentCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Tournaments</h3>
                      <p className="text-gray-500">You don't have any upcoming tournaments.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="live" className="mt-6">
                <div className="space-y-4">
                  {liveTournaments.length > 0 ? (
                    liveTournaments.map((tournament) => (
                      <TournamentCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Live Tournaments</h3>
                      <p className="text-gray-500">You don't have any live tournaments at the moment.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="space-y-4">
                  {completedTournaments.length > 0 ? (
                    completedTournaments.map((tournament) => (
                      <TournamentCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Completed Tournaments</h3>
                      <p className="text-gray-500">Your completed tournaments will appear here.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="cancelled" className="mt-6">
                <div className="space-y-4">
                  {cancelledTournaments.length > 0 ? (
                    cancelledTournaments.map((tournament) => (
                      <TournamentCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Cancelled Tournaments</h3>
                      <p className="text-gray-500">You don't have any cancelled tournaments.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export to PDF
          </Button>
        </div>
      </main>
    </div>
  );
}
