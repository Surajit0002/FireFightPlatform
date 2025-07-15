import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Trophy,
  DollarSign,
  Search,
  Filter,
  Copy,
  Archive,
  Star,
  Shield,
} from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function AdminTournaments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const createTournamentMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/tournaments", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tournament created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setShowCreateModal(false);
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTournamentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PATCH", `/api/tournaments/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tournament updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTournamentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tournaments/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tournament deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    const tournamentData = {
      ...data,
      prizePool: data.prizePool?.toString() || "0",
      entryFee: data.entryFee?.toString() || "0",
      maxSlots: parseInt(data.maxSlots) || 0,
      teamSize: parseInt(data.teamSize) || 1,
      startTime: new Date(data.startTime),
    };

    if (selectedTournament) {
      updateTournamentMutation.mutate({ id: selectedTournament.id, data: tournamentData });
    } else {
      createTournamentMutation.mutate(tournamentData);
    }
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-fire-red';
      case 'upcoming': return 'bg-fire-blue';
      case 'completed': return 'bg-fire-green';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const TournamentForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Tournament Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter tournament title"
            defaultValue={selectedTournament?.title}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="game">Game</Label>
          <Select 
            defaultValue={selectedTournament?.game}
            onValueChange={(value) => setValue("game", value)}
            {...register("game", { required: "Game is required" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free_fire">Free Fire</SelectItem>
              <SelectItem value="bgmi">BGMI</SelectItem>
              <SelectItem value="valorant">Valorant</SelectItem>
              <SelectItem value="csgo">CS:GO</SelectItem>
              <SelectItem value="pubg">PUBG</SelectItem>
            </SelectContent>
          </Select>
          {errors.game && <p className="text-sm text-red-600 mt-1">{errors.game.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Tournament description"
          defaultValue={selectedTournament?.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prizePool">Prize Pool (₹)</Label>
          <Input
            id="prizePool"
            type="number"
            {...register("prizePool", { required: "Prize pool is required" })}
            placeholder="0"
            defaultValue={selectedTournament?.prizePool}
          />
          {errors.prizePool && <p className="text-sm text-red-600 mt-1">{errors.prizePool.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="entryFee">Entry Fee (₹)</Label>
          <Input
            id="entryFee"
            type="number"
            {...register("entryFee", { required: "Entry fee is required" })}
            placeholder="0"
            defaultValue={selectedTournament?.entryFee}
          />
          {errors.entryFee && <p className="text-sm text-red-600 mt-1">{errors.entryFee.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="maxSlots">Max Slots</Label>
          <Input
            id="maxSlots"
            type="number"
            {...register("maxSlots", { required: "Max slots is required" })}
            placeholder="0"
            defaultValue={selectedTournament?.maxSlots}
          />
          {errors.maxSlots && <p className="text-sm text-red-600 mt-1">{errors.maxSlots.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="format">Format</Label>
          <Select 
            defaultValue={selectedTournament?.format}
            onValueChange={(value) => setValue("format", value)}
            {...register("format", { required: "Format is required" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="duo">Duo</SelectItem>
              <SelectItem value="squad">Squad</SelectItem>
            </SelectContent>
          </Select>
          {errors.format && <p className="text-sm text-red-600 mt-1">{errors.format.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="teamSize">Team Size</Label>
          <Input
            id="teamSize"
            type="number"
            {...register("teamSize", { required: "Team size is required" })}
            placeholder="1"
            defaultValue={selectedTournament?.teamSize}
          />
          {errors.teamSize && <p className="text-sm text-red-600 mt-1">{errors.teamSize.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            {...register("startTime", { required: "Start time is required" })}
            defaultValue={selectedTournament?.startTime ? 
              new Date(selectedTournament.startTime).toISOString().slice(0, 16) : ""}
          />
          {errors.startTime && <p className="text-sm text-red-600 mt-1">{errors.startTime.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="mapInfo">Map Information</Label>
          <Input
            id="mapInfo"
            {...register("mapInfo")}
            placeholder="Map details"
            defaultValue={selectedTournament?.mapInfo}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rules">Rules & Guidelines</Label>
        <Textarea
          id="rules"
          {...register("rules")}
          placeholder="Tournament rules and guidelines"
          rows={4}
          defaultValue={selectedTournament?.rules}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowCreateModal(false);
            setSelectedTournament(null);
            reset();
          }}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-fire-red hover:bg-red-600 text-white flex-1"
          disabled={createTournamentMutation.isPending || updateTournamentMutation.isPending}
        >
          {selectedTournament 
            ? (updateTournamentMutation.isPending ? "Updating..." : "Update Tournament")
            : (createTournamentMutation.isPending ? "Creating..." : "Create Tournament")
          }
        </Button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold fire-gray mb-2">Tournament Management</h1>
            <p className="text-gray-600">Create, manage, and monitor tournaments</p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-fire-red hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedTournament ? "Edit Tournament" : "Create New Tournament"}
                </DialogTitle>
              </DialogHeader>
              <TournamentForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Search tournaments..."
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
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tournaments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tournaments ({filteredTournaments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tournament</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Prize Pool</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{tournament.title}</span>
                          {tournament.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                          {tournament.isVerified && <Shield className="w-4 h-4 text-fire-green" />}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {tournament.format} • {tournament.teamSize} players
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {tournament.game.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                        {tournament.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{tournament.currentSlots}/{tournament.maxSlots}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-fire-green" />
                        <span>₹{tournament.prizePool}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(tournament.startTime).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTournament(tournament);
                            setShowCreateModal(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTournamentMutation.mutate(tournament.id)}
                          disabled={deleteTournamentMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tournaments Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all'
                    ? "Try adjusting your search or filters."
                    : "Create your first tournament to get started."}
                </p>
                <Button onClick={() => setShowCreateModal(true)} className="bg-fire-red hover:bg-red-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tournament
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
