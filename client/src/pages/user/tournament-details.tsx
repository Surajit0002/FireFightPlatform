import { useState } from "react";
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
} from "lucide-react";
import type { Tournament, TournamentParticipant } from "@shared/schema";

export default function TournamentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<string>("");

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
        title: "Success",
        description: "Successfully joined the tournament!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id, "participants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tournament Not Found</h3>
              <p className="text-gray-500 mb-4">The tournament you're looking for doesn't exist.</p>
              <Link href="/tournaments">
                <Button>Browse Tournaments</Button>
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

  const gameColors: Record<string, string> = {
    free_fire: "bg-fire-red",
    bgmi: "bg-fire-blue",
    valorant: "bg-fire-green",
    csgo: "bg-fire-orange",
    pubg: "bg-purple-500",
  };

  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameColor = gameColors[tournament.game] || "bg-fire-red";
  const isLive = tournament.status === "live";
  const isCompleted = tournament.status === "completed";
  const slotsProgress = (tournament.currentSlots / tournament.maxSlots) * 100;
  
  const userParticipation = participants.find(p => p.userId === user?.id);
  const hasJoined = !!userParticipation;
  
  const startTime = new Date(tournament.startTime);
  const now = new Date();
  const timeToStart = startTime.getTime() - now.getTime();

  const formatTimeLeft = () => {
    if (timeToStart <= 0) return "Started";
    
    const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleJoin = () => {
    if (tournament.format !== "solo" && !selectedTeam) {
      toast({
        title: "Select Team",
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
        title: "Copied",
        description: "Room information copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/tournaments">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tournaments</span>
            </Button>
          </Link>
        </div>

        {/* Tournament Header */}
        <div className="hero-gradient rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${gameColor} rounded-xl flex items-center justify-center text-3xl`}>
                {gameIcon}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{tournament.title}</h1>
                <div className="flex items-center space-x-4">
                  <Badge className={`${
                    isLive ? "bg-fire-red" : isCompleted ? "bg-gray-500" : "bg-fire-blue"
                  } text-white px-3 py-1`}>
                    {isLive ? "LIVE" : isCompleted ? "COMPLETED" : "UPCOMING"}
                  </Badge>
                  {tournament.isFeatured && (
                    <Badge className="bg-yellow-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      FEATURED
                    </Badge>
                  )}
                  {tournament.isVerified && (
                    <Badge className="bg-fire-green text-white px-3 py-1">
                      <Shield className="w-3 h-3 mr-1" />
                      VERIFIED
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">₹{tournament.prizePool}</div>
              <div className="opacity-90">Prize Pool</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tournament Info */}
            <Card>
              <CardHeader>
                <CardTitle>Tournament Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold">₹{tournament.prizePool}</div>
                    <div className="text-sm text-gray-500">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold">
                      {parseFloat(tournament.entryFee) === 0 ? "FREE" : `₹${tournament.entryFee}`}
                    </div>
                    <div className="text-sm text-gray-500">Entry Fee</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold">{tournament.currentSlots}/{tournament.maxSlots}</div>
                    <div className="text-sm text-gray-500">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold">{formatTimeLeft()}</div>
                    <div className="text-sm text-gray-500">
                      {isLive ? "Started" : isCompleted ? "Ended" : "Starts in"}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tournament Progress</span>
                    <span>{tournament.currentSlots}/{tournament.maxSlots} slots filled</span>
                  </div>
                  <Progress value={slotsProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Tournament Schedule & Rules */}
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 fire-blue" />
                        <div>
                          <div className="font-semibold">Start Time</div>
                          <div className="text-gray-600">{startTime.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 fire-green" />
                        <div>
                          <div className="font-semibold">Map</div>
                          <div className="text-gray-600">{tournament.mapInfo || "TBD"}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 fire-red" />
                        <div>
                          <div className="font-semibold">Format</div>
                          <div className="text-gray-600 capitalize">
                            {tournament.format} ({tournament.teamSize} players)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <h4 className="font-semibold mb-3">Tournament Rules</h4>
                      <div className="whitespace-pre-wrap text-gray-700">
                        {tournament.rules || "Standard tournament rules apply. Please follow fair play guidelines."}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {participants.length > 0 ? (
                        participants.map((participant, index) => (
                          <div key={participant.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <Avatar>
                              <AvatarFallback>{participant.userId?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-semibold">Player {index + 1}</div>
                              <div className="text-sm text-gray-500">
                                Joined {new Date(participant.joinedAt).toLocaleDateString()}
                              </div>
                            </div>
                            {participant.status === "winner" && (
                              <Badge className="bg-yellow-500 text-white">Winner</Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No participants yet. Be the first to join!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Tournament */}
            {!hasJoined && !isCompleted && tournament.currentSlots < tournament.maxSlots && (
              <Card>
                <CardHeader>
                  <CardTitle>Join Tournament</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.format !== "solo" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Select Team</label>
                      <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full p-2 border rounded-lg"
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
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Entry Fee:</span>
                      <span className="font-semibold">
                        {parseFloat(tournament.entryFee) === 0 ? "FREE" : `₹${tournament.entryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Balance:</span>
                      <span className="font-semibold fire-green">₹{user?.walletBalance || "0.00"}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleJoin}
                    disabled={joinMutation.isPending || (parseFloat(tournament.entryFee) > parseFloat(user?.walletBalance || "0"))}
                    className="w-full bg-fire-red hover:bg-red-600 text-white"
                  >
                    {joinMutation.isPending ? "Joining..." : "Join Tournament"}
                  </Button>

                  {parseFloat(tournament.entryFee) > parseFloat(user?.walletBalance || "0") && (
                    <p className="text-sm text-red-600 mt-2">
                      Insufficient balance. Please add money to your wallet.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Room Information */}
            {hasJoined && (tournament.roomId || isLive) && (
              <Card>
                <CardHeader>
                  <CardTitle>Room Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Room ID</label>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                          {tournament.roomId || "TBA"}
                        </code>
                        <Button size="sm" variant="outline" onClick={copyRoomInfo}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {tournament.roomPassword && (
                      <div>
                        <label className="text-sm font-medium">Password</label>
                        <code className="block p-2 bg-gray-100 rounded text-sm">
                          {tournament.roomPassword}
                        </code>
                      </div>
                    )}
                    <div className="pt-2">
                      <Button className="w-full bg-fire-blue hover:bg-blue-600 text-white">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Match Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Results */}
            {hasJoined && isLive && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-fire-green hover:bg-green-600 text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Screenshot
                    </Button>
                    <p className="text-xs text-gray-500">
                      Upload your final result screenshot after the match ends.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tournament Status */}
            <Card>
              <CardHeader>
                <CardTitle>Tournament Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Game:</span>
                    <span className="font-semibold capitalize">{tournament.game.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(tournament.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={isLive ? "destructive" : isCompleted ? "secondary" : "default"}>
                      {tournament.status.toUpperCase()}
                    </Badge>
                  </div>
                  {tournament.isVerified && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Shield className="w-4 h-4 fire-green" />
                      <span className="text-sm fire-green">Verified Tournament</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
