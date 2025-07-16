
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Gamepad2,
  Upload,
  Camera,
  Crown,
  Shield,
  Target,
  Crosshair,
  Zap,
  Brain,
  Users,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player?: any;
  teamId?: number;
  mode?: 'add' | 'edit';
}

interface PlayerFormData {
  playerName: string;
  email: string;
  phone: string;
  gameId: string;
  role: string;
  profileImage: File | null;
  profileImageUrl: string;
}

const roleOptions = [
  { value: "captain", label: "Captain", icon: Crown, color: "bg-fire-orange" },
  { value: "igl", label: "In-Game Leader", icon: Brain, color: "bg-purple-500" },
  { value: "entry", label: "Entry Fragger", icon: Zap, color: "bg-fire-red" },
  { value: "support", label: "Support", icon: Shield, color: "bg-fire-blue" },
  { value: "sniper", label: "Sniper", icon: Crosshair, color: "bg-fire-green" },
  { value: "scout", label: "Scout", icon: Target, color: "bg-fire-teal" },
  { value: "member", label: "Member", icon: Users, color: "bg-gray-500" },
];

export default function PlayerModal({ isOpen, onClose, player, teamId, mode = 'add' }: PlayerModalProps) {
  const queryClient = useQueryClient();
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState<PlayerFormData>({
    playerName: player?.username || "",
    email: player?.email || "",
    phone: player?.phone || "",
    gameId: player?.gameId || "",
    role: player?.role || "member",
    profileImage: null,
    profileImageUrl: player?.avatar || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addPlayerMutation = useMutation({
    mutationFn: async (data: PlayerFormData) => {
      try {
        if (data.profileImage) {
          // If there's an image, use FormData
          const formDataToSend = new FormData();
          formDataToSend.append("playerName", data.playerName);
          formDataToSend.append("email", data.email);
          formDataToSend.append("phone", data.phone);
          formDataToSend.append("gameId", data.gameId);
          formDataToSend.append("role", data.role);
          if (teamId) formDataToSend.append("teamId", teamId.toString());
          formDataToSend.append("profileImage", data.profileImage);

          const res = await fetch("/api/players", {
            method: "POST",
            body: formDataToSend,
          });

          if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = "Failed to add player";
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
          }

          return res.json();
        } else {
          // If no image, send JSON
          const res = await fetch("/api/players", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playerName: data.playerName,
              email: data.email,
              phone: data.phone,
              gameId: data.gameId,
              role: data.role,
              teamId: teamId,
            }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = "Failed to add player";
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
          }

          return res.json();
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("An unexpected error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Success",
        description: `Player ${mode === 'add' ? 'added' : 'updated'} successfully!`,
      });
      handleClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.playerName.trim()) {
      newErrors.playerName = "Player name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.gameId.trim()) {
      newErrors.gameId = "Game ID is required";
    }

    if (!formData.role) {
      newErrors.role = "Player role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (file: File) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a valid image file (PNG, JPG, JPEG, WebP)",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({ ...prev, profileImage: file }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setProfileImagePreview(result);
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the image file",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    addPlayerMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      playerName: "",
      email: "",
      phone: "",
      gameId: "",
      role: "member",
      profileImage: null,
      profileImageUrl: "",
    });
    setProfileImagePreview("");
    setErrors({});
    onClose();
  };

  const getSelectedRole = () => {
    return roleOptions.find(role => role.value === formData.role);
  };

  const currentImageUrl = profileImagePreview || formData.profileImageUrl || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.playerName}`;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-fire-blue to-fire-red rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span>{mode === 'add' ? 'Add New Player' : 'Edit Player'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload Section - Compact */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                <AvatarImage src={currentImageUrl} alt="Player profile" />
                <AvatarFallback className="bg-gradient-to-br from-fire-blue to-fire-red text-white text-lg font-bold">
                  {formData.playerName.charAt(0).toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              
              {/* Upload indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-fire-blue rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-700">Profile Picture</h4>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="profile-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('profile-upload')?.click()}
                    className="text-xs px-3 py-1 h-8"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Choose
                  </Button>
                  <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Player Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player Name */}
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-sm font-medium flex items-center space-x-2">
                <User className="w-4 h-4 text-fire-blue" />
                <span>Player Name</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="playerName"
                value={formData.playerName}
                onChange={(e) => setFormData(prev => ({ ...prev, playerName: e.target.value }))}
                placeholder="Enter player name"
                className={`${errors.playerName ? 'border-red-500' : ''}`}
              />
              {errors.playerName && (
                <div className="flex items-center space-x-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.playerName}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-2">
                <Mail className="w-4 h-4 text-fire-green" />
                <span>Email Address</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="player@email.com"
                className={`${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <div className="flex items-center space-x-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center space-x-2">
                <Phone className="w-4 h-4 text-fire-orange" />
                <span>Phone Number</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
                className={`${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <div className="flex items-center space-x-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            {/* Game ID */}
            <div className="space-y-2">
              <Label htmlFor="gameId" className="text-sm font-medium flex items-center space-x-2">
                <Gamepad2 className="w-4 h-4 text-fire-red" />
                <span>Game ID</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="gameId"
                value={formData.gameId}
                onChange={(e) => setFormData(prev => ({ ...prev, gameId: e.target.value }))}
                placeholder="e.g. PG#123456"
                className={`${errors.gameId ? 'border-red-500' : ''}`}
              />
              {errors.gameId && (
                <div className="flex items-center space-x-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.gameId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Player Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center space-x-2">
              <Shield className="w-4 h-4 text-fire-blue" />
              <span>Player Role in Game</span>
              <span className="text-red-500">*</span>
            </Label>
            
            <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger className={`${errors.role ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select player role">
                  {formData.role && (
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const role = getSelectedRole();
                        if (role) {
                          const IconComponent = role.icon;
                          return (
                            <>
                              <div className={`w-4 h-4 ${role.color} rounded-full flex items-center justify-center`}>
                                <IconComponent className="w-2.5 h-2.5 text-white" />
                              </div>
                              <span>{role.label}</span>
                            </>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 ${role.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-gray-500 capitalize">{role.value}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {errors.role && (
              <div className="flex items-center space-x-1 text-red-500 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.role}</span>
              </div>
            )}
            
            {/* Role Description */}
            {formData.role && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  {(() => {
                    const role = getSelectedRole();
                    if (role) {
                      const IconComponent = role.icon;
                      return (
                        <>
                          <div className={`w-5 h-5 ${role.color} rounded-full flex items-center justify-center`}>
                            <IconComponent className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-sm">{role.label}</span>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
                <p className="text-xs text-gray-600">
                  {formData.role === 'captain' && 'Team leader with full management privileges and strategic oversight.'}
                  {formData.role === 'igl' && 'Strategic commander who makes tactical decisions during matches.'}
                  {formData.role === 'entry' && 'First to engage enemies, creating opportunities for the team.'}
                  {formData.role === 'support' && 'Provides utility and backup support to team members.'}
                  {formData.role === 'sniper' && 'Long-range specialist focused on eliminations from distance.'}
                  {formData.role === 'scout' && 'Gathers information and provides early enemy detection.'}
                  {formData.role === 'member' && 'General team member with flexible role assignments.'}
                </p>
              </div>
            )}
          </div>

          {/* Preview Card */}
          {formData.playerName && (
            <Card className="bg-gradient-to-r from-fire-blue/5 to-fire-red/5 border-fire-blue/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                      <AvatarImage src={currentImageUrl} alt="Preview" />
                      <AvatarFallback className="bg-gradient-to-br from-fire-blue to-fire-red text-white font-bold">
                        {formData.playerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {formData.role && (
                      <div className={`absolute -top-1 -right-1 w-6 h-6 ${getSelectedRole()?.color} rounded-full flex items-center justify-center shadow-sm`}>
                        {(() => {
                          const role = getSelectedRole();
                          if (role) {
                            const IconComponent = role.icon;
                            return <IconComponent className="w-3 h-3 text-white" />;
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{formData.playerName}</h4>
                      {formData.role && (
                        <Badge className={`${getSelectedRole()?.color} text-white text-xs`}>
                          {getSelectedRole()?.label}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {formData.gameId && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Gamepad2 className="w-3 h-3" />
                          <span>{formData.gameId}</span>
                        </div>
                      )}
                      {formData.email && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{formData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={addPlayerMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-fire-blue hover:bg-blue-600 text-white"
              disabled={addPlayerMutation.isPending}
            >
              {addPlayerMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{mode === 'add' ? 'Adding...' : 'Updating...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{mode === 'add' ? 'Add Player' : 'Update Player'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
