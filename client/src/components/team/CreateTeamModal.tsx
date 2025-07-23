
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Upload, 
  Users, 
  Crown, 
  Shield, 
  Target, 
  Crosshair, 
  Edit,
  X,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Player {
  id: string;
  username: string;
  role: string;
  email: string;
  phone: string;
  gameId: string;
  avatarUrl: string;
}

const PLAYER_ROLES = {
  captain: { label: "Captain", icon: Crown, color: "bg-yellow-500 text-white" },
  entry: { label: "Entry Fragger", icon: Target, color: "bg-red-500 text-white" },
  sniper: { label: "Sniper", icon: Crosshair, color: "bg-purple-500 text-white" },
  support: { label: "Support", icon: Shield, color: "bg-green-500 text-white" },
  player: { label: "Player", icon: Users, color: "bg-blue-500 text-white" },
};

export default function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamLogo, setTeamLogo] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const [playerForm, setPlayerForm] = useState({
    username: "",
    role: "player",
    email: "",
    phone: "",
    gameId: "",
    avatarUrl: ""
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      toast({
        title: "Team Created Successfully!",
        description: "Your team is ready for tournaments",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setCurrentStep(1);
    setTeamName("");
    setTeamCode("");
    setTeamLogo("");
    setPlayers([]);
    setShowAddPlayerModal(false);
    setEditingPlayer(null);
    resetPlayerForm();
    onClose();
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      username: "",
      role: "player",
      email: "",
      phone: "",
      gameId: "",
      avatarUrl: ""
    });
  };

  const generateTeamCode = () => {
    const code = `FF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTeamCode(code);
  };

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const addPlayer = () => {
    if (!playerForm.username.trim() || !playerForm.gameId.trim()) {
      toast({
        title: "Error",
        description: "Username and Game ID are required",
        variant: "destructive",
      });
      return;
    }

    if (players.length >= 6) {
      toast({
        title: "Team Full",
        description: "Maximum 6 players allowed per team",
        variant: "destructive",
      });
      return;
    }

    const newPlayer: Player = {
      id: editingPlayer?.id || Date.now().toString(),
      ...playerForm
    };

    if (editingPlayer) {
      setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? newPlayer : p));
    } else {
      setPlayers(prev => [...prev, newPlayer]);
    }

    setShowAddPlayerModal(false);
    setEditingPlayer(null);
    resetPlayerForm();
  };

  const editPlayer = (player: Player) => {
    setEditingPlayer(player);
    setPlayerForm({
      username: player.username,
      role: player.role,
      email: player.email,
      phone: player.phone,
      gameId: player.gameId,
      avatarUrl: player.avatarUrl
    });
    setShowAddPlayerModal(true);
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const handleSubmit = () => {
    if (!teamName.trim()) {
      toast({
        title: "Invalid Team Name",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    if (players.length < 2) {
      toast({
        title: "Not Enough Players",
        description: "Minimum 2 players required to create a team",
        variant: "destructive",
      });
      return;
    }

    createTeamMutation.mutate({
      name: teamName.trim(),
      code: teamCode || `FF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      logoUrl: teamLogo,
      players: players
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && !teamName.trim()) {
      toast({
        title: "Team Name Required",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && !teamCode) {
      generateTeamCode();
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Team Information</h3>
              <p className="text-sm text-gray-500 mb-4">Set up your team details and logo</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    maxLength={24}
                  />
                  <p className="text-xs text-gray-500 mt-1">({teamName.length}/24)</p>
                </div>

                <div>
                  <Label htmlFor="teamCode">Team Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="teamCode"
                      placeholder="Auto-generated"
                      value={teamCode}
                      onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
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

              <div className="space-y-2">
                <Label>Team Logo</Label>
                <div className="relative">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors mx-auto">
                    {teamLogo ? (
                      <img 
                        src={teamLogo} 
                        alt="Team logo" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload Logo</p>
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Add Players</h3>
              <p className="text-sm text-gray-500 mb-4">Build your team roster (2-6 players required)</p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => setShowAddPlayerModal(true)}
                variant="outline"
                className="w-full border-dashed border-2 py-8"
                disabled={players.length >= 6}
              >
                <Plus className="w-4 h-4 mr-2" />
                {players.length >= 6 ? "Maximum Players Reached" : "Add Player"}
              </Button>

              {players.length > 0 && (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {players.map((player) => {
                    const RoleIcon = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.icon || Users;
                    const roleColor = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.color || "bg-gray-500 text-white";
                    
                    return (
                      <div
                        key={player.id}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={player.avatarUrl} />
                          <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{player.username}</span>
                            <Badge className={`${roleColor} text-xs`}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.label || player.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{player.gameId}</p>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => editPlayer(player)}
                            className="p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePlayer(player.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Team Preview</h3>
              <p className="text-sm text-gray-500 mb-4">Review your team details before creating</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage src={teamLogo} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                    {teamName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{teamName}</h4>
                  <p className="text-sm text-gray-600">Code: <span className="font-mono bg-white px-2 py-1 rounded">{teamCode}</span></p>
                  <p className="text-sm text-gray-600">{players.length} players added</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {players.map((player) => {
                  const RoleIcon = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.icon || Users;
                  const roleColor = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.color || "bg-gray-500 text-white";
                  
                  return (
                    <div key={player.id} className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={player.avatarUrl} />
                        <AvatarFallback className="text-xs">{player.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{player.username}</p>
                        <Badge className={`${roleColor} text-xs inline-flex items-center`}>
                          <RoleIcon className="w-2.5 h-2.5 mr-1" />
                          {PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.label || player.role}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Create New Team</span>
              <Badge variant="outline" className="ml-auto">
                Step {currentStep}/3
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Create a new esports team and add players to compete in tournaments
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {renderStep()}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? handleClose : prevStep}
              className="flex items-center space-x-2"
            >
              {currentStep === 1 ? (
                <X className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
              <span>{currentStep === 1 ? "Cancel" : "Back"}</span>
            </Button>

            <Button
              onClick={currentStep === 3 ? handleSubmit : nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              disabled={createTeamMutation.isPending}
            >
              <span>
                {currentStep === 3 
                  ? (createTeamMutation.isPending ? "Creating..." : "Create Team")
                  : "Next"
                }
              </span>
              {currentStep < 3 && <ChevronRight className="w-4 h-4" />}
              {currentStep === 3 && <CheckCircle className="w-4 h-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Player Modal */}
      <Dialog open={showAddPlayerModal} onOpenChange={(open) => {
        setShowAddPlayerModal(open);
        if (!open) {
          resetPlayerForm();
          setEditingPlayer(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>{editingPlayer ? "Edit Player" : "Add Player"}</span>
            </DialogTitle>
            <DialogDescription>
              {editingPlayer ? "Edit player details" : "Add a new player to your team"}
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
                <Label htmlFor="playerName">Player Name *</Label>
                <Input
                  id="playerName"
                  placeholder="Enter player name"
                  value={playerForm.username}
                  onChange={(e) => setPlayerForm(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="playerGameId">Game ID *</Label>
                  <Input
                    id="playerGameId"
                    placeholder="Game ID"
                    value={playerForm.gameId}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, gameId: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="playerRole">Role</Label>
                  <select
                    id="playerRole"
                    value={playerForm.role}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    {Object.entries(PLAYER_ROLES).map(([key, role]) => (
                      <option key={key} value={key}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="playerEmail">Email</Label>
                  <Input
                    id="playerEmail"
                    type="email"
                    placeholder="Email"
                    value={playerForm.email}
                    onChange={(e) => setPlayerForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="playerPhone">Phone</Label>
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
                onClick={addPlayer}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingPlayer ? "Update Player" : "Add Player"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
