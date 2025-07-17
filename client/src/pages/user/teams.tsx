
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import UserHeader from "@/components/layout/user-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Plus, 
  Trophy, 
  UserPlus,
  Crown,
  Target,
  Shield,
  Crosshair,
  Upload,
  Copy,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  DollarSign,
  Gamepad2,
  X,
  Camera
} from "lucide-react";

interface Team {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
  captainId: string;
  totalMembers: number;
  winRate: number;
  totalEarnings: number;
  matchesPlayed: number;
  isActive: boolean;
}

interface TeamMember {
  id: number;
  teamId: number;
  userId: string;
  role: string;
  gameId: string | null;
  contactInfo: string | null;
  username: string;
  email: string;
  avatarUrl: string | null;
}

interface CreateTeamForm {
  name: string;
  code: string;
  logoUrl: string;
  players: {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    gameId: string;
    avatarUrl: string;
  }[];
}

const PLAYER_ROLES = {
  captain: { label: "Captain", icon: Crown, color: "bg-yellow-500 text-white" },
  entry: { label: "Entry Fragger", icon: Target, color: "bg-red-500 text-white" },
  sniper: { label: "Sniper", icon: Crosshair, color: "bg-purple-500 text-white" },
  support: { label: "Support", icon: Shield, color: "bg-green-500 text-white" },
  player: { label: "Player", icon: Users, color: "bg-blue-500 text-white" },
};

