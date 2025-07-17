import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
// import { useWebSocket } from "@/hooks/useWebSocket"; // Temporarily disabled
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trophy, 
  Users, 
  Clock, 
  DollarSign, 
  Gamepad2, 
  Upload,
  MessageCircle,
  Copy,
  Share2,
  Calendar,
  MapPin
} from "lucide-react";
import type { Tournament, TournamentParticipant } from "@/types";

export default function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  // const { subscribeTournament } = useWebSocket(); // Temporarily disabled
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [resultForm, setResultForm] = useState({
    kills: "",
    points: "",
    screenshot: null as File | null,
  });

  const { data: tournament, isLoading } = useQuery<Tournament>({
    queryKey: ["/api/tournaments", id],
    enabled: !!id,
  });

  const { data: participants = [] } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/tournaments", id, "participants"],
    enabled: !!id,
  });

  const { data: userTeams = [] } = useQuery({
    queryKey: ["/api/teams"],
    enabled: !!user,
  });

  const joinMutation = useMutation({
    mutationFn: async (data: { teamId?: number }) => {
      return apiRequest("POST", `/api/tournaments/${id}/join`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully joined the tournament!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id, "participants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id] });
      setIsJoinModalOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resultMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", `/api/tournaments/${id}/results`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Result submitted successfully!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments", id, "participants"] });
      setIsResultModalOpen(false);
      setResultForm({ kills: "", points: "", screenshot: null });
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
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-300 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 bg-gray-300 rounded-lg"></div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-300 rounded-lg"></div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <CardContent>
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tournament not found</h3>
              <p className="text-gray-500">The tournament you're looking for doesn't exist</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Subscribe to tournament updates
  // if (id) {
  //   subscribeTournament(parseInt(id));
  // }

  const isParticipant = participants.some(p => p.userId === user?.id);
  const userParticipant = participants.find(p => p.userId === user?.id);
  const entryFeeFloat = parseFloat(tournament.entryFee);
  const prizePoolFloat = parseFloat(tournament.prizePool);
  const canJoin = tournament.currentParticipants < tournament.maxParticipants && 
                  tournament.status === "upcoming" && !isParticipant;

  const handleJoinTournament = () => {
    if (!user) {
      window.location.href = "/api/login";
      return;
    }

    if (tournament.format === "solo") {
      joinMutation.mutate({});
    } else {
      setIsJoinModalOpen(true);
    }
  };

  const handleSubmitResult = () => {
    const formData = new FormData();
    if (resultForm.kills) formData.append("kills", resultForm.kills);
    if (resultForm.points) formData.append("points", resultForm.points);
    if (resultForm.screenshot) formData.append("screenshot", resultForm.screenshot);

    resultMutation.mutate(formData);
  };

  const getStatusBadge = () => {
    switch (tournament.status) {
      case "live":
        return <Badge className="bg-fire-red text-white tournament-live">LIVE</Badge>;
      case "upcoming":
        return <Badge className="bg-fire-blue text-white">UPCOMING</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 text-white">COMPLETED</Badge>;
      default:
        return <Badge variant="outline">{tournament.status.toUpperCase()}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tournament Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-fire-blue rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-fire-gray">{tournament.title}</h1>
                    {getStatusBadge()}
                  </div>
                  <p className="text-gray-600 text-lg">{tournament.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateTime(tournament.startTime)}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {tournament.gameType.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
                {tournament.roomId && isParticipant && (
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>Copy Room ID</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tournament Info */}
            <Card>
              <CardHeader>
                <CardTitle>Tournament Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-fire-green mx-auto mb-2" />
                    <div className="font-semibold text-fire-green">₹{prizePoolFloat.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Prize Pool</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-fire-blue mx-auto mb-2" />
                    <div className="font-semibold">
                      {entryFeeFloat === 0 ? "FREE" : `₹${entryFeeFloat.toLocaleString()}`}
                    </div>
                    <div className="text-sm text-gray-500">Entry Fee</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-fire-teal mx-auto mb-2" />
                    <div className="font-semibold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                    <div className="text-sm text-gray-500">Participants</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold capitalize">{tournament.format}</div>
                    <div className="text-sm text-gray-500">Format</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Room Information */}
            {tournament.roomId && isParticipant && (
              <Card className="border-fire-blue">
                <CardHeader>
                  <CardTitle className="text-fire-blue">Room Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Room ID</Label>
                      <div className="mt-1 p-3 bg-gray-100 rounded-lg font-mono text-lg">
                        {tournament.roomId}
                      </div>
                    </div>
                    {tournament.roomPassword && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Room Password</Label>
                        <div className="mt-1 p-3 bg-gray-100 rounded-lg font-mono text-lg">
                          {tournament.roomPassword}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tournament Rules */}
            {tournament.rules && (
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm">
                    <p className="text-gray-700 whitespace-pre-wrap">{tournament.rules}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Participants ({participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No participants yet</p>
                    </div>
                  ) : (
                    participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {participant.userId?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Player {participant.id}</div>
                            <div className="text-sm text-gray-500">
                              Joined {new Date(participant.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {participant.rank && (
                          <Badge variant="outline">Rank #{participant.rank}</Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Tournament */}
            {canJoin && (
              <Card className="border-fire-green">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-fire-green mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Join Tournament</h3>
                    <p className="text-gray-600 mb-4">
                      {entryFeeFloat === 0 
                        ? "This is a free tournament!" 
                        : `Entry fee: ₹${entryFeeFloat.toLocaleString()}`}
                    </p>
                    <Button 
                      onClick={handleJoinTournament}
                      disabled={joinMutation.isPending}
                      className={`w-full ${entryFeeFloat === 0 ? 'bg-fire-green' : 'bg-fire-red'} text-white`}
                    >
                      {joinMutation.isPending ? "Joining..." : "Join Tournament"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Results */}
            {isParticipant && tournament.status === "live" && (
              <Card className="border-fire-blue">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-fire-blue mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Submit Results</h3>
                    <p className="text-gray-600 mb-4">Upload your match results</p>
                    <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-fire-blue text-white">
                          Upload Results
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Match Results</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="kills">Kills</Label>
                            <Input
                              id="kills"
                              type="number"
                              value={resultForm.kills}
                              onChange={(e) => setResultForm({ ...resultForm, kills: e.target.value })}
                              placeholder="Number of kills"
                            />
                          </div>
                          <div>
                            <Label htmlFor="points">Points</Label>
                            <Input
                              id="points"
                              type="number"
                              value={resultForm.points}
                              onChange={(e) => setResultForm({ ...resultForm, points: e.target.value })}
                              placeholder="Total points"
                            />
                          </div>
                          <div>
                            <Label htmlFor="screenshot">Screenshot</Label>
                            <Input
                              id="screenshot"
                              type="file"
                              accept="image/*"
                              onChange={(e) => setResultForm({ 
                                ...resultForm, 
                                screenshot: e.target.files?.[0] || null 
                              })}
                            />
                          </div>
                          <Button 
                            onClick={handleSubmitResult}
                            disabled={resultMutation.isPending}
                            className="w-full bg-fire-blue text-white"
                          >
                            {resultMutation.isPending ? "Submitting..." : "Submit Results"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Match Status */}
            {userParticipant && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge variant={userParticipant.isVerified ? "default" : "outline"}>
                        {userParticipant.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    {userParticipant.rank && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rank</span>
                        <span className="font-semibold">#{userParticipant.rank}</span>
                      </div>
                    )}
                    {userParticipant.kills !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kills</span>
                        <span className="font-semibold">{userParticipant.kills}</span>
                      </div>
                    )}
                    {userParticipant.points !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Points</span>
                        <span className="font-semibold">{userParticipant.points}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tournament Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Tournament Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Chat will be available during live matches</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Modal */}
        <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Team (Optional for squad tournaments)</Label>
                <div className="mt-2 space-y-2">
                  <div 
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedTeamId === null ? 'border-fire-blue bg-fire-blue bg-opacity-10' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTeamId(null)}
                  >
                    <div className="font-medium">Join as Solo</div>
                    <div className="text-sm text-gray-500">Join without a team</div>
                  </div>
                  {userTeams.map((team: any) => (
                    <div
                      key={team.id}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedTeamId === team.id ? 'border-fire-blue bg-fire-blue bg-opacity-10' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTeamId(team.id)}
                    >
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-500">Team Code: {team.code}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => joinMutation.mutate({ teamId: selectedTeamId || undefined })}
                disabled={joinMutation.isPending}
                className="w-full bg-fire-red text-white"
              >
                {joinMutation.isPending ? "Joining..." : "Confirm Join"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
