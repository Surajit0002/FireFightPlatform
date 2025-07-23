
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, 
  Camera,
  Crown,
  Shield,
  Target,
  Crosshair,
  Users
} from "lucide-react";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: number | null;
  editingPlayer?: any;
}

const PLAYER_ROLES = {
  captain: { label: "Captain", icon: Crown, color: "bg-yellow-500 text-white" },
  entry: { label: "Entry Fragger", icon: Target, color: "bg-red-500 text-white" },
  sniper: { label: "Sniper", icon: Crosshair, color: "bg-purple-500 text-white" },
  support: { label: "Support", icon: Shield, color: "bg-green-500 text-white" },
  player: { label: "Player", icon: Users, color: "bg-blue-500 text-white" },
};

export default function AddPlayerModal({ isOpen, onClose, teamId, editingPlayer }: AddPlayerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [playerForm, setPlayerForm] = useState({
    username: editingPlayer?.username || "",
    email: editingPlayer?.email || "",
    phone: editingPlayer?.contactInfo || "",
    role: editingPlayer?.role || "player",
    gameId: editingPlayer?.gameId || "",
    avatarUrl: editingPlayer?.avatarUrl || ""
  });

  const addPlayerMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingPlayer) {
        return apiRequest("PUT", `/api/teams/${teamId}/members/${editingPlayer.userId}`, data);
      } else {
        return apiRequest("POST", `/api/teams/${teamId}/players`, data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: editingPlayer ? "Player updated successfully!" : "Player added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: [`/api/teams/${teamId}/members`] });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save player",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setPlayerForm({
      username: "",
      email: "",
      phone: "",
      role: "player",
      gameId: "",
      avatarUrl: ""
    });
    onClose();
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

  const handleSubmit = () => {
    if (!playerForm.username.trim() || !playerForm.gameId.trim()) {
      toast({
        title: "Error",
        description: "Username and Game ID are required",
        variant: "destructive",
      });
      return;
    }

    addPlayerMutation.mutate({
      playerName: playerForm.username,
      email: playerForm.email,
      phone: playerForm.phone,
      role: playerForm.role,
      gameId: playerForm.gameId,
      avatarUrl: playerForm.avatarUrl
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>{editingPlayer ? "Edit Player" : "Add Player"}</span>
          </DialogTitle>
          <DialogDescription>
            {editingPlayer ? "Edit player details" : "Add a new player to the team"}
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
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addPlayerMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {addPlayerMutation.isPending ? "Saving..." : (editingPlayer ? "Update Player" : "Add Player")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
