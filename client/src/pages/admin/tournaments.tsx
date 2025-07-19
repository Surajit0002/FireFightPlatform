import { useState, useRef } from "react";
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
  DialogDescription,
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
  MoreHorizontal,
  Image,
  MapPin,
  Clock,
  Target,
  Gamepad2,
  Play,
  Pause,
  StopCircle,
  CheckCircle,
  XCircle,
  Settings,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  BarChart3,
  FileText,
  AlertTriangle,
} from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function AdminTournaments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gameFilter, setGameFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

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
      setShowDetailsModal(false);
      setSelectedTournament(null);
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let posterUrl = data.posterUrl || "";

      // Handle image upload if a file was selected
      if (uploadedImage) {
        const formData = new FormData();
        formData.append('image', uploadedImage);

        // In a real application, you would upload to a file storage service
        // For now, we'll create a mock URL
        posterUrl = `https://example.com/uploads/${uploadedImage.name}`;
      }

      const tournamentData = {
        title: data.title,
        description: data.description,
        game: data.game,
        prizePool: data.prizePool?.toString() || "0",
        entryFee: data.entryFee?.toString() || "0",
        maxSlots: parseInt(data.maxSlots) || 0,
        teamSize: parseInt(data.teamSize) || 1,
        format: data.format,
        startTime: data.startTime,
        endTime: data.endTime,
        regOpenTime: data.regOpenTime,
        regCloseTime: data.regCloseTime,
        checkInTime: data.checkInTime,
        registrationEnd: data.regCloseTime || new Date(new Date(data.startTime).getTime() - 30 * 60 * 1000).toISOString(),
        rules: data.rules,
        mapInfo: data.mapInfo,
        streamUrl: data.spectatorUrl,
        posterUrl: posterUrl,
        isFeatured: data.isFeatured || false,
        isVerified: data.isVerified || false,
        allowGuests: data.isPublic !== false,
      };

      if (selectedTournament) {
        updateTournamentMutation.mutate({ id: selectedTournament.id, data: tournamentData });
      } else {
        createTournamentMutation.mutate(tournamentData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process tournament data",
        variant: "destructive",
      });
    }
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    const matchesGame = gameFilter === "all" || tournament.game === gameFilter;
    return matchesSearch && matchesStatus && matchesGame;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-fire-red text-white';
      case 'upcoming': return 'bg-fire-blue text-white';
      case 'completed': return 'bg-fire-green text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getGameIcon = (game: string) => {
    return <Gamepad2 className="w-5 h-5" />;
  };

  const duplicateTournament = (tournament: Tournament) => {
    const duplicatedData = {
      ...tournament,
      title: `${tournament.title} (Copy)`,
      status: "upcoming" as const,
      currentSlots: 0,
    };
    setSelectedTournament(null);
    reset();
    Object.keys(duplicatedData).forEach(key => {
      setValue(key, duplicatedData[key as keyof Tournament]);
    });
    setShowCreateModal(true);
  };

  const changeStatus = (tournament: Tournament, newStatus: string) => {
    updateTournamentMutation.mutate({
      id: tournament.id,
      data: { status: newStatus }
    });
  };

  const TournamentForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Tournament Name *</Label>
              <Input
                id="title"
                {...register("title", { required: "Tournament name is required" })}
                placeholder="e.g., FireFight Championship 2025"
                defaultValue={selectedTournament?.title}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setValue("slug", slug);
                }}
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="slug">URL Slug (Auto-generated)</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="auto-generated-slug"
                defaultValue={selectedTournament?.slug}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="game">Game Name *</Label>
              <Select 
                defaultValue={selectedTournament?.game}
                onValueChange={(value) => setValue("game", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free_fire">🔥 Free Fire</SelectItem>
                  <SelectItem value="bgmi">🎯 BGMI</SelectItem>
                  <SelectItem value="valorant">⚡ Valorant</SelectItem>
                  <SelectItem value="csgo">💥 CS:GO</SelectItem>
                  <SelectItem value="pubg">🏆 PUBG</SelectItem>
                </SelectContent>
              </Select>
              {errors.game && <p className="text-sm text-red-600 mt-1">{errors.game.message}</p>}
            </div>

            <div>
              <Label htmlFor="gameCategory">Game Category *</Label>
              <Select 
                defaultValue={selectedTournament?.gameCategory || "battle_royale"}
                onValueChange={(value) => setValue("gameCategory", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="battle_royale">Battle Royale</SelectItem>
                  <SelectItem value="fps">FPS</SelectItem>
                  <SelectItem value="moba">MOBA</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="platform">Platform *</Label>
              <Select 
                defaultValue={selectedTournament?.platform || "mobile"}
                onValueChange={(value) => setValue("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">📱 Mobile</SelectItem>
                  <SelectItem value="pc">💻 PC</SelectItem>
                  <SelectItem value="console">🎮 Console</SelectItem>
                  <SelectItem value="cross_platform">🌐 Cross-platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Tournament Type *</Label>
              <Select 
                defaultValue={selectedTournament?.format}
                onValueChange={(value) => setValue("format", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">👤 Solo</SelectItem>
                  <SelectItem value="duo">👥 Duo</SelectItem>
                  <SelectItem value="squad">👪 Squad</SelectItem>
                </SelectContent>
              </Select>
              {errors.format && <p className="text-sm text-red-600 mt-1">{errors.format.message}</p>}
            </div>

            <div>
              <Label htmlFor="teamSize">Team Size *</Label>
              <Input
                id="teamSize"
                type="number"
                {...register("teamSize", { required: "Team size is required", min: 1, max: 10 })}
                placeholder="1-10 players"
                defaultValue={selectedTournament?.teamSize}
              />
              {errors.teamSize && <p className="text-sm text-red-600 mt-1">{errors.teamSize.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Detailed tournament description, rules overview, and what participants can expect..."
              defaultValue={selectedTournament?.description}
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="posterUrl">Tournament Poster URL</Label>
            <Input
              id="posterUrl"
              {...register("posterUrl")}
              placeholder="https://example.com/tournament-poster.jpg"
              defaultValue={selectedTournament?.posterUrl}
            />
            {watch("posterUrl") && (
              <div className="mt-2">
                <img 
                  src={watch("posterUrl")} 
                  alt="Tournament Poster Preview" 
                  className="w-32 h-20 object-cover rounded border"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="regOpenTime">Registration Opens</Label>
              <Input
                id="regOpenTime"
                type="datetime-local"
                {...register("regOpenTime")}
                defaultValue={selectedTournament?.regOpenTime ? 
                  new Date(selectedTournament.regOpenTime).toISOString().slice(0, 16) : ""}
              />
            </div>

            <div>
              <Label htmlFor="regCloseTime">Registration Closes</Label>
              <Input
                id="regCloseTime"
                type="datetime-local"
                {...register("regCloseTime")}
                defaultValue={selectedTournament?.regCloseTime ? 
                  new Date(selectedTournament.regCloseTime).toISOString().slice(0, 16) : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Tournament Start *</Label>
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
              <Label htmlFor="endTime">Expected End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                {...register("endTime")}
                defaultValue={selectedTournament?.endTime ? 
                  new Date(selectedTournament.endTime).toISOString().slice(0, 16) : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="minSlots">Min Participants *</Label>
              <Input
                id="minSlots"
                type="number"
                {...register("minSlots", { required: "Min participants is required", min: 1 })}
                placeholder="Minimum to start"
                defaultValue={selectedTournament?.minSlots || 4}
              />
              {errors.minSlots && <p className="text-sm text-red-600 mt-1">{errors.minSlots.message}</p>}
            </div>

            <div>
              <Label htmlFor="maxSlots">Max Participants *</Label>
              <Input
                id="maxSlots"
                type="number"
                {...register("maxSlots", { required: "Max slots is required", min: 2 })}
                placeholder="Maximum entries"
                defaultValue={selectedTournament?.maxSlots}
              />
              {errors.maxSlots && <p className="text-sm text-red-600 mt-1">{errors.maxSlots.message}</p>}
            </div>

            <div>
              <Label htmlFor="mapInfo">Map/Arena Info</Label>
              <Input
                id="mapInfo"
                {...register("mapInfo")}
                placeholder="e.g., Bermuda, Erangel"
                defaultValue={selectedTournament?.mapInfo}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="checkInRequired"
                {...register("checkInRequired")}
                defaultChecked={selectedTournament?.checkInRequired}
              />
              <Label htmlFor="checkInRequired">Require Check-in</Label>
            </div>

            {watch("checkInRequired") && (
              <div>
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="datetime-local"
                  {...register("checkInTime")}
                  defaultValue={selectedTournament?.checkInTime ? 
                    new Date(selectedTournament.checkInTime).toISOString().slice(0, 16) : ""}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="entryMode">Entry Mode *</Label>
              <Select 
                defaultValue={selectedTournament?.entryMode || "free"}
                onValueChange={(value) => {
                  setValue("entryMode", value);
                  if (value === "free") setValue("entryFee", "0");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entry mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">🆓 Free</SelectItem>
                  <SelectItem value="paid">💰 Paid</SelectItem>
                  <SelectItem value="invite_only">🔐 Invite Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="entryFee">Entry Fee (₹)</Label>
              <Input
                id="entryFee"
                type="number"
                {...register("entryFee")}
                placeholder="0"
                defaultValue={selectedTournament?.entryFee}
                disabled={watch("entryMode") === "free"}
                className={watch("entryMode") === "free" ? "bg-gray-100" : ""}
              />
            </div>

            <div>
              <Label htmlFor="prizePoolType">Prize Pool Type *</Label>
              <Select 
                defaultValue={selectedTournament?.prizePoolType || "fixed"}
                onValueChange={(value) => setValue("prizePoolType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">🎯 Fixed Amount</SelectItem>
                  <SelectItem value="dynamic">📈 Dynamic (Entry-based)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="prizePool">Total Prize Pool (₹) *</Label>
            <Input
              id="prizePool"
              type="number"
              {...register("prizePool", { required: "Prize pool is required", min: 0 })}
              placeholder="Enter total prize amount"
              defaultValue={selectedTournament?.prizePool}
              onChange={(e) => {
                const total = parseFloat(e.target.value) || 0;
                const breakdown = {
                  first: Math.floor(total * 0.5),
                  second: Math.floor(total * 0.3),
                  third: Math.floor(total * 0.2)
                };
                setValue("prizeBreakdown", JSON.stringify(breakdown));
              }}
            />
            {errors.prizePool && <p className="text-sm text-red-600 mt-1">{errors.prizePool.message}</p>}
          </div>

          <div>
            <Label>Prize Distribution (Auto-calculated)</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-sm font-medium text-yellow-800">🥇 1st Place</div>
                <div className="text-lg font-bold text-yellow-900">
                  ₹{Math.floor((parseFloat(watch("prizePool")) || 0) * 0.5).toLocaleString()}
                </div>
                <div className="text-xs text-yellow-600">50% of total</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-800">🥈 2nd Place</div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{Math.floor((parseFloat(watch("prizePool")) || 0) * 0.3).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">30% of total</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-sm font-medium text-orange-800">🥉 3rd Place</div>
                <div className="text-lg font-bold text-orange-900">
                  ₹{Math.floor((parseFloat(watch("prizePool")) || 0) * 0.2).toLocaleString()}
                </div>
                <div className="text-xs text-orange-600">20% of total</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="rules">Detailed Rules & Guidelines *</Label>
            <Textarea
              id="rules"
              {...register("rules", { required: "Rules are required" })}
              placeholder="1. Fair play policy&#10;2. No cheating or hacking&#10;3. Respectful behavior required&#10;4. Decision of admins is final..."
              rows={6}
              defaultValue={selectedTournament?.rules}
            />
            {errors.rules && <p className="text-sm text-red-600 mt-1">{errors.rules.message}</p>}
          </div>

          <div>
            <Label htmlFor="spectatorUrl">Live Stream URL (Optional)</Label>
            <Input
              id="spectatorUrl"
              {...register("spectatorUrl")}
              placeholder="https://youtube.com/live/stream-id or https://twitch.tv/channel"
              defaultValue={selectedTournament?.spectatorUrl}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                {...register("isPublic")}
                defaultChecked={selectedTournament?.isPublic !== false}
              />
              <Label htmlFor="isPublic">🌍 Public Tournament</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
                defaultChecked={selectedTournament?.isFeatured}
              />
              <Label htmlFor="isFeatured">⭐ Featured</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isVerified"
                {...register("isVerified")}
                defaultChecked={selectedTournament?.isVerified}
              />
              <Label htmlFor="isVerified">✅ Verified</Label>
            </div>
          </div>

          <div className="bg-fire-blue/10 border border-fire-blue/20 rounded-lg p-4">
            <h4 className="font-semibold text-fire-blue mb-2">Tournament Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Title:</span>
                <span className="ml-2 font-medium">{watch("title") || "Tournament Name"}</span>
              </div>
              <div>
                <span className="text-gray-600">Game:</span>
                <span className="ml-2 font-medium capitalize">{watch("game")?.replace('_', ' ') || "Game"}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium capitalize">{watch("format") || "Format"}</span>
              </div>
              <div>
                <span className="text-gray-600">Prize:</span>
                <span className="ml-2 font-medium">₹{(parseFloat(watch("prizePool")) || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-2 pt-4 border-t">
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

  const TournamentCard = ({ tournament }: { tournament: Tournament }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-fire-blue">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-fire-blue to-fire-red rounded-lg flex items-center justify-center">
              {getGameIcon(tournament.game)}
            </div>
            <div>
              <h3 className="font-bold text-lg fire-gray group-hover:text-fire-blue transition-colors">
                {tournament.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {tournament.game.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status.toUpperCase()}
                </Badge>
                {tournament.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
                {tournament.isVerified && <Shield className="w-4 h-4 text-fire-green" />}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTournament(tournament);
              setShowDetailsModal(true);
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {tournament.posterUrl && (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={tournament.posterUrl}
              alt={tournament.title}
              className="w-full h-32 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center">
              <Trophy className="w-4 h-4 mr-1 text-fire-green" />
              Prize
            </span>
            <span className="font-bold text-fire-green">₹{tournament.prizePool}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              Entry
            </span>
            <span className="font-bold">
              {tournament.entryFee === "0" ? "FREE" : `₹${tournament.entryFee}`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Slots
            </span>
            <span className="font-bold">{tournament.currentSlots}/{tournament.maxSlots}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Format
            </span>
            <span className="font-bold capitalize">{tournament.format}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Start Time
            </span>
            <span className="font-medium">
              {new Date(tournament.startTime).toLocaleDateString()} at{" "}
              {new Date(tournament.startTime).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTournament(tournament);
              setShowDetailsModal(true);
            }}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTournament(tournament);
              Object.keys(tournament).forEach(key => {
                setValue(key, tournament[key as keyof Tournament]);
              });
              setShowCreateModal(true);
            }}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const TournamentDetailsModal = () => (
    <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gamepad2 className="w-6 h-6 text-fire-blue" />
            <span>Tournament Details</span>
          </DialogTitle>
          <DialogDescription>
            Comprehensive tournament information and management
          </DialogDescription>
        </DialogHeader>

        {selectedTournament && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-fire-green" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-semibold">{selectedTournament.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Game:</span>
                      <Badge variant="outline">{selectedTournament.game.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedTournament.status)}>
                        {selectedTournament.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-semibold capitalize">{selectedTournament.format}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-fire-green" />
                      <span>Prize & Entry</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prize Pool:</span>
                      <span className="font-bold text-fire-green text-lg">₹{selectedTournament.prizePool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entry Fee:</span>
                      <span className="font-semibold">
                        {selectedTournament.entryFee === "0" ? "FREE" : `₹${selectedTournament.entryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-semibold">
                        ₹{(parseInt(selectedTournament.entryFee) * selectedTournament.currentSlots).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedTournament.description || "No description provided"}</p>
                </CardContent>
              </Card>

              <div className="flex space-x-2">
                <Button
                  onClick={() => changeStatus(selectedTournament, "live")}
                  disabled={selectedTournament.status === "live"}
                  className="bg-fire-red text-white"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start Tournament
                </Button>
                <Button
                  onClick={() => changeStatus(selectedTournament, "completed")}
                  disabled={selectedTournament.status === "completed"}
                  variant="outline"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
                <Button
                  onClick={() => duplicateTournament(selectedTournament)}
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  onClick={() => deleteTournamentMutation.mutate(selectedTournament.id)}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <CardTitle>Participants ({selectedTournament.currentSlots}/{selectedTournament.maxSlots})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Participant management coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Featured Tournament</span>
                      <Badge variant={selectedTournament.isFeatured ? "default" : "outline"}>
                        {selectedTournament.isFeatured ? "Featured" : "Not Featured"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Verified Tournament</span>
                      <Badge variant={selectedTournament.isVerified ? "default" : "outline"}>
                        {selectedTournament.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold fire-gray mb-2">Tournament Management</h1>
            <p className="text-gray-600">Create, manage, and monitor tournaments with advanced controls</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
            >
              {viewMode === "cards" ? <Table className="w-4 h-4" /> : <div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div></div>}
            </Button>
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
                  <DialogDescription>
                    Fill in the tournament details below to create a new tournament
                  </DialogDescription>
                </DialogHeader>
                <TournamentForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-fire-blue to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Tournaments</p>
                  <p className="text-3xl font-bold">{tournaments.length}</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-fire-red to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Live Tournaments</p>
                  <p className="text-3xl font-bold">{tournaments.filter(t => t.status === 'live').length}</p>
                </div>
                <Play className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-fire-green to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Participants</p>
                  <p className="text-3xl font-bold">{tournaments.reduce((sum, t) => sum + t.currentSlots, 0)}</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Total Prize Pool</p>
                  <p className="text-3xl font-bold">₹{tournaments.reduce((sum, t) => sum + parseFloat(t.prizePool), 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
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

              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="free_fire">Free Fire</SelectItem>
                  <SelectItem value="bgmi">BGMI</SelectItem>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="csgo">CS:GO</SelectItem>
                  <SelectItem value="pubg">PUBG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tournaments Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
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
                        <Badge className={getStatusColor(tournament.status)}>
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTournament(tournament);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTournament(tournament);
                              Object.keys(tournament).forEach(key => {
                                setValue(key, tournament[key as keyof Tournament]);
                              });
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
                    {searchTerm || statusFilter !== 'all' || gameFilter !== 'all'
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
        )}

        <TournamentDetailsModal />
      </main>
    </AdminLayout>
  );
}