
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Plus, 
  Upload, 
  Camera, 
  X, 
  Copy, 
  CheckCircle,
  Crown,
  Shield,
  Target,
  Crosshair,
  Zap,
  Brain,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Gamepad2,
  Edit,
  Trash2
} from "lucide-react";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Player {
  id: string;
  avatar?: string;
  username: string;
  role: string;
  email?: string;
  phone?: string;
  gameId: string;
}

const PLAYER_ROLES = {
  captain: { label: "Captain", icon: Crown, color: "bg-yellow-500" },
  igl: { label: "IGL", icon: Shield, color: "bg-blue-500" },
  entry: { label: "Entry Fragger", icon: Zap, color: "bg-red-500" },
  sniper: { label: "Sniper", icon: Target, color: "bg-purple-500" },
  support: { label: "Support", icon: Users, color: "bg-green-500" },
  scout: { label: "Scout", icon: Brain, color: "bg-orange-500" },
};

export default function TeamModal({ isOpen, onClose }: TeamModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Player form states
  const [playerForm, setPlayerForm] = useState({
    avatar: null as File | null,
    avatarPreview: "",
    username: "",
    role: "",
    email: "",
    phone: "",
    gameId: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; code: string; logoUrl?: string; players: Player[] }) => {
      await apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      toast({
        title: "🎉 Team Created Successfully!",
        description: "Your team is ready for tournaments",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setCurrentStep(1);
    setTeamName("");
    setTeamCode("");
    setTeamLogo(null);
    setTeamLogoPreview("");
    setPlayers([]);
    setShowPlayerModal(false);
    setEditingPlayer(null);
    resetPlayerForm();
    onClose();
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      avatar: null,
      avatarPreview: "",
      username: "",
      role: "",
      email: "",
      phone: "",
      gameId: ""
    });
  };

  const generateCode = () => {
    const code = `FF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTeamCode(code);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      setTeamLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setTeamLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePlayerAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlayerForm(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = (e) => setPlayerForm(prev => ({ 
        ...prev, 
        avatarPreview: e.target?.result as string 
      }));
      reader.readAsDataURL(file);
    }
  };

  const addPlayer = () => {
    if (!playerForm.username || !playerForm.role || !playerForm.gameId) {
      toast({
        title: "Missing Information",
        description: "Please fill in username, role, and game ID",
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
      avatar: playerForm.avatarPreview,
      username: playerForm.username,
      role: playerForm.role,
      email: playerForm.email,
      phone: playerForm.phone,
      gameId: playerForm.gameId
    };

    if (editingPlayer) {
      setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? newPlayer : p));
    } else {
      setPlayers(prev => [...prev, newPlayer]);
    }

    setShowPlayerModal(false);
    setEditingPlayer(null);
    resetPlayerForm();
  };

  const editPlayer = (player: Player) => {
    setEditingPlayer(player);
    setPlayerForm({
      avatar: null,
      avatarPreview: player.avatar || "",
      username: player.username,
      role: player.role,
      email: player.email || "",
      phone: player.phone || "",
      gameId: player.gameId
    });
    setShowPlayerModal(true);
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
      logoUrl: teamLogoPreview,
      players
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && !teamLogoPreview) {
      toast({
        title: "Logo Required",
        description: "Please upload a team logo",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && !teamName.trim()) {
      toast({
        title: "Team Name Required",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 3 && !teamCode) {
      generateCode();
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
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
              <h3 className="text-lg font-semibold mb-2">Upload Team Logo</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a logo that represents your team</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                  {teamLogoPreview ? (
                    <img src={teamLogoPreview} alt="Team logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Upload Logo</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Maximum size: 5MB</p>
                <p>Formats: JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Team Name</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a unique name for your team</p>
            </div>
            
            <div>
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                maxLength={24}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be unique. No special characters. ({teamName.length}/24)
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Team Code</h3>
              <p className="text-sm text-gray-500 mb-4">Auto-generated code for inviting members</p>
            </div>
            
            <div>
              <Label htmlFor="teamCode">Team Code</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="teamCode"
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  placeholder="FF-ABC123"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  className="px-3"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(teamCode);
                    toast({ title: "Copied!", description: "Team code copied to clipboard" });
                  }}
                  className="px-3"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Add Players</h3>
              <p className="text-sm text-gray-500 mb-4">Build your team roster (2-6 players)</p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => setShowPlayerModal(true)}
                variant="outline"
                className="w-full border-dashed border-2"
                disabled={players.length >= 6}
              >
                <Plus className="w-4 h-4 mr-2" />
                {players.length >= 6 ? "Maximum Players Reached" : "Add Player"}
              </Button>

              {players.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {players.map((player) => {
                    const RoleIcon = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.icon || User;
                    const roleColor = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.color || "bg-gray-500";
                    
                    return (
                      <Card key={player.id} className="p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{player.username}</span>
                              <Badge className={`${roleColor} text-white text-xs`}>
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
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removePlayer(player.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Team Preview</h3>
              <p className="text-sm text-gray-500 mb-4">Review your team details before creating</p>
            </div>
            
            <Card className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={teamLogoPreview} />
                  <AvatarFallback>{teamName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-lg font-semibold">{teamName}</h4>
                  <p className="text-sm text-gray-500">Code: {teamCode}</p>
                  <p className="text-sm text-gray-500">{players.length} players</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {players.map((player) => {
                  const RoleIcon = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.icon || User;
                  const roleColor = PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.color || "bg-gray-500";
                  
                  return (
                    <div key={player.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback className="text-xs">{player.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{player.username}</p>
                        <div className={`inline-flex items-center px-1 py-0.5 rounded text-xs text-white ${roleColor}`}>
                          <RoleIcon className="w-2.5 h-2.5 mr-1" />
                          {PLAYER_ROLES[player.role as keyof typeof PLAYER_ROLES]?.label || player.role}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-fire-blue" />
              <span>Create New Team</span>
              <Badge variant="outline" className="ml-auto">
                Step {currentStep}/5
              </Badge>
            </DialogTitle>
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
              onClick={currentStep === 5 ? handleSubmit : nextStep}
              className="bg-fire-blue hover:bg-blue-600 text-white flex items-center space-x-2"
              disabled={createTeamMutation.isPending}
            >
              <span>
                {currentStep === 5 
                  ? (createTeamMutation.isPending ? "Creating..." : "Create Team")
                  : "Next"
                }
              </span>
              {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
              {currentStep === 5 && <CheckCircle className="w-4 h-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Player Modal */}
      <Dialog open={showPlayerModal} onOpenChange={setShowPlayerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-fire-blue" />
              <span>{editingPlayer ? "Edit Player" : "Add Player"}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Player Avatar */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={playerForm.avatarPreview} />
                  <AvatarFallback>
                    {playerForm.username ? playerForm.username.charAt(0).toUpperCase() : <Upload className="w-6 h-6" />}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePlayerAvatarUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500">Click to upload avatar</p>
            </div>

            {/* Player Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="playerUsername">Username *</Label>
                <Input
                  id="playerUsername"
                  value={playerForm.username}
                  onChange={(e) => setPlayerForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Player username"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="playerRole">Role *</Label>
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

              <div className="col-span-2">
                <Label htmlFor="playerGameId">Game ID *</Label>
                <Input
                  id="playerGameId"
                  value={playerForm.gameId}
                  onChange={(e) => setPlayerForm(prev => ({ ...prev, gameId: e.target.value }))}
                  placeholder="In-game ID"
                />
              </div>

              <div>
                <Label htmlFor="playerEmail">Email</Label>
                <Input
                  id="playerEmail"
                  type="email"
                  value={playerForm.email}
                  onChange={(e) => setPlayerForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="player@email.com"
                />
              </div>

              <div>
                <Label htmlFor="playerPhone">Phone</Label>
                <Input
                  id="playerPhone"
                  value={playerForm.phone}
                  onChange={(e) => setPlayerForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPlayerModal(false);
                  setEditingPlayer(null);
                  resetPlayerForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addPlayer}
                className="flex-1 bg-fire-blue hover:bg-blue-600 text-white"
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
