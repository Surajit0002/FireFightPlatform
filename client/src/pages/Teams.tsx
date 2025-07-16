import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Plus, 
  Settings, 
  Share2, 
  Crown, 
  UserPlus,
  Copy,
  Edit,
  Trash2,
  Star,
  MoreVertical,
  Upload,
  Eye,
  ExternalLink,
  Target,
  Trophy,
  Zap,
  Shield,
  Search,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  Key,
  LogOut,
  AlertTriangle,
  BarChart3,
  MapPin,
  Globe,
  Phone,
  Mail,
  Share,
  Download,
  Filter,
  SortAsc,
  RefreshCw,
  Heart,
  MessageSquare,
  Bookmark,
  Flag,
  ThumbsUp,
  UserCheck,
  UserX
} from "lucide-react";
import type { Team, TeamMember } from "@shared/schema";

// Player role configuration
const PLAYER_ROLES = {
  captain: { label: "Captain", icon: Crown, color: "bg-yellow-500" },
  igl: { label: "IGL", icon: Shield, color: "bg-blue-500" },
  entry: { label: "Entry Fragger", icon: Zap, color: "bg-red-500" },
  sniper: { label: "Sniper", icon: Target, color: "bg-purple-500" },
  support: { label: "Support", icon: Users, color: "bg-green-500" },
  scout: { label: "Scout", icon: Eye, color: "bg-orange-500" },
};

// Game configuration
const GAMES = {
  free_fire: { name: "Free Fire", color: "bg-red-500", icon: "🔥" },
  bgmi: { name: "BGMI", color: "bg-blue-500", icon: "🎯" },
  valorant: { name: "Valorant", color: "bg-purple-500", icon: "⚡" },
  csgo: { name: "CS:GO", color: "bg-orange-500", icon: "💥" },
  pubg: { name: "PUBG", color: "bg-green-500", icon: "🎮" },
};

