
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import {
  Trophy,
  Users,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Shield,
  ArrowLeft,
  Copy,
  Eye,
  Upload,
  MessageCircle,
  Star,
  Play,
  TrendingUp,
  Award,
  Target,
  Zap,
  Bell,
  Settings,
  Share2,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Gamepad2,
  Crown,
  Fire,
  Timer,
  Users2,
  Coins,
  Medal,
  Swords,
  Sparkles,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import type { Tournament, TournamentParticipant } from "@shared/schema";

export default function TournamentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data: tournament, isLoading } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
  });

  const { data: participants = [] } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournaments", id, "participants"],
  });

  const { data: userTeams = [] } = useQuery({
    queryKey: ["/api/teams"],
  });

  const joinMutation = useMutation({
    mutationFn: async (data: { teamId?: number }) => {
      await apiRequest("POST", `/api/tournaments/${id}/join`, data);
    },
    onSuccess: () => {
      toast({
        title: "🎉 Successfully Joined!",
        description: "Welcome to the tournament! Get ready to compete.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id, "participants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id] });
    },
    onError: (error) => {
      toast({
        title: "❌ Join Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Live countdown effect
  useEffect(() => {
    if (!tournament) return;
    
    const interval = setInterval(() => {
      const startTime = new Date(tournament.startTime);
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tournament]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <UserHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-40 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <UserHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-16 text-center">
              <AlertTriangle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Tournament Not Found</h3>
              <p className="text-gray-500 mb-8 text-lg">The tournament you're looking for doesn't exist or has been removed.</p>
              <Link href="/tournaments">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Browse All Tournaments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const gameIcons: Record<string, string> = {
    free_fire: "🔥",
    bgmi: "🎯",
    valorant: "⚡",
    csgo: "💥",
    pubg: "🎮",
  };

  const gameGradients: Record<string, string> = {
    free_fire: "from-orange-500 via-red-500 to-pink-500",
    bgmi: "from-blue-500 via-cyan-500 to-teal-500",
    valorant: "from-green-500 via-emerald-500 to-cyan-500",
    csgo: "from-orange-500 via-yellow-500 to-red-500",
    pubg: "from-purple-500 via-blue-500 to-indigo-500",
  };

  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameGradient = gameGradients[tournament.game] || "from-gray-500 to-gray-600";
  const isLive = tournament.status === "live";
  const isCompleted = tournament.status === "completed";
  const isUpcoming = tournament.status === "upcoming";
  const slotsProgress = (tournament.currentSlots / tournament.maxSlots) * 100;
  
  const userParticipation = participants.find(p => p.userId === user?.id);
  const hasJoined = !!userParticipation;
  
  const entryFee = parseFloat(tournament.entryFee);
  const prizePool = parseFloat(tournament.prizePool);
  const isFree = entryFee === 0;

  const handleJoin = () => {
    if (tournament.format !== "solo" && !selectedTeam) {
      toast({
        title: "⚠️ Team Required",
        description: "Please select a team for squad tournaments",
        variant: "destructive",
      });
      return;
    }

    joinMutation.mutate({
      teamId: tournament.format !== "solo" ? parseInt(selectedTeam) : undefined
    });
  };

  const copyRoomInfo = () => {
    if (tournament.roomId) {
      navigator.clipboard.writeText(`Room ID: ${tournament.roomId}\nPassword: ${tournament.roomPassword || 'N/A'}`);
      toast({
        title: "📋 Copied!",
        description: "Room information copied to clipboard",
      });
    }
  };

  const shareTournament = () => {
    if (navigator.share) {
      navigator.share({
        title: tournament.title,
        text: `Join ${tournament.title} tournament with ₹${prizePool} prize pool!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "🔗 Link Copied!",
        description: "Tournament link copied to clipboard",
      });
    }
  };

  const CountdownCard = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/30">
      <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value.toString().padStart(2, '0')}</div>
      <div className="text-white/80 text-sm font-medium">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/tournaments">
            <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/50 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tournaments</span>
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className={`relative bg-gradient-to-r ${gameGradient} rounded-3xl p-8 md:p-12 mb-8 text-white overflow-hidden shadow-2xl`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl border border-white/30">
                    {gameIcon}
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{tournament.title}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${
                        isLive ? "bg-red-500 animate-pulse" : 
                        isCompleted ? "bg-gray-500" : "bg-blue-500"
                      } text-white px-4 py-2 text-sm font-semibold`}>
                        {isLive ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            LIVE NOW
                          </>
                        ) : isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            COMPLETED
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            UPCOMING
                          </>
                        )}
                      </Badge>
                      {tournament.isFeatured && (
                        <Badge className="bg-yellow-500 text-white px-4 py-2">
                          <Star className="w-4 h-4 mr-2" />
                          FEATURED
                        </Badge>
                      )}
                      {isFree && (
                        <Badge className="bg-green-500 text-white px-4 py-2">
                          <Sparkles className="w-4 h-4 mr-2" />
                          FREE ENTRY
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Live Countdown */}
                {isUpcoming && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Timer className="w-5 h-5 mr-2" />
                      Tournament Starts In
                    </h3>
                    <div className="grid grid-cols-4 gap-3 max-w-md">
                      <CountdownCard value={countdown.days} label="Days" />
                      <CountdownCard value={countdown.hours} label="Hours" />
                      <CountdownCard value={countdown.minutes} label="Mins" />
                      <CountdownCard value={countdown.seconds} label="Secs" />
                    </div>
                  </div>
                )}

                {/* Prize Pool Highlight */}
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="w-6 h-6" />
                  <span className="text-2xl font-bold">₹{prizePool.toLocaleString()}</span>
                  <span className="text-white/80">Prize Pool</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current text-red-300' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  onClick={shareTournament}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {hasJoined && (
                  <Link href="/match-center">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Go to Match Center
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-700">₹{prizePool.toLocaleString()}</div>
              <div className="text-sm text-green-600 font-medium">Prize Pool</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{tournament.currentSlots}/{tournament.maxSlots}</div>
              <div className="text-sm text-blue-600 font-medium">Participants</div>
              <Progress value={slotsProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {isFree ? "FREE" : `₹${entryFee.toLocaleString()}`}
              </div>
              <div className="text-sm text-purple-600 font-medium">Entry Fee</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-lg font-bold text-orange-700">
                {new Date(tournament.startTime).toLocaleDateString()}
              </div>
              <div className="text-sm text-orange-600 font-medium">Tournament Date</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tournament Details Tabs */}
            <Card className="border-0 shadow-lg">
              <Tabs defaultValue="overview" className="w-full">
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
                    <TabsTrigger value="rules" className="data-[state=active]:bg-white">Rules</TabsTrigger>
                    <TabsTrigger value="participants" className="data-[state=active]:bg-white">Players</TabsTrigger>
                    <TabsTrigger value="bracket" className="data-[state=active]:bg-white">Bracket</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent>
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                          Tournament Info
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Game:</span>
                            <span className="font-medium capitalize">{tournament.game.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Format:</span>
                            <span className="font-medium capitalize">{tournament.format}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Team Size:</span>
                            <span className="font-medium">{tournament.teamSize} players</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Map:</span>
                            <span className="font-medium">{tournament.mapInfo || "TBD"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-green-500" />
                          Schedule
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Time:</span>
                            <span className="font-medium">{new Date(tournament.startTime).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Created:</span>
                            <span className="font-medium">{new Date(tournament.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge variant={isLive ? "destructive" : isCompleted ? "secondary" : "default"}>
                              {tournament.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prize Distribution */}
                    <div className="mt-8">
                      <h4 className="font-semibold text-lg mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-500" />
                        Prize Distribution
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-4 rounded-xl text-center">
                          <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-yellow-700">₹{Math.floor(prizePool * 0.6).toLocaleString()}</div>
                          <div className="text-sm text-yellow-600">1st Place (60%)</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-4 rounded-xl text-center">
                          <Medal className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-gray-700">₹{Math.floor(prizePool * 0.25).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">2nd Place (25%)</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl text-center">
                          <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <div className="text-lg font-bold text-orange-700">₹{Math.floor(prizePool * 0.15).toLocaleString()}</div>
                          <div className="text-sm text-orange-600">3rd Place (15%)</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rules">
                    <div className="prose max-w-none">
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-red-500" />
                        Tournament Rules
                      </h4>
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {tournament.rules || `
🎯 Tournament Rules & Guidelines

1. Fair Play Policy
   • No cheating, hacking, or exploiting allowed
   • Use of unauthorized software will result in immediate disqualification
   • Respect all players and maintain sportsmanship

2. Match Rules
   • All matches must be played at scheduled times
   • Maximum 10 minutes grace period for late participants
   • Screenshots required for result verification

3. Communication
   • Discord voice chat mandatory for team tournaments
   • English or Hindi communication only
   • No toxic behavior or harassment

4. Technical Requirements
   • Stable internet connection required
   • Latest game version must be installed
   • Recording software recommended for disputes

5. Prize Distribution
   • Winners will be announced within 24 hours
   • Prize money transferred to wallet within 48 hours
   • Valid KYC required for withdrawals

6. Disputes
   • All disputes must be reported within 30 minutes
   • Screenshots/video evidence required
   • Admin decision is final
                          `}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="participants">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center">
                          <Users2 className="w-5 h-5 mr-2 text-blue-500" />
                          Registered Players ({participants.length})
                        </h4>
                        <Badge variant="outline">{Math.round(slotsProgress)}% Full</Badge>
                      </div>
                      
                      {participants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {participants.map((participant, index) => (
                            <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
                                  {(participant.userId || 'P').charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold">Player {index + 1}</div>
                                <div className="text-sm text-gray-500">
                                  Joined {new Date(participant.joinedAt).toLocaleDateString()}
                                </div>
                              </div>
                              {participant.status === "winner" && (
                                <Badge className="bg-yellow-500 text-white">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Winner
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Participants Yet</h3>
                          <p className="text-gray-500">Be the first to join this tournament!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="bracket">
                    <div className="text-center py-12">
                      <Swords className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Tournament Bracket</h3>
                      <p className="text-gray-500 mb-4">Bracket will be available once tournament starts</p>
                      {isLive && (
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Live Bracket
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Tournament Card */}
            {!hasJoined && !isCompleted && tournament.currentSlots < tournament.maxSlots && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Zap className="w-5 h-5 mr-2" />
                    Join Tournament
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tournament.format !== "solo" && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Select Your Team</label>
                      <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Choose a team...</option>
                        {userTeams.map((team: any) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Entry Fee:</span>
                      <span className="font-semibold text-lg">
                        {isFree ? (
                          <span className="text-green-600 flex items-center">
                            <Sparkles className="w-4 h-4 mr-1" />
                            FREE
                          </span>
                        ) : (
                          <span className="text-blue-600">₹{entryFee.toLocaleString()}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Your Balance:</span>
                      <span className="font-semibold text-green-600">₹{(user?.walletBalance || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleJoin}
                    disabled={joinMutation.isPending || (entryFee > parseFloat(user?.walletBalance || "0"))}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                  >
                    {joinMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Join Tournament
                      </>
                    )}
                  </Button>

                  {entryFee > parseFloat(user?.walletBalance || "0") && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Insufficient balance. Please add money to your wallet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Match Information */}
            {hasJoined && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    You're Registered!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tournament.roomId && (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg">
                        <label className="text-sm font-medium text-gray-600">Room ID</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                            {tournament.roomId}
                          </code>
                          <Button size="sm" variant="outline" onClick={copyRoomInfo}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {tournament.roomPassword && (
                        <div className="p-3 bg-white rounded-lg">
                          <label className="text-sm font-medium text-gray-600">Password</label>
                          <code className="block p-2 bg-gray-100 rounded text-sm font-mono mt-1">
                            {tournament.roomPassword}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Link href="/match-center">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                      <Gamepad2 className="w-5 h-5 mr-2" />
                      Go to Match Center
                    </Button>
                  </Link>

                  {isLive && (
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Results
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Tournament Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-semibold">{tournament.currentSlots}/{tournament.maxSlots}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Slots Filled:</span>
                  <span className="font-semibold text-blue-600">{Math.round(slotsProgress)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-semibold text-green-600">
                    {isFree ? "FREE" : `₹${entryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pool:</span>
                  <span className="font-semibold text-purple-600">₹{prizePool.toLocaleString()}</span>
                </div>
                {tournament.isVerified && (
                  <div className="flex items-center justify-center pt-2 border-t">
                    <Shield className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-600 font-medium">Verified Tournament</span>
                  </div>
                )}
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
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Tournament Guidelines
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Game
                </Button>
                <Link href="/support">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
