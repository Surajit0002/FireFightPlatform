import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import TournamentCard from "@/components/tournament-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Zap, DollarSign, Users, BarChart3, Trophy, Crown } from "lucide-react";
import { Link } from "wouter";
import type { Tournament, User, Team } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
    queryFn: async () => {
      const res = await fetch("/api/tournaments?limit=6");
      return res.json();
    },
  });

  const { data: topPlayers = [] } = useQuery<User[]>({
    queryKey: ["/api/leaderboard/players"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard/players?limit=3");
      return res.json();
    },
  });

  const { data: topTeams = [] } = useQuery<Team[]>({
    queryKey: ["/api/leaderboard/teams"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard/teams?limit=3");
      return res.json();
    },
  });

  const quickActions = [
    {
      title: "Quick Match",
      description: "Join instant match",
      icon: Zap,
      bgColor: "bg-fire-red",
      href: "/tournaments",
    },
    {
      title: "Withdraw",
      description: "Cash out winnings",
      icon: DollarSign,
      bgColor: "bg-fire-green",
      href: "/wallet",
    },
    {
      title: "My Teams",
      description: "Manage squads",
      icon: Users,
      bgColor: "bg-fire-blue",
      href: "/teams",
    },
    {
      title: "Stats",
      description: "View performance",
      icon: BarChart3,
      bgColor: "bg-fire-teal",
      href: "/profile",
    },
  ];

  const dailyTasks = [
    {
      title: "Join 2 Tournaments",
      progress: 50,
      current: 1,
      total: 2,
      reward: "₹50 + 100 XP",
      bgColor: "from-fire-red to-red-600",
    },
    {
      title: "Win 1 Match",
      progress: 0,
      current: 0,
      total: 1,
      reward: "₹100 + 200 XP",
      bgColor: "from-fire-blue to-blue-600",
    },
    {
      title: "Refer a Friend",
      progress: 100,
      current: 1,
      total: 1,
      reward: "₹200 + 500 XP",
      bgColor: "from-fire-green to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="hero-bg rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Win Big in Esports Tournaments
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Join tournaments, compete with the best, and earn real cash
              rewards
            </p>
            <div className="flex space-x-4">
              <Button
                asChild
                className="bg-blue-600 text-fire-red hover:bg-black hover:text-white"
              >
                <Link href="/tournaments">Join Tournament</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-fire-red"
              >
                <Link href="/leaderboard">View Rankings</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div
                    className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-fire-gray mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Live & Upcoming Tournaments */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-fire-gray">
              Live & Upcoming Tournaments
            </h2>
            <div className="flex space-x-2">
              <Button className="bg-fire-red text-white">All Games</Button>
              <Button variant="outline">Free Fire</Button>
              <Button variant="outline">BGMI</Button>
              <Button variant="outline">Valorant</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>

          {tournaments.length === 0 && (
            <Card className="p-8 text-center">
              <CardContent>
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No tournaments available
                </h3>
                <p className="text-gray-500">
                  Check back later for new tournaments
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Featured Players & Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top Players */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span>Top Players</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPlayers.map((player, index) => (
                  <div key={player.id} className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : "bg-orange-400"} rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={player.profileImageUrl} />
                      <AvatarFallback>
                        {player.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-fire-gray">
                        {player.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{parseFloat(player.walletBalance).toLocaleString()}{" "}
                        earned
                      </div>
                    </div>
                    <div className="text-fire-green font-semibold">
                      Level {player.level}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-fire-blue" />
                <span>Top Teams</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTeams.map((team, index) => (
                  <div key={team.id} className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 ${index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : "bg-orange-400"} rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {team.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-fire-gray">
                        {team.name}
                      </div>
                      <div className="text-sm text-gray-500">Active team</div>
                    </div>
                    <Badge variant="outline" className="text-fire-green">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Tasks & Rewards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daily Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dailyTasks.map((task, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 bg-gradient-to-r ${task.bgColor} text-white`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{task.title}</span>
                    <span className="text-sm">
                      {task.current}/{task.total}
                    </span>
                  </div>
                  <Progress
                    value={task.progress}
                    className="mb-2 bg-white bg-opacity-30"
                  />
                  <div className="text-sm opacity-90">
                    Reward: {task.reward}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