export default function Teams() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateTeamForm>({
    name: "",
    code: "",
    logoUrl: "",
    players: []
  });
  
  const [playerForm, setPlayerForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "player",
    gameId: "",
    avatarUrl: ""
  });

  // Fetch teams
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (data: CreateTeamForm) => {
      return apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setShowCreateModal(false);
      setCreateForm({ name: "", code: "", logoUrl: "", players: [] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    },
  });

  // Add player mutation
  const addPlayerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", `/api/teams/${selectedTeamId}/players`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Player added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: [`/api/teams/${selectedTeamId}/members`] });
      setShowAddPlayerModal(false);
      resetPlayerForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add player",
        variant: "destructive",
      });
    },
  });

  // Generate random team code
  const generateTeamCode = () => {
    const code = `FF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setCreateForm(prev => ({ ...prev, code }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Logo must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Convert to base64 for demo purposes
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle player avatar upload
  const handlePlayerAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset player form
  const resetPlayerForm = () => {
    setPlayerForm({
      username: "",
      email: "",
      phone: "",
      role: "player",
      gameId: "",
      avatarUrl: ""
    });
    setEditingPlayerId(null);
  };

  // Add player to create form
  const handleAddPlayerToCreate = () => {
    if (!playerForm.username.trim() || !playerForm.gameId.trim()) {
      toast({
        title: "Error",
        description: "Username and Game ID are required",
        variant: "destructive",
      });
      return;
    }
    
    const newPlayer = {
      id: editingPlayerId || Date.now().toString(),
      ...playerForm
    };
    
    if (editingPlayerId) {
      setCreateForm(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === editingPlayerId ? newPlayer : p)
      }));
    } else {
      setCreateForm(prev => ({
        ...prev,
        players: [...prev.players, newPlayer]
      }));
    }
    
    resetPlayerForm();
  };

  // Add player to existing team
  const handleAddPlayerToTeam = () => {
    if (!playerForm.username.trim() || !playerForm.gameId.trim()) {
      toast({
        title: "Error",
        description: "Username and Game ID are required",
        variant: "destructive",
      });
      return;
    }
    addPlayerMutation.mutate({
      username: playerForm.username,
      email: playerForm.email,
      phone: playerForm.phone,
      role: playerForm.role,
      gameId: playerForm.gameId,
      avatarUrl: playerForm.avatarUrl
    });
  };

  // Remove player from create form
  const removePlayerFromCreate = (playerId: string) => {
    setCreateForm(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
  };

  // Edit player in create form
  const editPlayerInCreate = (player: any) => {
    setPlayerForm({
      username: player.username,
      email: player.email,
      phone: player.phone,
      role: player.role,
      gameId: player.gameId,
      avatarUrl: player.avatarUrl
    });
    setEditingPlayerId(player.id);
  };

  // Handle create team
  const handleCreateTeam = () => {
    if (!createForm.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!createForm.code) {
      generateTeamCode();
    }
    
    createTeamMutation.mutate(createForm);
  };

  // Copy team code
  const copyTeamCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Team code copied to clipboard",
    });
  };

  // Get role icon and color
  const getRoleIcon = (role: string) => {
    const roleData = PLAYER_ROLES[role as keyof typeof PLAYER_ROLES];
    return roleData ? roleData.icon : Users;
  };

  const getRoleColor = (role: string) => {
    const roleData = PLAYER_ROLES[role as keyof typeof PLAYER_ROLES];
    return roleData ? roleData.color : "bg-gray-500 text-white";
  };

  const getRoleLabel = (role: string) => {
    const roleData = PLAYER_ROLES[role as keyof typeof PLAYER_ROLES];
    return roleData ? roleData.label : role;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <UserHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Teams
            </h1>
            <p className="text-gray-600 text-lg">
              Create and manage your esports teams
            </p>
          </div>

          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Create Team</DialogTitle>
                <DialogDescription>
                  Create a new team and add players to it.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Team Logo and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>Team Logo</Label>
                    <div className="relative">
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                        {createForm.logoUrl ? (
                          <img 
                            src={createForm.logoUrl} 
                            alt="Team logo" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Upload Team Logo</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input
                        id="teamName"
                        placeholder="Enter team name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="teamCode">Team Code</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="teamCode"
                          placeholder="Auto-generated"
                          value={createForm.code}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateTeamCode}
                          className="px-3"
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Player Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowAddPlayerModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Player
                  </Button>
                </div>

                {/* Team Members */}
                {createForm.players.length > 0 && (
                  <div className="space-y-3">
                    <Label>Team Members ({createForm.players.length})</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {createForm.players.map((player) => {
                        const RoleIcon = getRoleIcon(player.role);
                        return (
                          <div
                            key={player.id}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={player.avatarUrl} />
                              <AvatarFallback>
                                {player.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{player.username}</span>
                                <Badge className={`${getRoleColor(player.role)} text-xs`}>
                                  <RoleIcon className="w-3 h-3 mr-1" />
                                  {getRoleLabel(player.role)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{player.gameId}</p>
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editPlayerInCreate(player)}
                                className="p-1"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removePlayerFromCreate(player.id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTeam}
                    disabled={createTeamMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams yet</h3>
              <p className="text-gray-500 mb-4">Create your first team to get started</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <TeamCard 
                key={team.id} 
                team={team} 
                onAddPlayer={(teamId) => {
                  setSelectedTeamId(teamId);
                  setShowAddPlayerModal(true);
                }} 
              />
            ))}
          </div>
        )}

        {/* Add Player Modal */}
        <Dialog open={showAddPlayerModal} onOpenChange={(open) => {
          setShowAddPlayerModal(open);
          if (!open) {
            resetPlayerForm();
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <span>{editingPlayerId ? "Edit Player" : "Add Player"}</span>
              </DialogTitle>
              <DialogDescription>
                {editingPlayerId ? "Edit player details" : "Add a new player to the team"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Player Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                    {playerForm.avatarUrl ? (
                      <img 
                        src={playerForm.avatarUrl} 
                        alt="Player avatar" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePlayerAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Player Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="playerName">Player Name</Label>
                  <Input
                    id="playerName"
                    placeholder="Enter player name"
                    value={playerForm.username}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="playerGameId">Player Game ID</Label>
                    <Input
                      id="playerGameId"
                      placeholder="Game ID"
                      value={playerForm.gameId}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, gameId: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="playerRole">Player Role</Label>
                    <Select value={playerForm.role} onValueChange={(value) => setPlayerForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PLAYER_ROLES).map(([key, role]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center space-x-2">
                              <role.icon className="w-4 h-4" />
                              <span>{role.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="playerEmail">Player Email</Label>
                    <Input
                      id="playerEmail"
                      type="email"
                      placeholder="Email"
                      value={playerForm.email}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="playerPhone">Player Phone</Label>
                    <Input
                      id="playerPhone"
                      placeholder="Phone"
                      value={playerForm.phone}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={selectedTeamId ? handleAddPlayerToTeam : handleAddPlayerToCreate}
                  disabled={addPlayerMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {addPlayerMutation.isPending ? "Adding..." : "Add Player"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// Team Card Component
function TeamCard({ team, onAddPlayer }: { team: Team; onAddPlayer: (teamId: number) => void }) {
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: [`/api/teams/${team.id}/members`],
    enabled: !!team.id,
    staleTime: 30000,
    retry: 1,
  });

  // Edit team form state
  const [editForm, setEditForm] = useState({
    name: team.name,
    code: team.code,
    logoUrl: team.logoUrl || "",
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/teams/${team.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setShowDeleteConfirm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team",
        variant: "destructive",
      });
    },
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", `/api/teams/${team.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setShowEditModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update team",
        variant: "destructive",
      });
    },
  });

  const copyTeamCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Team code copied to clipboard",
    });
  };

  const handleEditTeam = () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }
    updateTeamMutation.mutate(editForm);
  };

  const handleDeleteTeam = () => {
    deleteTeamMutation.mutate();
  };

  const handleEditLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Logo must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = PLAYER_ROLES[role as keyof typeof PLAYER_ROLES];
    return roleData ? roleData.icon : Users;
  };

  const getRoleColor = (role: string) => {
    const roleData = PLAYER_ROLES[role as keyof typeof PLAYER_ROLES];
    return roleData ? roleData.color : "bg-gray-500 text-white";
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white">
      <CardHeader className="pb-3">
        {/* Team Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={team.logoUrl} />
              <AvatarFallback className="bg-blue-600 text-white">
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 font-mono">{team.code}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyTeamCode(team.code)}
                  className="p-1 h-6 w-6"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Three Dot Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Team
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Team Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{members.length}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">₹{team.totalEarnings}</p>
            <p className="text-xs text-gray-500">Earnings</p>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Gamepad2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{team.matchesPlayed}</p>
            <p className="text-xs text-gray-500">Matches</p>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{team.winRate}%</p>
            <p className="text-xs text-gray-500">Win Rate</p>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-gray-700">Team Members</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddPlayer(team.id)}
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {members.length > 0 ? (
              members.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <div key={member.id} className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {member.username?.charAt(0)?.toUpperCase() || member.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Role Badge */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getRoleColor(member.role)} flex items-center justify-center`}>
                      <RoleIcon className="w-2 h-2" />
                    </div>
                  </div>
                );
              })
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddPlayer(team.id)}
                className="h-8 w-8 p-0 border-dashed"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Edit Team Modal */}
    <>
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="w-5 h-5 text-blue-600" />
            <span>Edit Team</span>
          </DialogTitle>
          <DialogDescription>
            Update your team information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                {editForm.logoUrl ? (
                  <img 
                    src={editForm.logoUrl} 
                    alt="Team logo" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTeamName">Team Name</Label>
              <Input
                id="editTeamName"
                placeholder="Enter team name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="editTeamCode">Team Code</Label>
              <Input
                id="editTeamCode"
                placeholder="Team code"
                value={editForm.code}
                onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Team code cannot be changed</p>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTeam}
              disabled={updateTeamMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateTeamMutation.isPending ? "Updating..." : "Update Team"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* View Team Modal */}
    <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={team.logoUrl} />
              <AvatarFallback className="bg-blue-600 text-white">
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">{team.name}</div>
              <div className="text-sm text-gray-500">Team Code: {team.code}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">{members.length}</p>
              <p className="text-sm text-gray-500">Members</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">₹{team.totalEarnings}</p>
              <p className="text-sm text-gray-500">Earnings</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">{team.matchesPlayed}</p>
              <p className="text-sm text-gray-500">Matches</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">{team.winRate}%</p>
              <p className="text-sm text-gray-500">Win Rate</p>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Team Members ({members.length})</Label>
            <div className="space-y-3">
              {members.length > 0 ? (
                members.map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg border"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback>
                          {member.username?.charAt(0)?.toUpperCase() || member.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{member.username || member.email}</span>
                          <Badge className={`${getRoleColor(member.role)} text-xs`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge>
                          {member.userId === team.captainId && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Game ID: {member.gameId || "Not provided"}</p>
                        {member.contactInfo && (
                          <p className="text-sm text-gray-500">Contact: {member.contactInfo}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No members in this team yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowViewModal(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => copyTeamCode(team.code)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Team Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span>Delete Team</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{team.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTeam}
            disabled={deleteTeamMutation.isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