export default function Teams() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  
  // Form states
  const [joinCode, setJoinCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGame, setFilterGame] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  // Create team form
  const [createTeamData, setCreateTeamData] = useState({
    name: "",
    code: "",
    description: "",
    logoUrl: "",
    game: "free_fire",
    isPrivate: false,
    maxMembers: 4,
  });
  
  // Edit team form
  const [editTeamData, setEditTeamData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    isPrivate: false,
    maxMembers: 4,
  });
  
  // Add player form
  const [addPlayerData, setAddPlayerData] = useState({
    username: "",
    role: "member",
    gameId: "",
  });

  // Data fetching
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/teams", selectedTeam?.id, "members"],
    enabled: !!selectedTeam,
  });

  // Mutations
  const createTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/teams", data);
      return response;
    },
    onSuccess: () => {
      toast({ title: "Team created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setIsCreateModalOpen(false);
      resetCreateForm();
    },
    onError: (error: any) => {
      toast({ title: "Error creating team", description: error.message, variant: "destructive" });
    },
  });

  const joinTeamMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("POST", "/api/teams/join", { code });
    },
    onSuccess: () => {
      toast({ title: "Successfully joined team!" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setIsJoinModalOpen(false);
      setJoinCode("");
    },
    onError: (error: any) => {
      toast({ title: "Error joining team", description: error.message, variant: "destructive" });
    },
  });

  const editTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/teams/${selectedTeam?.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Team updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setIsEditTeamOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error updating team", description: error.message, variant: "destructive" });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      return await apiRequest("DELETE", `/api/teams/${teamId}`);
    },
    onSuccess: () => {
      toast({ title: "Team deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setSelectedTeam(null);
    },
    onError: (error: any) => {
      toast({ title: "Error deleting team", description: error.message, variant: "destructive" });
    },
  });

  const leaveTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      return await apiRequest("POST", `/api/teams/${teamId}/leave`);
    },
    onSuccess: () => {
      toast({ title: "Left team successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
    onError: (error: any) => {
      toast({ title: "Error leaving team", description: error.message, variant: "destructive" });
    },
  });

  // Utility functions
  const formatTeamCode = (code: string) => {
    return code.replace(/(.{4})/g, "$1-").slice(0, -1);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const shareTeam = async (team: Team) => {
    const shareText = `Join my team "${team.name}" on FireFight! Use code: ${team.code}`;
    const shareUrl = `${window.location.origin}/teams?join=${team.code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${team.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        await copyToClipboard(shareUrl);
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const generateTeamCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreateTeamData({ ...createTeamData, code });
  };

  const resetCreateForm = () => {
    setCreateTeamData({
      name: "",
      code: "",
      description: "",
      logoUrl: "",
      game: "free_fire",
      isPrivate: false,
      maxMembers: 4,
    });
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createTeamData.name.trim()) {
      toast({ title: "Team name is required", variant: "destructive" });
      return;
    }
    
    if (!createTeamData.code.trim()) {
      toast({ title: "Team code is required", variant: "destructive" });
      return;
    }
    
    createTeamMutation.mutate(createTeamData);
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      toast({ title: "Team code is required", variant: "destructive" });
      return;
    }
    
    joinTeamMutation.mutate(joinCode.trim().toUpperCase());
  };

  const handleEditTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    editTeamMutation.mutate(editTeamData);
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      deleteTeamMutation.mutate(teamId);
    }
  };

  const handleLeaveTeam = async (teamId: number) => {
    if (window.confirm("Are you sure you want to leave this team?")) {
      leaveTeamMutation.mutate(teamId);
    }
  };

  const isTeamCaptain = (team: Team) => {
    return team.captainId === user?.id;
  };

  const getTeamStats = (team: Team) => {
    return {
      matches: Math.floor(Math.random() * 20) + 5,
      wins: Math.floor(Math.random() * 15) + 3,
      winRate: Math.floor(Math.random() * 40) + 60,
      avgKills: Math.floor(Math.random() * 10) + 5,
      kdRatio: (Math.random() * 2 + 1).toFixed(2),
    };
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = filterGame === "all" || team.game === filterGame;
    return matchesSearch && matchesGame;
  });

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "members":
        return b.maxMembers - a.maxMembers;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
              ))}
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-fire-gray mb-2">My Teams</h1>
            <p className="text-gray-600">Create and manage your esports teams</p>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-fire-red text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
            <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="joinCode">Team Code</Label>
                    <Input
                      id="joinCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter team code"
                      className="font-mono"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsJoinModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-fire-blue text-white">
                      Join Team
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <CardContent>
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams yet</h3>
                  <p className="text-gray-500 mb-4">Create your first team to start competing together</p>
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-fire-red text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Team
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            teams.map((team) => (
              <Card key={team.id} className="card-hover">
                <CardContent className="p-6">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-fire-red rounded-lg flex items-center justify-center">
                        {team.logoUrl ? (
                          <img src={team.logoUrl} alt={team.name} className="w-full h-full rounded-lg object-cover" />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {team.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-fire-gray">{team.name}</h3>
                        <p className="text-sm text-gray-500">Team Code: {formatTeamCode(team.code)}</p>
                      </div>
                    </div>
                    
                    {team.captainId === user?.id && (
                      <Badge className="bg-yellow-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Captain
                      </Badge>
                    )}
                  </div>

                  {/* Team Description */}
                  {team.description && (
                    <p className="text-gray-600 text-sm mb-4">{team.description}</p>
                  )}

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-fire-blue">4</div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-semibold text-fire-green">85%</div>
                      <div className="text-xs text-gray-500">Win Rate</div>
                    </div>
                  </div>

                  {/* Members Preview */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Team Members</span>
                      <Badge variant="outline">4 members</Badge>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-fire-blue text-white text-xs">
                            {i}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTeam(team)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => shareTeam(team)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(team.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Team Actions for Captain */}
                  {team.captainId === user?.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Team
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Featured Teams Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-fire-gray mb-6">Featured Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-hover border-fire-teal border-opacity-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">FT</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-fire-gray">Featured Team {i}</h3>
                        <p className="text-sm text-gray-500">Public Team</p>
                      </div>
                    </div>
                    <Badge className="bg-fire-teal text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    Professional esports team looking for skilled players to join tournaments.
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="font-semibold text-fire-teal">12</div>
                      <div className="text-gray-500">Wins</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="font-semibold text-fire-blue">5</div>
                      <div className="text-gray-500">Members</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="font-semibold text-fire-green">92%</div>
                      <div className="text-gray-500">Win Rate</div>
                    </div>
                  </div>

                  <Button className="w-full bg-fire-teal text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Request to Join
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Management Modal */}
        {selectedTeam && (
          <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-fire-red rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedTeam.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span>{selectedTeam.name}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Team Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Team Code</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-3 py-2 rounded font-mono">
                        {formatTeamCode(selectedTeam.code)}
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(selectedTeam.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      <Badge className={selectedTeam.isActive ? "bg-fire-green" : "bg-gray-500"}>
                        {selectedTeam.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Team Members</h3>
                    {selectedTeam.captainId === user?.id && (
                      <Button size="sm" className="bg-fire-blue text-white">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>M{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Member {i}</div>
                            <div className="text-sm text-gray-500">
                              {i === 1 ? "Captain" : "Member"} • Joined {i} days ago
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {i === 1 && (
                            <Badge className="bg-yellow-500 text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              Captain
                            </Badge>
                          )}
                          {selectedTeam.captainId === user?.id && i !== 1 && (
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTeam(null)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => shareTeam(selectedTeam)}
                    className="flex-1 bg-fire-blue text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Team
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>

      {/* Create Team Modal */}
      <CreateTeamModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
