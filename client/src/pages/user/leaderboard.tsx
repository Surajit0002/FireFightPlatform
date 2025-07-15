import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  Medal,
  Star,
  Crown,
  TrendingUp,
  Users,
  Gamepad2,
  Award,
  Target,
  Zap,
} from "lucide-react";

export default function Leaderboard() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("all_time");
  const [leaderboardType, setLeaderboardType] = useState<"players" | "teams">("players");

  const { data: playersLeaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard/players", selectedGame],
  });

  const { data: teamsLeaderboard = [] } = useQuery({
    queryKey: ["/api/leaderboard/teams", selectedGame],
  });

  const gameOptions = [
    { value: "all", label: "All Games", icon: "🎮" },
    { value: "free_fire", label: "Free Fire", icon: "🔥" },
    { value: "bgmi", label: "BGMI", icon: "🎯" },
    { value: "valorant", label: "Valorant", icon: "⚡" },
    { value: "csgo", label: "CS:GO", icon: "💥" },
    { value: "pubg", label: "PUBG", icon: "🏆" },
  ];

  const timeRangeOptions = [
    { value: "all_time", label: "All Time" },
    { value: "monthly", label: "This Month" },
    { value: "weekly", label: "This Week" },
    { value: "daily", label: "Today" },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return (
          <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
            {rank}
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return "bg-yellow-500";
    if (rank <= 10) return "bg-fire-orange";
    if (rank <= 50) return "bg-fire-blue";
    return "bg-gray-500";
  };

  const currentUserRank = playersLeaderboard.findIndex(
    (player: any) => player.id === user?.id
  ) + 1;

  const PlayerLeaderboardCard = ({ player, rank }: { player: any; rank: number }) => {
    const isCurrentUser = player.id === user?.id;

    return (
      <Card className={`card-hover ${isCurrentUser ? 'ring-2 ring-fire-blue' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center">
              {getRankIcon(rank)}
            </div>

            <Avatar className="w-12 h-12">
              <AvatarImage src={player.profileImageUrl} />
              <AvatarFallback>{player.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold fire-gray">{player.username}</h3>
                {isCurrentUser && (
                  <Badge className="bg-fire-blue text-white text-xs">You</Badge>
                )}
                {rank <= 3 && (
                  <Badge className={`${getRankBadgeColor(rank)} text-white text-xs`}>
                    Top {rank}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Level {player.level} • {player.matchesPlayed} matches played
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold fire-green text-lg">₹{player.totalEarnings}</div>
              <div className="text-sm text-gray-500">{player.winRate}% Win Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeamLeaderboardCard = ({ team, rank }: { team: any; rank: number }) => (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center">
            {getRankIcon(rank)}
          </div>

          <div className="w-12 h-12 bg-gradient-to-r from-fire-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            {team.name?.substring(0, 2).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold fire-gray">{team.name}</h3>
              {rank <= 3 && (
                <Badge className={`${getRankBadgeColor(rank)} text-white text-xs`}>
                  Top {rank}
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {team.totalMembers} members • {team.matchesPlayed} matches played
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold fire-green text-lg">₹{team.totalEarnings}</div>
            <div className="text-sm text-gray-500">{team.winRate}% Win Rate</div>
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
          <h1 className="text-3xl font-bold fire-gray mb-2">Leaderboard</h1>
          <p className="text-gray-600">
            See how you rank against other players and teams in the FireFight community
          </p>
        </div>

        {/* Your Rank Card */}
        {currentUserRank > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-fire-blue to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Current Rank</h3>
                    <p className="opacity-90">Keep climbing to reach the top!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">#{currentUserRank}</div>
                  <div className="opacity-90">Global Ranking</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex space-x-4">
                <Button
                  onClick={() => setLeaderboardType("players")}
                  className={leaderboardType === "players" ? "bg-fire-red text-white" : ""}
                  variant={leaderboardType === "players" ? "default" : "outline"}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Players
                </Button>
                <Button
                  onClick={() => setLeaderboardType("teams")}
                  className={leaderboardType === "teams" ? "bg-fire-red text-white" : ""}
                  variant={leaderboardType === "teams" ? "default" : "outline"}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Teams
                </Button>
              </div>

              <div className="flex space-x-4">
                <Select value={selectedGame} onValueChange={setSelectedGame}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Game" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameOptions.map((game) => (
                      <SelectItem key={game.value} value={game.value}>
                        <span className="flex items-center space-x-2">
                          <span>{game.icon}</span>
                          <span>{game.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 fire-orange" />
                  <span>
                    {leaderboardType === "players" ? "Top Players" : "Top Teams"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardType === "players" ? (
                    playersLeaderboard.length > 0 ? (
                      playersLeaderboard.map((player: any, index: number) => (
                        <PlayerLeaderboardCard
                          key={player.id}
                          player={player}
                          rank={index + 1}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Players Found</h3>
                        <p className="text-gray-500">No player data available for the selected filters.</p>
                      </div>
                    )
                  ) : (
                    teamsLeaderboard.length > 0 ? (
                      teamsLeaderboard.map((team: any, index: number) => (
                        <TeamLeaderboardCard
                          key={team.id}
                          team={team}
                          rank={index + 1}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Teams Found</h3>
                        <p className="text-gray-500">No team data available for the selected filters.</p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hall of Fame */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fire-orange" />
                  <span>Hall of Fame</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-semibold text-sm">Most Tournaments Won</div>
                      <div className="text-xs text-gray-500">ProGamer_X - 45 wins</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-fire-green" />
                    <div>
                      <div className="font-semibold text-sm">Highest Earnings</div>
                      <div className="text-xs text-gray-500">EliteSquad - ₹1,25,000</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                    <Zap className="w-5 h-5 text-fire-red" />
                    <div>
                      <div className="font-semibold text-sm">Longest Win Streak</div>
                      <div className="text-xs text-gray-500">ChampionGG - 12 wins</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Global Rank:</span>
                    <span className="font-semibold">#{currentUserRank || "Unranked"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Earnings:</span>
                    <span className="font-semibold fire-green">₹{user?.totalEarnings || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Win Rate:</span>
                    <span className="font-semibold">{user?.winRate || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Matches Played:</span>
                    <span className="font-semibold">{user?.matchesPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className="font-semibold">{user?.level || 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rank Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 fire-blue" />
                  <span>Rank Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Top 10:</span>
                    <Badge className="bg-fire-orange text-white">₹500 Bonus</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Top 50:</span>
                    <Badge className="bg-fire-blue text-white">₹200 Bonus</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Top 100:</span>
                    <Badge className="bg-fire-green text-white">₹100 Bonus</Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
                    Rewards are distributed monthly based on your final ranking.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                    <span>First Tournament Win</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fire-blue rounded-full"></div>
                    <span>Reached Level 5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fire-orange rounded-full"></div>
                    <span>10 Match Win Streak</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}