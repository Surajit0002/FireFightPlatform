import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  FileImage,
  AlertTriangle,
  Trophy,
  Target,
  Users,
  Calendar,
  Gamepad2,
  MessageSquare
} from "lucide-react";
import type { TournamentParticipant, Tournament } from "@/types";

export default function MatchResults() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [gameFilter, setGameFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState<TournamentParticipant | null>(null);
  const [reviewForm, setReviewForm] = useState({
    action: "",
    kills: "",
    points: "",
    rank: "",
    notes: "",
  });

  // Mock data for match results - in real app this would come from API
  const mockResults: (TournamentParticipant & { tournament?: Tournament; user?: any })[] = [
    {
      id: 1,
      tournamentId: 1,
      userId: "user1",
      teamId: null,
      rank: null,
      kills: 15,
      points: 850,
      screenshotUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      isVerified: false,
      notes: null,
      joinedAt: new Date().toISOString(),
      tournament: {
        id: 1,
        title: "Free Fire Championship",
        gameType: "free_fire" as const,
        format: "squad" as const,
        maxParticipants: 50,
        currentParticipants: 45,
        entryFee: "100",
        prizePool: "50000",
        status: "live" as const,
        startTime: new Date().toISOString(),
        endTime: null,
        roomId: "FF123456",
        roomPassword: "pass123",
        rules: null,
        imageUrl: null,
        isPublic: true,
        createdBy: "admin1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      user: {
        username: "ProGamer_X",
        profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      }
    },
    {
      id: 2,
      tournamentId: 2,
      userId: "user2",
      teamId: null,
      rank: null,
      kills: 12,
      points: 720,
      screenshotUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
      isVerified: false,
      notes: null,
      joinedAt: new Date().toISOString(),
      tournament: {
        id: 2,
        title: "BGMI Pro League",
        gameType: "bgmi" as const,
        format: "squad" as const,
        maxParticipants: 40,
        currentParticipants: 35,
        entryFee: "50",
        prizePool: "25000",
        status: "live" as const,
        startTime: new Date().toISOString(),
        endTime: null,
        roomId: "BGMI789",
        roomPassword: "pass456",
        rules: null,
        imageUrl: null,
        isPublic: true,
        createdBy: "admin1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      user: {
        username: "ElitePlayer",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      }
    }
  ];

  const { data: results = mockResults, isLoading } = useQuery({
    queryKey: ["/api/admin/match-results", gameFilter, statusFilter],
    queryFn: async () => {
      // In real app, this would fetch from API
      return mockResults;
    },
  });

  const reviewResultMutation = useMutation({
    mutationFn: async ({ resultId, action, data }: { 
      resultId: number; 
      action: "approve" | "reject"; 
      data: any 
    }) => {
      // In real app, this would call API to update result
      return { success: true };
    },
    onSuccess: (_, { action }) => {
      toast({
        title: action === "approve" ? "Result Approved" : "Result Rejected",
        description: `Match result has been ${action}d successfully.`,
        variant: "default",
      });
      setSelectedResult(null);
      setReviewForm({ action: "", kills: "", points: "", rank: "", notes: "" });
    },
    onError: (error) => {
      toast({
        title: "Review Failed",
        description: "Failed to review match result.",
        variant: "destructive",
      });
    },
  });

  const filteredResults = results.filter(result => {
    const matchesSearch = result.tournament?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.user?.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGame = gameFilter === "all" || result.tournament?.gameType === gameFilter;
    
    const matchesStatus = (() => {
      switch (statusFilter) {
        case "pending":
          return !result.isVerified && result.screenshotUrl;
        case "verified":
          return result.isVerified;
        case "rejected":
          return result.notes?.includes("rejected") || false;
        case "no_result":
          return !result.screenshotUrl;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesGame && matchesStatus;
  });

  const getStatusBadge = (result: TournamentParticipant) => {
    if (result.isVerified) {
      return <Badge className="bg-fire-green text-white">Verified</Badge>;
    } else if (result.screenshotUrl) {
      return <Badge className="bg-orange-500 text-white">Pending Review</Badge>;
    } else {
      return <Badge variant="outline">No Result</Badge>;
    }
  };

  const getGameIcon = (gameType: string) => {
    return <Gamepad2 className="w-5 h-5 text-fire-blue" />;
  };

  const handleReviewResult = (action: "approve" | "reject") => {
    if (!selectedResult) return;

    const data = {
      kills: reviewForm.kills ? parseInt(reviewForm.kills) : selectedResult.kills,
      points: reviewForm.points ? parseInt(reviewForm.points) : selectedResult.points,
      rank: reviewForm.rank ? parseInt(reviewForm.rank) : selectedResult.rank,
      notes: reviewForm.notes,
      isVerified: action === "approve",
    };

    reviewResultMutation.mutate({
      resultId: selectedResult.id,
      action,
      data
    });
  };

  const openReviewModal = (result: TournamentParticipant) => {
    setSelectedResult(result);
    setReviewForm({
      action: "",
      kills: result.kills?.toString() || "",
      points: result.points?.toString() || "",
      rank: result.rank?.toString() || "",
      notes: result.notes || "",
    });
  };

  const stats = {
    total: results.length,
    pending: results.filter(r => !r.isVerified && r.screenshotUrl).length,
    verified: results.filter(r => r.isVerified).length,
    noResult: results.filter(r => !r.screenshotUrl).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-fire-gray">Match Results</h1>
                  <p className="text-gray-600">Review and verify tournament match results</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-orange-500 text-white px-3 py-1">
                    {stats.pending} Pending Review
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Results</p>
                      <p className="text-3xl font-bold text-fire-gray">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Review</p>
                      <p className="text-3xl font-bold text-fire-gray">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Verified</p>
                      <p className="text-3xl font-bold text-fire-gray">{stats.verified}</p>
                    </div>
                    <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">No Results</p>
                      <p className="text-3xl font-bold text-fire-gray">{stats.noResult}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    <Input
                      placeholder="Search by tournament or player..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="no_result">No Results</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={gameFilter} onValueChange={setGameFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Games</SelectItem>
                      <SelectItem value="free_fire">Free Fire</SelectItem>
                      <SelectItem value="bgmi">BGMI</SelectItem>
                      <SelectItem value="valorant">Valorant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Match Results ({filteredResults.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-600">Player</th>
                        <th className="text-left p-4 font-medium text-gray-600">Tournament</th>
                        <th className="text-left p-4 font-medium text-gray-600">Game</th>
                        <th className="text-left p-4 font-medium text-gray-600">Performance</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600">Submitted</th>
                        <th className="text-right p-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredResults.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
                            <p className="text-gray-500">
                              {results.length === 0 
                                ? "No match results to review yet"
                                : "No results match your current filters"}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredResults.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarImage src={result.user?.profileImageUrl} />
                                  <AvatarFallback>
                                    {result.user?.username?.[0]?.toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold text-fire-gray">
                                    {result.user?.username || "Unknown Player"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {result.userId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-semibold text-fire-gray">
                                  {result.tournament?.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  #{result.tournamentId} • {result.tournament?.format}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {getGameIcon(result.tournament?.gameType || "")}
                                <span className="capitalize">
                                  {result.tournament?.gameType?.replace("_", " ")}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                {result.kills !== null && (
                                  <div>Kills: <span className="font-semibold">{result.kills}</span></div>
                                )}
                                {result.points !== null && (
                                  <div>Points: <span className="font-semibold">{result.points}</span></div>
                                )}
                                {result.rank !== null && (
                                  <div>Rank: <span className="font-semibold">#{result.rank}</span></div>
                                )}
                                {!result.kills && !result.points && !result.rank && (
                                  <span className="text-gray-500">No data</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(result)}
                            </td>
                            <td className="p-4">
                              <div className="text-sm text-gray-500">
                                {new Date(result.joinedAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {result.screenshotUrl && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(result.screenshotUrl!, '_blank')}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                
                                {!result.isVerified && result.screenshotUrl && (
                                  <>
                                    <Button 
                                      size="sm"
                                      onClick={() => openReviewModal(result)}
                                      className="bg-fire-blue text-white"
                                    >
                                      Review
                                    </Button>
                                  </>
                                )}

                                {result.isVerified && (
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Review Modal */}
      {selectedResult && (
        <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Review Match Result</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Screenshot */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Screenshot</Label>
                {selectedResult.screenshotUrl ? (
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={selectedResult.screenshotUrl} 
                      alt="Match result screenshot"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No screenshot submitted</p>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-fire-gray mb-2">Player Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Player:</span>
                      <span className="font-semibold">{selectedResult.user?.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tournament:</span>
                      <span className="font-semibold">{selectedResult.tournament?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Game:</span>
                      <span className="font-semibold capitalize">
                        {selectedResult.tournament?.gameType?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="kills">Kills</Label>
                    <Input
                      id="kills"
                      type="number"
                      value={reviewForm.kills}
                      onChange={(e) => setReviewForm({ ...reviewForm, kills: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={reviewForm.points}
                      onChange={(e) => setReviewForm({ ...reviewForm, points: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">Rank</Label>
                    <Input
                      id="rank"
                      type="number"
                      value={reviewForm.rank}
                      onChange={(e) => setReviewForm({ ...reviewForm, rank: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={reviewForm.notes}
                    onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                    placeholder="Add any notes about this result..."
                    rows={3}
                  />
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please verify the screenshot matches the submitted performance data. 
                    Once approved, the result will be final and rankings will be updated.
                  </AlertDescription>
                </Alert>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedResult(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleReviewResult("reject")}
                    disabled={reviewResultMutation.isPending}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleReviewResult("approve")}
                    disabled={reviewResultMutation.isPending}
                    className="flex-1 bg-fire-green text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
