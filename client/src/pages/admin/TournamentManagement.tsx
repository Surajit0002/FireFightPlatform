import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminSidebar from "@/components/layout/AdminSidebar";
import CreateTournamentModal from "@/components/tournament/CreateTournamentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Play, 
  Pause,
  Calendar,
  Users,
  Trophy,
  DollarSign,
  Gamepad2,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Link } from "wouter";
import type { Tournament } from "@/types";

export default function TournamentManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gameFilter, setGameFilter] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments", gameFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (gameFilter !== "all") params.append("gameType", gameFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await fetch(`/api/tournaments?${params.toString()}`);
      return res.json();
    },
  });

  const updateTournamentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Tournament> }) => {
      return apiRequest("PUT", `/api/tournaments/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Tournament Updated",
        description: "Tournament has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setSelectedTournament(null);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/tournaments/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Tournament Deleted",
        description: "Tournament has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-fire-red text-white tournament-live">LIVE</Badge>;
      case "upcoming":
        return <Badge className="bg-fire-blue text-white">UPCOMING</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 text-white">COMPLETED</Badge>;
      case "cancelled":
        return <Badge variant="destructive">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  const getGameIcon = (gameType: string) => {
    return <Gamepad2 className="w-5 h-5 text-fire-blue" />;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleStatusChange = (tournament: Tournament, newStatus: string) => {
    updateTournamentMutation.mutate({
      id: tournament.id,
      data: { status: newStatus as any }
    });
  };

  const handleDeleteTournament = (id: number) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      deleteTournamentMutation.mutate(id);
    }
  };

  const copyTournament = (tournament: Tournament) => {
    const tournamentData = {
      ...tournament,
      id: undefined,
      title: `${tournament.title} (Copy)`,
      status: "upcoming" as const,
      currentParticipants: 0,
      createdAt: undefined,
      updatedAt: undefined,
    };
    
    // In a real implementation, this would open the create modal with pre-filled data
    setIsCreateModalOpen(true);
    toast({
      title: "Tournament Copied",
      description: "Tournament template has been copied. Modify and save to create.",
    });
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
                  <h1 className="text-2xl font-bold text-fire-gray">Tournament Management</h1>
                  <p className="text-gray-600">Create and manage esports tournaments</p>
                </div>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-fire-red text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tournament
                </Button>
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
                      <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
                      <p className="text-3xl font-bold text-fire-gray">{tournaments.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Live Tournaments</p>
                      <p className="text-3xl font-bold text-fire-gray">
                        {tournaments.filter(t => t.status === "live").length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-fire-red rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Participants</p>
                      <p className="text-3xl font-bold text-fire-gray">
                        {tournaments.reduce((sum, t) => sum + t.currentParticipants, 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Prize Pool</p>
                      <p className="text-3xl font-bold text-fire-gray">
                        ₹{tournaments.reduce((sum, t) => sum + parseFloat(t.prizePool), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
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
                      placeholder="Search tournaments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={gameFilter} onValueChange={setGameFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by game" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Games</SelectItem>
                      <SelectItem value="free_fire">Free Fire</SelectItem>
                      <SelectItem value="bgmi">BGMI</SelectItem>
                      <SelectItem value="valorant">Valorant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>More Filters</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tournaments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Tournaments ({filteredTournaments.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-600">Tournament</th>
                        <th className="text-left p-4 font-medium text-gray-600">Game</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-left p-4 font-medium text-gray-600">Participants</th>
                        <th className="text-left p-4 font-medium text-gray-600">Prize Pool</th>
                        <th className="text-left p-4 font-medium text-gray-600">Start Time</th>
                        <th className="text-right p-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTournaments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tournaments found</h3>
                            <p className="text-gray-500 mb-4">
                              {tournaments.length === 0 
                                ? "Create your first tournament to get started"
                                : "No tournaments match your current filters"}
                            </p>
                            <Button
                              onClick={() => setIsCreateModalOpen(true)}
                              className="bg-fire-red text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Tournament
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        filteredTournaments.map((tournament) => (
                          <tr key={tournament.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <h3 className="font-semibold text-fire-gray">{tournament.title}</h3>
                                <p className="text-sm text-gray-500">#{tournament.id}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                {getGameIcon(tournament.gameType)}
                                <span className="capitalize">{tournament.gameType.replace("_", " ")}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(tournament.status)}
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="font-semibold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                                <div className="text-gray-500">{tournament.format}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="font-semibold text-fire-green">₹{parseFloat(tournament.prizePool).toLocaleString()}</div>
                                <div className="text-gray-500">Entry: ₹{parseFloat(tournament.entryFee).toLocaleString()}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div>{formatDateTime(tournament.startTime)}</div>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/tournaments/${tournament.id}`}>
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedTournament(tournament)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>

                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => copyTournament(tournament)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>

                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteTournament(tournament.id)}
                                  className="text-fire-red hover:text-fire-red"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
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

      {/* Create Tournament Modal */}
      <CreateTournamentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Edit Tournament Modal */}
      {selectedTournament && (
        <Dialog open={!!selectedTournament} onOpenChange={() => setSelectedTournament(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tournament Title</Label>
                  <Input 
                    value={selectedTournament.title}
                    onChange={(e) => setSelectedTournament({
                      ...selectedTournament,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={selectedTournament.status}
                    onValueChange={(value) => handleStatusChange(selectedTournament, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea 
                  value={selectedTournament.description || ""}
                  onChange={(e) => setSelectedTournament({
                    ...selectedTournament,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prize Pool (₹)</Label>
                  <Input 
                    type="number"
                    value={selectedTournament.prizePool}
                    onChange={(e) => setSelectedTournament({
                      ...selectedTournament,
                      prizePool: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Entry Fee (₹)</Label>
                  <Input 
                    type="number"
                    value={selectedTournament.entryFee}
                    onChange={(e) => setSelectedTournament({
                      ...selectedTournament,
                      entryFee: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTournament(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateTournamentMutation.mutate({
                    id: selectedTournament.id,
                    data: selectedTournament
                  })}
                  disabled={updateTournamentMutation.isPending}
                  className="flex-1 bg-fire-blue text-white"
                >
                  {updateTournamentMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
