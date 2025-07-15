import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Clock,
  Upload,
  MessageCircle,
  Eye,
  Copy,
  ExternalLink,
  Trophy,
  Users,
  Play,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import type { Tournament, TournamentParticipant } from "@shared/schema";

export default function MatchCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  // Get user's participated tournaments
  const { data: userParticipations = [] } = useQuery({
    queryKey: ["/api/user/participations"],
    enabled: false, // This would need to be implemented in the backend
  });

  // For now, we'll filter tournaments client-side
  // In a real app, this would be done via API with user-specific endpoints
  const userTournaments = tournaments.filter(tournament => {
    // This is a placeholder - in reality, you'd have a user-specific endpoint
    return tournament.currentSlots > 0; // Simplified filter
  });

  const liveMatches = userTournaments.filter(t => t.status === 'live');
  const upcomingMatches = userTournaments.filter(t => t.status === 'upcoming');
  const completedMatches = userTournaments.filter(t => t.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-fire-red';
      case 'upcoming': return 'bg-fire-blue';
      case 'completed': return 'bg-fire-green';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatTimeLeft = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const copyRoomInfo = (roomId: string, password?: string) => {
    const info = `Room ID: ${roomId}${password ? `\nPassword: ${password}` : ''}`;
    navigator.clipboard.writeText(info);
  };

  const MatchCard = ({ tournament }: { tournament: Tournament }) => {
    const gameIcons: Record<string, string> = {
      free_fire: "🔥",
      bgmi: "🎯", 
      valorant: "⚡",
      csgo: "💥",
      pubg: "🎮",
    };

    const isLive = tournament.status === 'live';
    const isUpcoming = tournament.status === 'upcoming';
    const isCompleted = tournament.status === 'completed';

    return (
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{gameIcons[tournament.game] || "🎮"}</div>
              <div>
                <CardTitle className="text-lg">{tournament.title}</CardTitle>
                <p className="text-sm text-gray-500 capitalize">
                  {tournament.format} • {tournament.game.replace('_', ' ')}
                </p>
              </div>
            </div>
            <Badge className={`${getStatusColor(tournament.status)} text-white`}>
              {getStatusIcon(tournament.status)}
              <span className="ml-1">{tournament.status.toUpperCase()}</span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Match Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Prize Pool:</span>
              <div className="font-semibold fire-green">₹{tournament.prizePool}</div>
            </div>
            <div>
              <span className="text-gray-500">Participants:</span>
              <div className="font-semibold">{tournament.currentSlots}/{tournament.maxSlots}</div>
            </div>
          </div>

          {/* Time Info */}
          {isUpcoming && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Starts in {formatTimeLeft(tournament.startTime)}</span>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {new Date(tournament.startTime).toLocaleString()}
              </div>
            </div>
          )}

          {/* Room Info for Live/Joined matches */}
          {isLive && tournament.roomId && (
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700">Room Information</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyRoomInfo(tournament.roomId!, tournament.roomPassword)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs space-y-1">
                <div><strong>ID:</strong> {tournament.roomId}</div>
                {tournament.roomPassword && (
                  <div><strong>Password:</strong> {tournament.roomPassword}</div>
                )}
              </div>
            </div>
          )}

          {/* Match Actions */}
          <div className="flex space-x-2">
            <Link href={`/tournaments/${tournament.id}`}>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>

            {isLive && (
              <>
                <Button size="sm" className="bg-fire-green hover:bg-green-600 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Result
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </>
            )}

            {isUpcoming && (
              <Button size="sm" className="bg-fire-blue hover:bg-blue-600 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            )}

            {isCompleted && (
              <Button size="sm" variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                View Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const QuickAccessPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-fire-red hover:bg-red-600 text-white">
          <Play className="w-4 h-4 mr-2" />
          Join Quick Match
        </Button>
        
        <div className="space-y-2">
          <h4 className="font-medium">Room ID Quick Join</h4>
          <div className="flex space-x-2">
            <Input placeholder="Enter Room ID" className="flex-1" />
            <Button size="sm">Join</Button>
          </div>
        </div>

        <div className="pt-3 border-t">
          <h4 className="font-medium mb-2">Match Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Matches Played:</span>
              <span className="font-semibold">{user?.matchesPlayed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Win Rate:</span>
              <span className="font-semibold fire-green">{user?.winRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Earnings:</span>
              <span className="font-semibold fire-green">₹{user?.totalEarnings || "0.00"}</span>
            </div>
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
          <h1 className="text-3xl font-bold fire-gray mb-2">Match Center</h1>
          <p className="text-gray-600">
            Manage your active matches, upload results, and track your performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-2">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{liveMatches.length}</div>
              <div className="text-sm text-gray-500">Live Matches</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{upcomingMatches.length}</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{completedMatches.length}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-teal rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{user?.winRate || 0}%</div>
              <div className="text-sm text-gray-500">Win Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Matches</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {userTournaments.length > 0 ? (
                    userTournaments.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Matches Found</h3>
                        <p className="text-gray-500 mb-4">
                          You haven't joined any tournaments yet. Start competing to see your matches here!
                        </p>
                        <Link href="/tournaments">
                          <Button className="bg-fire-red hover:bg-red-600 text-white">
                            Browse Tournaments
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="live" className="mt-6">
                <div className="space-y-4">
                  {liveMatches.length > 0 ? (
                    liveMatches.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Live Matches</h3>
                        <p className="text-gray-500">You don't have any live matches at the moment.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                <div className="space-y-4">
                  {upcomingMatches.length > 0 ? (
                    upcomingMatches.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Matches</h3>
                        <p className="text-gray-500">You don't have any upcoming matches scheduled.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="space-y-4">
                  {completedMatches.length > 0 ? (
                    completedMatches.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Completed Matches</h3>
                        <p className="text-gray-500">Your completed matches will appear here.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickAccessPanel />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                    <span>Won ₹500 in Free Fire Championship</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fire-blue rounded-full"></div>
                    <span>Joined BGMI Pro League</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fire-orange rounded-full"></div>
                    <span>Team created: Elite Squad</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/support">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    How to Upload Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
