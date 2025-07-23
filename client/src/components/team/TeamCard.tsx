
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddPlayerModal from "./AddPlayerModal";
import { 
  Users, 
  DollarSign, 
  Gamepad2, 
  Trophy, 
  Plus, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  Copy,
  Crown,
  Shield,
  Target,
  Crosshair,
  Upload,
  Star,
  Mail,
  Phone
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
  profileImageUrl?: string | null;
}

interface TeamCardProps {
  team: Team;
  onAddPlayer: (teamId: number) => void;
  onEditMember?: (member: TeamMember) => void;
}

const PLAYER_ROLES = {
  captain: { label: "Captain", icon: Crown, color: "bg-yellow-500 text-white" },
  entry: { label: "Entry Fragger", icon: Target, color: "bg-red-500 text-white" },
  sniper: { label: "Sniper", icon: Crosshair, color: "bg-purple-500 text-white" },
  support: { label: "Support", icon: Shield, color: "bg-green-500 text-white" },
  player: { label: "Player", icon: Users, color: "bg-blue-500 text-white" },
};

export default function TeamCard({ team, onAddPlayer, onEditMember }: TeamCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<TeamMember | null>(null);

  const { data: members = [] } = useQuery<TeamMember[]>({
    queryKey: [`/api/teams/${team.id}/members`],
    enabled: !!team.id,
  });

  const [editForm, setEditForm] = useState({
    name: team.name,
    code: team.code,
    logoUrl: team.logoUrl || "",
  });

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
    <>
      <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        {/* Gradient Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
        
        <CardHeader className="relative pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-14 h-14 border-3 border-white shadow-xl ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                  <AvatarImage src={team.logoUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg">
                    {team.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {team.isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {team.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded-full">{team.code}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyTeamCode(team.code)}
                    className="p-1 h-6 w-6 hover:bg-blue-100"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Team
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
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

        <CardContent className="relative space-y-6">
          {/* Enhanced Team Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Users, label: "Members", value: members.length, color: "from-blue-500 to-blue-600" },
              { icon: DollarSign, label: "Earnings", value: `₹${team.totalEarnings}`, color: "from-green-500 to-green-600" },
              { icon: Gamepad2, label: "Matches", value: team.matchesPlayed, color: "from-purple-500 to-purple-600" },
              { icon: Trophy, label: "Win Rate", value: `${team.winRate}%`, color: "from-yellow-500 to-orange-500" }
            ].map((stat, index) => (
              <div key={index} className="relative overflow-hidden bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group/stat">
                <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-4 translate-x-4 group-hover/stat:scale-150 transition-transform duration-300`} />
                <div className="relative z-10">
                  <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-2 shadow-sm`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Team Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-gray-700">Team Roster</h4>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 text-xs">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingPlayer(null);
                  setShowAddPlayerModal(true);
                }}
                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {members.length > 0 ? (
                members.map((member, index) => {
                  const RoleIcon = getRoleIcon(member.role);
                  const gradients = [
                    'from-blue-500 to-cyan-500',
                    'from-purple-500 to-pink-500',
                    'from-green-500 to-teal-500',
                    'from-orange-500 to-red-500',
                    'from-indigo-500 to-purple-500'
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <div key={member.id} className="relative group/member">
                      <div className="relative">
                        <Avatar className="w-10 h-10 cursor-pointer border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                          <AvatarImage 
                            src={member.avatarUrl || member.profileImageUrl || undefined} 
                            alt={member.username || member.email}
                            onError={(e) => {
                              console.log('Avatar failed to load for member:', member.username, 'URLs:', {
                                avatarUrl: member.avatarUrl ? `${member.avatarUrl.substring(0, 50)}...` : 'null',
                                profileImageUrl: member.profileImageUrl ? `${member.profileImageUrl.substring(0, 50)}...` : 'null'
                              });
                            }}
                            onLoad={() => {
                              console.log('Avatar loaded successfully for:', member.username);
                            }}
                          />
                          <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-bold text-sm`}>
                            {(member.username?.charAt(0) || member.email.charAt(0)).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Role Badge */}
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${getRoleColor(member.role)} flex items-center justify-center border-2 border-white shadow-md`}>
                          <RoleIcon className="w-2.5 h-2.5" />
                        </div>

                        {/* Captain Crown */}
                        {member.userId === team.captainId && (
                          <div className="absolute -top-2 -left-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                            <Crown className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Edit Button - shows on hover */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingPlayer(member);
                          setShowAddPlayerModal(true);
                        }}
                        className="absolute -bottom-1 -left-1 w-4 h-4 p-0 bg-white border border-gray-300 rounded-full opacity-0 group-hover/member:opacity-100 transition-opacity hover:bg-gray-50"
                      >
                        <Edit className="w-2 h-2 text-gray-600" />
                      </Button>

                      {/* Tooltip */}
                      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover/member:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {member.username || member.email}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-800" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPlayer(null);
                    setShowAddPlayerModal(true);
                  }}
                  className="h-10 w-10 p-0 border-dashed border-2 hover:border-blue-400 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </Button>
              )}
            </div>
          </div>

          {/* Achievement Badge */}
          {team.winRate > 70 && (
            <div className="flex items-center justify-center">
              <Badge className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-3 py-1 text-xs font-bold shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                High Performer
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Team Modal */}
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

      {/* View Team Modal - Enhanced */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-4 border-white shadow-2xl">
                  <AvatarImage src={team.logoUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-xl font-bold">
                    {team.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  {team.name}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600 font-medium">Team Code:</span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-mono text-sm px-3 py-1">
                    {team.code}
                  </Badge>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              View detailed information about your team including stats and members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pt-6">
            {/* Enhanced Team Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Members", value: members.length, color: "from-blue-500 to-blue-700", bg: "bg-blue-500" },
                { icon: DollarSign, label: "Earnings", value: `₹${team.totalEarnings}`, color: "from-green-500 to-green-700", bg: "bg-green-500" },
                { icon: Gamepad2, label: "Matches", value: team.matchesPlayed, color: "from-purple-500 to-purple-700", bg: "bg-purple-500" },
                { icon: Trophy, label: "Win Rate", value: `${team.winRate}%`, color: "from-yellow-500 to-red-500", bg: "bg-gradient-to-r from-yellow-500 to-red-500" }
              ].map((stat, index) => (
                <div key={index} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Members Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Team Roster</h3>
                  <p className="text-gray-600">Elite members of {team.name}</p>
                </div>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </Badge>
              </div>
              
              {members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member, index) => {
                    const RoleIcon = getRoleIcon(member.role);
                    const gradients = [
                      'from-blue-500 to-cyan-500',
                      'from-purple-500 to-pink-500',
                      'from-green-500 to-teal-500',
                      'from-orange-500 to-red-500',
                      'from-indigo-500 to-purple-500',
                      'from-pink-500 to-rose-500'
                    ];
                    const gradient = gradients[index % gradients.length];
                    
                    return (
                      <div
                        key={member.id}
                        className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                      >
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-16 h-16 border-3 border-white shadow-lg">
                              <AvatarImage 
                                src={member.profileImageUrl || member.avatarUrl || undefined}
                                alt={member.username || member.email}
                                onError={(e) => {
                                  console.log('Detailed view image failed to load:', member.profileImageUrl || member.avatarUrl);
                                }}
                              />
                              <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-bold text-lg`}>
                                {(member.username || member.email || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Role Badge */}
                            <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full ${getRoleColor(member.role)} flex items-center justify-center border-2 border-white shadow-md`}>
                              <RoleIcon className="w-3.5 h-3.5 text-white" />
                            </div>

                            {/* Captain Crown */}
                            {member.userId === team.captainId && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                <Crown className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg truncate">{member.username || "Player"}</h4>
                              {member.userId === team.captainId && (
                                <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Captain
                                </Badge>
                              )}
                            </div>
                            <Badge className={`${getRoleColor(member.role)} text-xs mb-2`}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {PLAYER_ROLES[member.role as keyof typeof PLAYER_ROLES]?.label || member.role}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          {/* Player Name */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-700 font-medium flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Player Name:
                              </span>
                            </div>
                            <div className="font-semibold text-blue-900 mt-1 break-words">
                              {member.username || "Not provided"}
                            </div>
                          </div>

                          {/* Email */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                            <div className="flex items-center justify-between">
                              <span className="text-purple-700 font-medium flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                Email:
                              </span>
                            </div>
                            <div className="font-mono text-purple-900 mt-1 break-all text-xs">
                              {member.email}
                            </div>
                          </div>

                          {/* Game ID */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                            <div className="flex items-center justify-between">
                              <span className="text-green-700 font-medium flex items-center">
                                <Gamepad2 className="w-4 h-4 mr-2" />
                                Game ID:
                              </span>
                            </div>
                            <div className="font-mono text-green-900 mt-1 break-words">
                              {member.gameId || "Not provided"}
                            </div>
                          </div>
                          
                          {/* Contact Information */}
                          {member.contactInfo && (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-100">
                              <div className="flex items-center justify-between">
                                <span className="text-orange-700 font-medium flex items-center">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Contact:
                                </span>
                              </div>
                              <div className="font-mono text-orange-900 mt-1 break-words">
                                {member.contactInfo}
                              </div>
                            </div>
                          )}

                          {/* Player Status */}
                          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                Status:
                              </span>
                              <Badge className="bg-green-500 text-white text-xs">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-600 mb-2">No members yet</h3>
                  <p className="text-gray-500">Add players to build your championship squad</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowViewModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => copyTeamCode(team.code)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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

      {/* Add/Edit Player Modal */}
      <AddPlayerModal
        isOpen={showAddPlayerModal}
        onClose={() => {
          setShowAddPlayerModal(false);
          setEditingPlayer(null);
        }}
        teamId={team.id}
        editingPlayer={editingPlayer}
      />
    </>
  );
}
