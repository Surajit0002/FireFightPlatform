import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star,
  TrendingUp,
  Users,
  Gamepad2,
  Calendar,
  Share2
} from "lucide-react";
import type { User, Team } from "@/types";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("players");
  const [gameFilter, setGameFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: topPlayers = [], isLoading: playersLoading } = useQuery<User[]>({
    queryKey: ["/api/leaderboard/players", gameFilter, timeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (gameFilter !== "all") params.append("gameType", gameFilter);
      if (timeFilter !== "all") params.append("timeRange", timeFilter);
      
      const res = await fetch(`/api/leaderboard/players?${params.toString()}`);
      return res.json();
    },
  });

  const { data: topTeams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/leaderboard/teams", gameFilter, timeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (gameFilter !== "all") params.append("gameType", gameFilter);
      if (timeFilter !== "all") params.append("timeRange", timeFilter);
      
      const res = await fetch(`/api/leaderboard/teams?${params.toString()}`);
      return res.json();
    },
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-400 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const gameTypes = [
    { value: "all", label: "All Games" },
    { value: "free_fire", label: "Free Fire" },
    { value: "bgmi", label: "BGMI" },
    { value: "valorant", label: "Valorant" },
    { value: "other", label: "Other" },
  ];

  const timeRanges = [
    { value: "all", label: "All Time" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const isLoading = playersLoading || teamsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-300 rounded-lg"></div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fire-gray mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top performers and rising stars in the FireFight community</p>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Current Champion</p>
                  <p className="text-xl font-bold">{topPlayers[0]?.username || "No Data"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-fire-blue to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Rising Star</p>
                  <p className="text-xl font-bold">{topPlayers[1]?.username || "No Data"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-fire-green to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Top Team</p>
                  <p className="text-xl font-bold">{topTeams[0]?.name || "No Data"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <CardTitle>Rankings</CardTitle>
                    <div className="flex space-x-2">
                      <Select value={gameFilter} onValueChange={setGameFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gameTypes.map((game) => (
                            <SelectItem key={game.value} value={game.value}>
                              {game.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="players">Players</TabsTrigger>
                      <TabsTrigger value="teams">Teams</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="players" className="m-0">
                    <div className="divide-y divide-gray-200">
                      {topPlayers.length === 0 ? (
                        <div className="p-12 text-center">
                          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No players found</h3>
                          <p className="text-gray-500">Rankings will appear as players compete in tournaments</p>
                        </div>
                      ) : (
                        topPlayers.map((player, index) => (
                          <div key={player.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                              {/* Rank */}
                              <div className="flex-shrink-0">
                                <Badge className={`${getRankBadge(index + 1)} w-8 h-8 rounded-full flex items-center justify-center p-0`}>
                                  {index + 1}
                                </Badge>
                              </div>

                              {/* Rank Icon */}
                              <div className="flex-shrink-0">
                                {getRankIcon(index + 1)}
                              </div>

                              {/* Player Info */}
                              <div className="flex items-center space-x-4 flex-1">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={player.profileImageUrl} />
                                  <AvatarFallback className="bg-fire-blue text-white">
                                    {player.username?.[0]?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <h3 className="font-semibold text-fire-gray">{player.username}</h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>Level {player.level}</span>
                                    <span>•</span>
                                    <span>{player.xp} XP</span>
                                  </div>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="hidden md:flex space-x-8 text-sm">
                                <div className="text-center">
                                  <div className="font-semibold text-fire-green">₹{parseFloat(player.walletBalance).toLocaleString()}</div>
                                  <div className="text-gray-500">Earnings</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-fire-blue">-</div>
                                  <div className="text-gray-500">Win Rate</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-fire-teal">-</div>
                                  <div className="text-gray-500">Matches</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View Profile
                                </Button>
                                <Button variant="outline" size="sm">
                                  Challenge
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="teams" className="m-0">
                    <div className="divide-y divide-gray-200">
                      {topTeams.length === 0 ? (
                        <div className="p-12 text-center">
                          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No teams found</h3>
                          <p className="text-gray-500">Team rankings will appear as teams compete in tournaments</p>
                        </div>
                      ) : (
                        topTeams.map((team, index) => (
                          <div key={team.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-4">
                              {/* Rank */}
                              <div className="flex-shrink-0">
                                <Badge className={`${getRankBadge(index + 1)} w-8 h-8 rounded-full flex items-center justify-center p-0`}>
                                  {index + 1}
                                </Badge>
                              </div>

                              {/* Rank Icon */}
                              <div className="flex-shrink-0">
                                {getRankIcon(index + 1)}
                              </div>

                              {/* Team Info */}
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="w-12 h-12 bg-fire-red rounded-lg flex items-center justify-center">
                                  {team.logoUrl ? (
                                    <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-lg object-cover" />
                                  ) : (
                                    <span className="text-white font-bold">
                                      {team.name.substring(0, 2).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <h3 className="font-semibold text-fire-gray">{team.name}</h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>Code: {team.code}</span>
                                    <span>•</span>
                                    <span>Active since {new Date(team.createdAt).getFullYear()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="hidden md:flex space-x-8 text-sm">
                                <div className="text-center">
                                  <div className="font-semibold text-fire-green">-</div>
                                  <div className="text-gray-500">Earnings</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-fire-blue">-</div>
                                  <div className="text-gray-500">Win Rate</div>
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-fire-teal">-</div>
                                  <div className="text-gray-500">Members</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View Team
                                </Button>
                                <Button variant="outline" size="sm">
                                  Challenge
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Rank */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-fire-blue" />
                  <span>My Rank</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-fire-blue mb-2">#-</div>
                  <p className="text-gray-500 mb-4">Your current ranking</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>XP Progress</span>
                      <span>-/-</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-fire-blue h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Players</span>
                  <span className="font-semibold">{topPlayers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Teams</span>
                  <span className="font-semibold">{topTeams.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Supported</span>
                  <span className="font-semibold">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prize Pool Distributed</span>
                  <span className="font-semibold text-fire-green">₹10L+</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Games */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Games</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Free Fire", players: "2.5K", trend: "up" },
                  { name: "BGMI", players: "1.8K", trend: "up" },
                  { name: "Valorant", players: "1.2K", trend: "down" },
                  { name: "Other", players: "0.8K", trend: "up" },
                ].map((game, index) => (
                  <div key={game.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-fire-blue rounded-lg flex items-center justify-center">
                        <Gamepad2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{game.name}</div>
                        <div className="text-sm text-gray-500">{game.players} players</div>
                      </div>
                    </div>
                    <TrendingUp className={`w-4 h-4 ${game.trend === "up" ? "text-fire-green" : "text-fire-red"}`} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reward Claims */}
            <Card className="bg-fire-green bg-opacity-10 border-fire-green">
              <CardHeader>
                <CardTitle className="text-fire-green">🏆 Claim Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Reach top 10 this week to claim special rewards!
                </p>
                <Button className="w-full bg-fire-green text-white" disabled>
                  Rank Higher to Claim
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
