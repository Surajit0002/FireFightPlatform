import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, Plus } from "lucide-react";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamModal({ isOpen, onClose }: TeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; code: string }) => {
      await apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      onClose();
      setTeamName("");
      setTeamCode("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTeamCode(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim()) {
      toast({
        title: "Invalid Team Name",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    if (!teamCode.trim() || teamCode.length < 4) {
      toast({
        title: "Invalid Team Code",
        description: "Team code must be at least 4 characters",
        variant: "destructive",
      });
      return;
    }

    createTeamMutation.mutate({
      name: teamName.trim(),
      code: teamCode.trim().toUpperCase(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 fire-blue" />
            <span>Create New Team</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              maxLength={50}
              required
            />
          </div>

          <div>
            <Label htmlFor="teamCode">Team Code</Label>
            <div className="flex space-x-2">
              <Input
                id="teamCode"
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                placeholder="TEAM123"
                maxLength={10}
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateCode}
                className="px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Team code will be used to invite members
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">Team Features:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Participate in squad tournaments</li>
              <li>• Share team statistics and earnings</li>
              <li>• Coordinate with team members</li>
              <li>• Track team performance</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-fire-blue hover:bg-blue-600 text-white"
              disabled={createTeamMutation.isPending}
            >
              {createTeamMutation.isPending ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
