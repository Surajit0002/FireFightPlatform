import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import TournamentCard from "@/components/tournament-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/lib/websocket";
import { 
  Zap, 
  DollarSign, 
  Users, 
  BarChart3, 
  Trophy,
  Star,
  Target,
  Gift
} from "lucide-react";
import type { Tournament, Announcement } from "@shared/schema";

export default function UserHome() {
  const { user } = useAuth();
  
  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const { data: playersLeaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard/players"],
  });

  const { data: teamsLeaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard/teams"],
  });

  // WebSocket for real-time updates
  useWebSocket((data) => {
    if (data.type === 'tournament_update') {
      // Handle real-time tournament updates
      console.log('Tournament update:', data);
    }
  });

  const liveTournaments = tournaments.filter(t => t.status === 'live');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').slice(0, 6);
  const recentAnnouncements = announcements.slice(0, 3);

  const quickActions = [
    {
      title: "Quick Match",
      description: "Join instant match",
      icon: Zap,
      color: "bg-fire-red",
      href: "/tournaments?quick=true"
    },
    {
      title: "Withdraw",
      description: "Cash out winnings",
      icon: DollarSign,
      color: "bg-fire-green",
      href: "/wallet"
    },
    {
      title: "My Teams",
      description: "Manage squads",
      icon: Users,
      color: "bg-fire-blue",
      href: "/teams"
    },
    {
      title: "Stats",
      description: "View performance",
      icon: BarChart3,
      color: "bg-fire-teal",
      href: "/profile"
    }
  ];

  const dailyChallenges = [
    {
      title: "Join 2 Tournaments",
      progress: 1,
      max: 2,
      reward: "₹50 + 100 XP",
      color: "from-fire-red to-red-600",
      completed: false
    },
    {
      title: "Win 1 Match",
      progress: 0,
      max: 1,
      reward: "₹100 + 200 XP",
      color: "from-fire-blue to-blue-600",
      completed: false
    },
    {
      title: "Refer a Friend",
      progress: 1,
      max: 1,
      reward: "₹200 + 500 XP",
      color: "from-fire-green to-green-600",
      completed: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="hero-gradient rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Win Big in Esports Tournaments
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Join tournaments, compete with the best, and earn real cash rewards
            </p>
            <div className="flex space-x-4">
              <Link href="/tournaments">
                <Button className="bg-white text-fire-red hover:bg-gray-100 px-6 py-3 font-semibold">
                  Join Tournament
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-fire-red px-6 py-3 font-semibold"
                >
                  View Rankings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold fire-gray mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Live Tournaments Alert */}
        {liveTournaments.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-fire-red rounded-full tournament-live"></div>
              <h3 className="font-semibold fire-red">🔥 Live Tournaments</h3>
            </div>
            <p className="text-sm text-red-700 mb-3">
              {liveTournaments.length} tournament{liveTournaments.length > 1 ? 's' : ''} currently live! Join now to compete.
            </p>
            <div className="flex space-x-2">
              {liveTournaments.slice(0, 2).map((tournament) => (
                <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
                  <Badge className="bg-fire-red hover:bg-red-600 text-white cursor-pointer">
                    {tournament.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Live & Upcoming Tournaments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold fire-gray">Live & Upcoming Tournaments</h2>
            <div className="flex space-x-2">
              <Button className="bg-fire-red text-white">All Games</Button>
              <Button variant="outline">Free Fire</Button>
              <Button variant="outline">BGMI</Button>
              <Button variant="outline">Valorant</Button>
            </div>
          </div>

          {upcomingTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Tournaments Available</h3>
                <p className="text-gray-500">Check back later for new tournaments!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Featured Players & Teams */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold fire-gray mb-6">Top Performers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Players */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg fire-gray mb-4">Top Players</h3>
                <div className="space-y-4">
                  {playersLeaderboard.slice(0, 3).map((player: any, index: number) => (
                    <div key={player.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      } rounded-full flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={player.profileImageUrl} />
                        <AvatarFallback>{player.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold fire-gray">{player.username}</div>
                        <div className="text-sm text-gray-500">₹{player.totalEarnings} earned</div>
                      </div>
                      <div className="fire-green font-semibold">{player.winRate}% WR</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Teams */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg fire-gray mb-4">Top Teams</h3>
                <div className="space-y-4">
                  {teamsLeaderboard.slice(0, 3).map((team: any, index: number) => (
                    <div key={team.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      } rounded-full flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 ${
                        index === 0 ? 'bg-fire-red' : index === 1 ? 'bg-fire-blue' : 'bg-fire-green'
                      } rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold">
                          {team.name?.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold fire-gray">{team.name}</div>
                        <div className="text-sm text-gray-500">
                          {team.totalMembers} members • ₹{team.totalEarnings} earned
                        </div>
                      </div>
                      <div className="fire-green font-semibold">{team.winRate}% WR</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Challenges */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-6 h-6 fire-teal" />
              <h2 className="text-xl font-bold fire-gray">Daily Challenges</h2>
              <Gift className="w-5 h-5 fire-orange" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyChallenges.map((challenge, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 bg-gradient-to-r ${challenge.color} text-white`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{challenge.title}</span>
                    <span className="text-sm">
                      {challenge.completed ? '✓' : `${challenge.progress}/${challenge.max}`}
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${(challenge.progress / challenge.max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm opacity-90">Reward: {challenge.reward}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        {recentAnnouncements.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold fire-gray">📢 Latest News</h2>
                <Link href="/announcements">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-fire-blue pl-3">
                    <h4 className="font-semibold fire-gray">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
