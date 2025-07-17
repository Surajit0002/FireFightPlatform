import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import UserHeader from "@/components/layout/UserHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Trophy, 
  UserPlus,
  Crown,
  Target,
  Shield,
  Crosshair
} from "lucide-react";

interface Team {
  id: number;
  name: string;
  code: string;
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
  players: {
    username: string;
    email: string;
    role: string;
    gameId: string;
    contactInfo: string;
  }[];
}

export default function Teams() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateTeamForm>({
    name: "",
    players: []
  });
  
  const [playerForm, setPlayerForm] = useState({
    username: "",
    email: "",
    role: "player",
    gameId: "",
    contactInfo: ""
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
      setCreateForm({ name: "", players: [] });
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
      setPlayerForm({ username: "", email: "", role: "player", gameId: "", contactInfo: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add player",
        variant: "destructive",
      });
    },
  });

  const handleCreateTeam = () => {
    if (!createForm.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }
    createTeamMutation.mutate(createForm);
  };

  const handleAddPlayerToCreate = () => {
    if (!playerForm.username.trim() || !playerForm.email.trim()) {
      toast({
        title: "Error",
        description: "Username and email are required",
        variant: "destructive",
      });
      return;
    }
    
    setCreateForm(prev => ({
      ...prev,
      players: [...prev.players, { ...playerForm }]
    }));
    
    setPlayerForm({ username: "", email: "", role: "player", gameId: "", contactInfo: "" });
  };

  const handleAddPlayerToTeam = () => {
    if (!playerForm.username.trim() || !playerForm.email.trim()) {
      toast({
        title: "Error",
        description: "Username and email are required",
        variant: "destructive",
      });
      return;
    }
    addPlayerMutation.mutate(playerForm);
  };

  const removePlayerFromCreate = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "captain":
        return <Crown className="w-4 h-4" />;
      case "sniper":
        return <Crosshair className="w-4 h-4" />;
      case "support":
        return <Shield className="w-4 h-4" />;
      case "entry":
        return <Target className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "captain":
        return "bg-yellow-500";
      case "sniper":
        return "bg-red-500";
      case "support":
        return "bg-green-500";
      case "entry":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
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
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
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
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Create a new team and add players to it.
                </DialogDescription>
              </DialogHeader>
              
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

                {/* Players List */}
                {createForm.players.length > 0 && (
                  <div>
                    <Label>Players ({createForm.players.length})</Label>
                    <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                      {createForm.players.map((player, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(player.role)}
                            <span className="font-medium">{player.username}</span>
                            <Badge variant="secondary" className="text-xs">
                              {player.role}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePlayerFromCreate(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Player Form */}
                <div className="border-t pt-4">
                  <Label>Add Player</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      placeholder="Username"
                      value={playerForm.username}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, username: e.target.value }))}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={playerForm.email}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={playerForm.role}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="player">Player</option>
                      <option value="captain">Captain</option>
                      <option value="sniper">Sniper</option>
                      <option value="support">Support</option>
                      <option value="entry">Entry</option>
                    </select>
                    <Input
                      placeholder="Game ID"
                      value={playerForm.gameId}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, gameId: e.target.value }))}
                    />
                  </div>
                  <Input
                    className="mt-2"
                    placeholder="Contact Info"
                    value={playerForm.contactInfo}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, contactInfo: e.target.value }))}
                  />
                  <Button
                    className="w-full mt-2"
                    variant="outline"
                    onClick={handleAddPlayerToCreate}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Player
                  </Button>
                </div>

                <div className="flex space-x-2 pt-4">
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
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
        <Dialog open={showAddPlayerModal} onOpenChange={setShowAddPlayerModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Player to Team</DialogTitle>
              <DialogDescription>
                Add a new player to this team.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Username"
                    value={playerForm.username}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={playerForm.email}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={playerForm.role}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="player">Player</option>
                    <option value="captain">Captain</option>
                    <option value="sniper">Sniper</option>
                    <option value="support">Support</option>
                    <option value="entry">Entry</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="gameId">Game ID</Label>
                  <Input
                    id="gameId"
                    placeholder="Game ID"
                    value={playerForm.gameId}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, gameId: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="contactInfo">Contact Info</Label>
                <Input
                  id="contactInfo"
                  placeholder="Contact Info"
                  value={playerForm.contactInfo}
                  onChange={(e) => setPlayerForm(prev => ({ ...prev, contactInfo: e.target.value }))}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPlayerToTeam}
                  disabled={addPlayerMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
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
  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: [`/api/teams/${team.id}/members`],
    enabled: !!team.id,
    staleTime: 30000,
    retry: 1,
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "captain":
        return <Crown className="w-3 h-3" />;
      case "sniper":
        return <Crosshair className="w-3 h-3" />;
      case "support":
        return <Shield className="w-3 h-3" />;
      case "entry":
        return <Target className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "captain":
        return "bg-yellow-500";
      case "sniper":
        return "bg-red-500";
      case "support":
        return "bg-green-500";
      case "entry":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{team.name}</CardTitle>
            <p className="text-sm text-gray-500 font-mono">{team.code}</p>
          </div>
          <Badge variant="secondary">{members.length} members</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div>
            <p className="text-lg font-bold text-green-600">{team.winRate}%</p>
            <p className="text-xs text-gray-500">Win Rate</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">₹{team.totalEarnings}</p>
            <p className="text-xs text-gray-500">Earnings</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600">{team.matchesPlayed}</p>
            <p className="text-xs text-gray-500">Matches</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Members</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddPlayer(team.id)}
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-2 p-1">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={member.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.username?.charAt(0)?.toUpperCase() || member.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm flex-1 truncate">{member.username || member.email}</span>
                <div className={`w-3 h-3 rounded-full ${getRoleColor(member.role)} flex items-center justify-center`}>
                  {getRoleIcon(member.role)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Trophy className="w-3 h-3 mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}