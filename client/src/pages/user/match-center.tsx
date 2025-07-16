
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  Gamepad2,
  Zap,
  Timer,
  Target,
  Award,
  TrendingUp,
  Fire,
  Crown,
  Swords,
  Shield,
  Bell,
  Star,
  Sparkles,
  Users2,
  Activity,
  BarChart3,
  Coins,
  Medal,
  Download,
  Settings,
  ChevronRight,
  RefreshCw,
  Volume2,
  VolumeX,
  Maximize2,
  Filter,
  Search,
  SortDesc,
  Grid3X3,
  List,
  Heart,
  Share2,
} from "lucide-react";
import type { Tournament, TournamentParticipant } from "@shared/schema";

export default function MatchCenter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startTime");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifications, setNotifications] = useState<string[]>([]);

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // This would be connected to WebSocket in a real application
      const liveCount = tournaments.filter(t => t.status === 'live').length;
      if (liveCount > 0 && soundEnabled) {
        // Play notification sound (in real app)
        console.log("🔔 Live matches updated");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [tournaments, soundEnabled]);

  // Filter tournaments
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || tournament.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort tournaments
  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    switch (sortBy) {
      case "startTime":
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      case "prizePool":
        return parseFloat(b.prizePool) - parseFloat(a.prizePool);
      case "participants":
        return b.currentSlots - a.currentSlots;
      default:
        return 0;
    }
  });

  const liveMatches = sortedTournaments.filter(t => t.status === 'live');
  const upcomingMatches = sortedTournaments.filter(t => t.status === 'upcoming');
  const completedMatches = sortedTournaments.filter(t => t.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'from-red-500 to-pink-500';
      case 'upcoming': return 'from-blue-500 to-cyan-500';
      case 'completed': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
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
    toast({
      title: "📋 Copied!",
      description: "Room information copied to clipboard",
    });
  };

  const MatchCard = ({ tournament, isCompact = false }: { tournament: Tournament; isCompact?: boolean }) => {
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
    const prizePool = parseFloat(tournament.prizePool);
    const entryFee = parseFloat(tournament.entryFee);

    if (isCompact) {
      return (
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{gameIcons[tournament.game] || "🎮"}</div>
                <div>
                  <h3 className="font-semibold text-sm">{tournament.title}</h3>
                  <p className="text-xs text-gray-500 capitalize">{tournament.format}</p>
                </div>
              </div>
              <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status)} text-white text-xs`}>
                {getStatusIcon(tournament.status)}
                <span className="ml-1">{tournament.status.toUpperCase()}</span>
              </Badge>
            </div>
            
            <div className="flex justify-between text-xs text-gray-600 mb-3">
              <span>₹{prizePool.toLocaleString()}</span>
              <span>{tournament.currentSlots}/{tournament.maxSlots}</span>
            </div>

            <div className="flex space-x-2">
              <Link href={`/tournaments/${tournament.id}`}>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              </Link>
              {isLive && (
                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white flex-1 text-xs">
                  <Play className="w-3 h-3 mr-1" />
                  Join
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-blue-50 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                  {gameIcons[tournament.game] || "🎮"}
                </div>
                {isLive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {tournament.title}
                </CardTitle>
                <p className="text-sm text-gray-500 capitalize flex items-center mt-1">
                  <Users2 className="w-4 h-4 mr-1" />
                  {tournament.format} • {tournament.game.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status)} text-white shadow-lg`}>
                {getStatusIcon(tournament.status)}
                <span className="ml-2 font-medium">{tournament.status.toUpperCase()}</span>
              </Badge>
              {tournament.isFeatured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  FEATURED
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Prize and Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-3 rounded-xl text-center">
              <Trophy className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="font-bold text-green-700">₹{prizePool.toLocaleString()}</div>
              <div className="text-xs text-green-600">Prize Pool</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-3 rounded-xl text-center">
              <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="font-bold text-blue-700">{tournament.currentSlots}/{tournament.maxSlots}</div>
              <div className="text-xs text-blue-600">Players</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-3 rounded-xl text-center">
              <Coins className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="font-bold text-purple-700">
                {entryFee === 0 ? "FREE" : `₹${entryFee.toLocaleString()}`}
              </div>
              <div className="text-xs text-purple-600">Entry Fee</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-100 p-3 rounded-xl text-center">
              <Timer className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="font-bold text-orange-700">
                {isUpcoming ? formatTimeLeft(tournament.startTime) : 
                 isLive ? "LIVE" : "Ended"}
              </div>
              <div className="text-xs text-orange-600">Status</div>
            </div>
          </div>

          {/* Time Info */}
          {isUpcoming && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 text-blue-700">
                <Clock className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Starts in {formatTimeLeft(tournament.startTime)}</div>
                  <div className="text-sm text-blue-600">
                    {new Date(tournament.startTime).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Match Info */}
          {isLive && tournament.roomId && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-red-700">LIVE MATCH</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyRoomInfo(tournament.roomId!, tournament.roomPassword)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room ID:</span>
                  <span className="font-mono font-semibold">{tournament.roomId}</span>
                </div>
                {tournament.roomPassword && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Password:</span>
                    <span className="font-mono font-semibold">{tournament.roomPassword}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Match Actions */}
          <div className="flex flex-wrap gap-3">
            <Link href={`/tournaments/${tournament.id}`} className="flex-1 min-w-0">
              <Button variant="outline" className="w-full group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>

            {isLive && (
              <>
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Result
                </Button>
                <Button variant="outline" className="px-4">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </>
            )}

            {isUpcoming && (
              <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Bell className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
            )}

            {isCompleted && (
              <Button variant="outline" className="flex-1 border-green-200 text-green-600 hover:bg-green-50">
                <Trophy className="w-4 h-4 mr-2" />
                View Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const QuickStatsCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Match Center
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your active matches, upload results, and track your performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
              </Button>
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                variant="outline"
                size="sm"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <QuickStatsCard
            title="Live Matches"
            value={liveMatches.length}
            icon={Play}
            color="from-red-500 to-pink-500"
            subtitle={liveMatches.length > 0 ? "Active now" : "No live matches"}
          />
          <QuickStatsCard
            title="Upcoming"
            value={upcomingMatches.length}
            icon={Clock}
            color="from-blue-500 to-cyan-500"
            subtitle="Scheduled matches"
          />
          <QuickStatsCard
            title="Completed"
            value={completedMatches.length}
            icon={CheckCircle}
            color="from-green-500 to-emerald-500"
            subtitle="This week"
          />
          <QuickStatsCard
            title="Win Rate"
            value={`${user?.winRate || 0}%`}
            icon={Trophy}
            color="from-yellow-500 to-orange-500"
            subtitle="Overall performance"
          />
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">All Status</option>
                  <option value="live">Live</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="startTime">Sort by Time</option>
                  <option value="prizePool">Sort by Prize</option>
                  <option value="participants">Sort by Players</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl border-0 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg">
                  All Matches ({sortedTournaments.length})
                </TabsTrigger>
                <TabsTrigger value="live" className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg">
                  Live ({liveMatches.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg">
                  Upcoming ({upcomingMatches.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg">
                  Completed ({completedMatches.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-8">
                {sortedTournaments.length > 0 ? (
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                    {sortedTournaments.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} isCompact={viewMode === 'list'} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-16 text-center">
                      <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Matches Found</h3>
                      <p className="text-gray-500 mb-8 text-lg">
                        You haven't joined any tournaments yet. Start competing to see your matches here!
                      </p>
                      <Link href="/tournaments">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          <Trophy className="w-5 h-5 mr-2" />
                          Browse Tournaments
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="live" className="mt-8">
                {liveMatches.length > 0 ? (
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                    {liveMatches.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} isCompact={viewMode === 'list'} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 border-dashed border-red-200 bg-red-50">
                    <CardContent className="p-16 text-center">
                      <Play className="w-20 h-20 text-red-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-red-600 mb-4">No Live Matches</h3>
                      <p className="text-red-500 mb-8">You don't have any live matches at the moment.</p>
                      <Link href="/tournaments">
                        <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                          <Zap className="w-5 h-5 mr-2" />
                          Join Live Tournament
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="mt-8">
                {upcomingMatches.length > 0 ? (
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                    {upcomingMatches.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} isCompact={viewMode === 'list'} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
                    <CardContent className="p-16 text-center">
                      <Clock className="w-20 h-20 text-blue-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-blue-600 mb-4">No Upcoming Matches</h3>
                      <p className="text-blue-500">You don't have any upcoming matches scheduled.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-8">
                {completedMatches.length > 0 ? (
                  <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                    {completedMatches.map((tournament) => (
                      <MatchCard key={tournament.id} tournament={tournament} isCompact={viewMode === 'list'} />
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 border-dashed border-green-200 bg-green-50">
                    <CardContent className="p-16 text-center">
                      <CheckCircle className="w-20 h-20 text-green-300 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-green-600 mb-4">No Completed Matches</h3>
                      <p className="text-green-500">Your completed matches will appear here.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tournaments">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Join Quick Match
                  </Button>
                </Link>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Room ID Quick Join</h4>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter Room ID" className="flex-1" />
                    <Button size="sm" variant="outline">Join</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Matches Played:</span>
                    <span className="font-semibold text-xl">{user?.matchesPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-semibold text-xl text-green-600">{user?.winRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Earnings:</span>
                    <span className="font-semibold text-xl text-green-600">₹{user?.totalEarnings || "0.00"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Rank:</span>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Gold III
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Link href="/profile">
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Full Stats
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Won ₹500 in Fire Storm Championship</p>
                      <p className="text-gray-500 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Joined BGMI Pro League</p>
                      <p className="text-gray-500 text-xs">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Team created: Elite Squad</p>
                      <p className="text-gray-500 text-xs">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/support">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  How to Upload Results
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Game Apps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
