import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  Search,
  FileImage,
  Trophy,
  Users,
  MessageCircle,
  Download,
  Flag,
  Filter,
} from "lucide-react";
import type { TournamentParticipant, Tournament } from "@shared/schema";

export default function AdminMatchResults() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: pendingResults = [] } = useQuery({
    queryKey: ["/api/admin/pending-results"],
    enabled: false, // This would need to be implemented in the backend
  });

  const reviewResultMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      await apiRequest("POST", `/api/admin/results/${id}/review`, { status, notes });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Result reviewed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-results"] });
      setShowReviewModal(false);
      setSelectedResult(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mock data for demonstration - would come from API
  const mockResults = [
    {
      id: 1,
      tournamentId: 1,
      tournamentTitle: "Free Fire Championship",
      userId: "user1",
      username: "ProGamer_X",
      rank: 1,
      kills: 15,
      screenshotUrl: "https://example.com/screenshot1.jpg",
      submittedAt: new Date().toISOString(),
      status: "pending",
      game: "free_fire"
    },
    {
      id: 2,
      tournamentId: 2,
      tournamentTitle: "BGMI Pro League",
      userId: "user2",
      username: "ElitePlayer",
      rank: 3,
      kills: 8,
      screenshotUrl: "https://example.com/screenshot2.jpg",
      submittedAt: new Date().toISOString(),
      status: "pending",
      game: "bgmi"
    },
    {
      id: 3,
      tournamentId: 3,
      tournamentTitle: "Valorant Weekly",
      userId: "user3",
      username: "ChampionGG",
      rank: 2,
      kills: 12,
      screenshotUrl: "https://example.com/screenshot3.jpg",
      submittedAt: new Date().toISOString(),
      status: "approved",
      game: "valorant"
    }
  ];

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch = result.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.tournamentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-fire-orange';
      case 'approved': return 'bg-fire-green';
      case 'rejected': return 'bg-fire-red';
      default: return 'bg-gray-500';
    }
  };

  const getGameIcon = (game: string) => {
    const icons: Record<string, string> = {
      free_fire: "🔥",
      bgmi: "🎯",
      valorant: "⚡",
      csgo: "💥",
      pubg: "🎮",
    };
    return icons[game] || "🎮";
  };

  const handleApprove = (result: any) => {
    reviewResultMutation.mutate({
      id: result.id,
      status: "approved",
      notes: adminNotes
    });
  };

  const handleReject = (result: any) => {
    if (!adminNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    reviewResultMutation.mutate({
      id: result.id,
      status: "rejected",
      notes: adminNotes
    });
  };

  const ResultReviewModal = () => (
    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Match Result</DialogTitle>
        </DialogHeader>
        
        {selectedResult && (
          <div className="space-y-6">
            {/* Result Info */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Match Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tournament:</span>
                    <span className="font-medium">{selectedResult.tournamentTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Player:</span>
                    <span className="font-medium">{selectedResult.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rank:</span>
                    <span className="font-medium">#{selectedResult.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kills:</span>
                    <span className="font-medium">{selectedResult.kills}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">
                      {new Date(selectedResult.submittedAt).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Screenshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Screenshot Preview</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this result review..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                onClick={() => handleApprove(selectedResult)}
                className="bg-fire-green hover:bg-green-600 text-white flex-1"
                disabled={reviewResultMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Result
              </Button>
              <Button
                onClick={() => handleReject(selectedResult)}
                className="bg-fire-red hover:bg-red-600 text-white flex-1"
                disabled={reviewResultMutation.isPending}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Result
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Match Results</h1>
          <p className="text-gray-600">Review and verify tournament results and screenshots</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-orange rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {filteredResults.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending Review</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {filteredResults.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {filteredResults.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-500">Rejected</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {filteredResults.filter(r => r.status === 'disputed').length}
              </div>
              <div className="text-sm text-gray-500">Disputed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Search by player or tournament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
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
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Screenshot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getGameIcon(result.game)}</span>
                        <div>
                          <div className="font-medium">{result.tournamentTitle}</div>
                          <div className="text-sm text-gray-500 capitalize">
                            {result.game.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{result.username}</div>
                        <div className="text-sm text-gray-500">ID: {result.userId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-fire-orange" />
                          <span className="font-medium">Rank #{result.rank}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-fire-red" />
                          <span className="text-sm">{result.kills} kills</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <FileImage className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(result.status)} text-white`}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedResult(result);
                            setShowReviewModal(true);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                        {result.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-fire-green hover:bg-green-600 text-white"
                              onClick={() => handleApprove(result)}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-fire-red hover:bg-red-600 text-white"
                              onClick={() => {
                                setSelectedResult(result);
                                setShowReviewModal(true);
                              }}
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <FileImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'pending'
                    ? "Try adjusting your search or filters."
                    : "No match results pending review."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <ResultReviewModal />
      </main>
    </AdminLayout>
  );
}
