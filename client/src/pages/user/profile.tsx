import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import {
  User,
  Edit,
  Shield,
  Bell,
  Smartphone,
  Upload,
  Trophy,
  TrendingUp,
  Calendar,
  Star,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  CreditCard,
  Wallet,
  Zap,
  Target,
  Award,
  Crown,
  Flame,
  GamepadIcon,
  Users,
  Clock,
  DollarSign,
  MapPin,
  ChevronRight,
  Camera,
  Phone,
  Mail,
  Globe,
  Download,
  Share2,
  BarChart3,
  Coins,
  Gift,
  Medal,
  Swords,
  Timer,
  Activity,
  TrendingDown,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Vibrate,
  Wifi,
  WifiOff
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      upiId: user?.upiId || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const xpToNextLevel = (user?.level || 1) * 1000;
  const currentXP = user?.xpPoints || 0;
  const xpProgress = (currentXP % 1000) / 10;
  const winRate = user?.winRate || 0;
  const matchesPlayed = user?.matchesPlayed || 0;
  const matchesWon = Math.floor((matchesPlayed * winRate) / 100);

  const achievements = [
    { id: 1, name: "First Victory", description: "Win your first tournament", earned: true, icon: "🏆", rarity: "Common", xp: 100 },
    { id: 2, name: "Team Player", description: "Join a team", earned: true, icon: "👥", rarity: "Common", xp: 50 },
    { id: 3, name: "Rising Star", description: "Reach level 5", earned: true, icon: "⭐", rarity: "Rare", xp: 250 },
    { id: 4, name: "Tournament Master", description: "Win 10 tournaments", earned: false, icon: "🎯", rarity: "Epic", xp: 500 },
    { id: 5, name: "Elite Player", description: "Reach top 10 leaderboard", earned: false, icon: "👑", rarity: "Legendary", xp: 1000 },
    { id: 6, name: "Cash Collector", description: "Earn ₹10,000", earned: false, icon: "💰", rarity: "Epic", xp: 750 },
    { id: 7, name: "Speed Demon", description: "Win 5 matches in a row", earned: false, icon: "⚡", rarity: "Rare", xp: 300 },
    { id: 8, name: "Veteran", description: "Play for 30 days", earned: false, icon: "🛡️", rarity: "Rare", xp: 400 },
  ];

  const recentMatches = [
    { id: 1, game: "Valorant", result: "Win", score: "13-7", xp: "+25", earnings: "+₹150", time: "2 hours ago" },
    { id: 2, game: "CS:GO", result: "Loss", score: "14-16", xp: "+10", earnings: "₹0", time: "5 hours ago" },
    { id: 3, game: "PUBG", result: "Win", score: "#1/100", xp: "+30", earnings: "+₹200", time: "1 day ago" },
  ];

  const playerStats = [
    { label: "Total Matches", value: matchesPlayed, icon: Target, color: "text-blue-600" },
    { label: "Matches Won", value: matchesWon, icon: Trophy, color: "text-green-600" },
    { label: "Win Rate", value: `${winRate}%`, icon: TrendingUp, color: "text-purple-600" },
    { label: "Current Streak", value: user?.currentStreak || 0, icon: Flame, color: "text-red-600" },
    { label: "Best Streak", value: user?.bestStreak || 0, icon: Award, color: "text-yellow-600" },
    { label: "Rank Points", value: user?.rankPoints || 0, icon: Crown, color: "text-indigo-600" },
  ];

  const securityLog = [
    { id: 1, action: "Login", device: "Chrome on Windows", ip: "192.168.1.1", time: "2 hours ago", status: "success" },
    { id: 2, action: "Profile Update", device: "Mobile App", ip: "192.168.1.2", time: "1 day ago", status: "success" },
    { id: 3, action: "Password Change", device: "Chrome on Windows", ip: "192.168.1.1", time: "3 days ago", status: "success" },
    { id: 4, action: "Failed Login", device: "Unknown", ip: "192.168.1.100", time: "5 days ago", status: "failed" },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-gray-400 to-gray-600';
      case 'Rare': return 'from-blue-400 to-blue-600';
      case 'Epic': return 'from-purple-400 to-purple-600';
      case 'Legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'}`}>
      <UserHeader />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Dynamic Header with Floating Actions */}
        <div className="relative mb-6 lg:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Profile & Settings
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-0">
                  Manage your gaming profile, achievements, and account preferences
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                <Button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
                </Button>
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Share Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Enhanced Profile Overview - Mobile Optimized */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4 lg:space-y-6">
            {/* Main Profile Card */}
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Profile Header with Gradient */}
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

                  <div className="relative text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto ring-4 ring-white/30">
                        <AvatarImage src={profileImagePreview || user?.profileImageUrl} />
                        <AvatarFallback className="text-xl sm:text-2xl bg-white/20">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-1 -right-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full w-8 h-8 p-0 border border-white/30"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold mb-1">
                      {user?.username || "Player"}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        Level {user?.level || 1}
                      </Badge>
                      <Badge className="bg-yellow-500/80 text-white border-yellow-400/50">
                        <Crown className="w-3 h-3 mr-1" />
                        {user?.rank || "Beginner"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">XP Progress</span>
                      <span className="font-semibold">{currentXP}/{xpToNextLevel}</span>
                    </div>
                    <Progress value={xpProgress} className="h-2 bg-gray-200" />
                    <p className="text-xs text-gray-500 mt-1">
                      {xpToNextLevel - currentXP} XP to next level
                    </p>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-green-600">₹{user?.totalEarnings || "0"}</div>
                      <div className="text-xs text-gray-600">Total Earnings</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-blue-600">{winRate}%</div>
                      <div className="text-xs text-gray-600">Win Rate</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-purple-600">{user?.rankPoints || 0}</div>
                      <div className="text-xs text-gray-600">Rank Points</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl">
                      <div className="text-lg sm:text-xl font-bold text-orange-600">{user?.currentStreak || 0}</div>
                      <div className="text-xs text-gray-600">Win Streak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Quick Info */}
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Wallet className="w-3 h-3" />
                    Wallet Balance:
                  </span>
                  <span className="font-semibold text-green-600">₹{user?.walletBalance || "0.00"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    KYC Status:
                  </span>
                  <Badge variant={user?.kycStatus === 'approved' ? 'default' : 'secondary'} className="text-xs">
                    {user?.kycStatus || 'Pending'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Member Since:
                  </span>
                  <span className="font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <GamepadIcon className="w-3 h-3" />
                    Matches Played:
                  </span>
                  <span className="font-semibold">{matchesPlayed}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches Preview */}
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${match.result === 'Win' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-xs font-medium">{match.game}</p>
                        <p className="text-xs text-gray-500">{match.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold">{match.result}</p>
                      <p className="text-xs text-gray-500">{match.score}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6 bg-white/80 backdrop-blur-xl">
                <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
                <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
                <TabsTrigger value="kyc" className="text-xs sm:text-sm">KYC</TabsTrigger>
                <TabsTrigger value="achievements" className="text-xs sm:text-sm">Achievements</TabsTrigger>
              </TabsList>

              {/* Profile Tab - Enhanced */}
              <TabsContent value="profile" className="space-y-6">
                {/* Player Statistics Grid */}
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Player Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {playerStats.map((stat, index) => (
                        <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300">
                          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                          <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information Form */}
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            placeholder="Enter first name"
                            className="bg-white/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Enter last name"
                            className="bg-white/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            {...register("username", { required: "Username is required" })}
                            placeholder="Enter username"
                            className="bg-white/50"
                          />
                          {errors.username && (
                            <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            placeholder="Enter email address"
                            className="bg-white/50"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            {...register("phone")}
                            placeholder="Enter phone number"
                            className="bg-white/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input
                            id="upiId"
                            {...register("upiId")}
                            placeholder="Enter UPI ID (e.g., yourname@paytm)"
                            className="bg-white/50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          {...register("bio")}
                          placeholder="Tell us about yourself..."
                          className="bg-white/50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Share your gaming achievements or favorite games
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Change Password</h4>
                        <div className="space-y-3">
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Current password"
                              className="bg-white/50"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <Input type="password" placeholder="New password" className="bg-white/50" />
                          <Input type="password" placeholder="Confirm new password" className="bg-white/50" />
                        </div>
                        <Button className="mt-3 bg-gradient-to-r from-red-500 to-pink-600 text-white">
                          Update Password
                        </Button>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">2FA Protection</p>
                            <p className="text-xs text-gray-600">
                              Add extra security layer
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-3">Login Alerts</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">Email alerts</span>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">SMS alerts</span>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Login History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {securityLog.map((log) => (
                          <div key={log.id} className={`p-3 rounded-lg border-l-4 ${
                            log.status === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-sm">{log.action}</div>
                                <div className="text-xs text-gray-600">
                                  {log.device} • {log.ip}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">{log.time}</div>
                                <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                                  {log.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enhanced Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Game Notifications</h4>
                        {[
                          { title: "Tournament Updates", desc: "Match starts and results", icon: Trophy },
                          { title: "Team Invitations", desc: "Join requests and invites", icon: Users },
                          { title: "Match Reminders", desc: "Upcoming match alerts", icon: Timer },
                          { title: "Achievement Unlocked", desc: "New badges and rewards", icon: Award },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-gray-600" />
                              <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className="text-xs text-gray-600">{item.desc}</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Account Notifications</h4>
                        {[
                          { title: "Wallet Activities", desc: "Deposits and withdrawals", icon: Wallet },
                          { title: "Security Alerts", desc: "Login and security events", icon: Shield },
                          { title: "Promotional Offers", desc: "Special offers and bonuses", icon: Gift },
                          { title: "System Updates", desc: "Platform news and updates", icon: Settings },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-gray-600" />
                              <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className="text-xs text-gray-600">{item.desc}</p>
                              </div>
                            </div>
                            <Switch defaultChecked={index < 2} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Delivery Methods</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { title: "Push Notifications", icon: Smartphone, enabled: true },
                          { title: "Email Notifications", icon: Mail, enabled: true },
                          { title: "SMS Notifications", icon: Phone, enabled: false },
                        ].map((method, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">                              <method.icon className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium">{method.title}</span>
                            </div>
                            <Switch defaultChecked={method.enabled} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced KYC Tab */}
              <TabsContent value="kyc" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      KYC Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* KYC Status Banner */}
                      <div className={`p-4 rounded-xl border-2 ${
                        user?.kycStatus === 'approved' 
                          ? 'bg-green-50 border-green-200' 
                          : user?.kycStatus === 'rejected'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            user?.kycStatus === 'approved' 
                              ? 'bg-green-500' 
                              : user?.kycStatus === 'rejected'
                              ? 'bg-red-500'
                              : 'bg-blue-500'
                          }`}>
                            {user?.kycStatus === 'approved' ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : user?.kycStatus === 'rejected' ? (
                              <XCircle className="w-6 h-6 text-white" />
                            ) : (
                              <AlertTriangle className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              KYC Status: {user?.kycStatus === 'approved' ? 'Verified' : 
                                          user?.kycStatus === 'rejected' ? 'Rejected' : 'Pending Verification'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {user?.kycStatus === 'approved' 
                                ? 'Your identity has been verified successfully. You can now withdraw winnings.'
                                : user?.kycStatus === 'rejected'
                                ? 'Your documents were rejected. Please resubmit with correct information.'
                                : 'Complete KYC verification to unlock withdrawals and higher limits.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {user?.kycStatus !== 'approved' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Document Upload */}
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="aadhaar">Aadhaar Document</Label>
                              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <div className="text-sm text-gray-600">
                                  <label htmlFor="aadhaar-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                                    Upload Aadhaar
                                  </label>
                                  <p>or drag and drop</p>
                                  <input id="aadhaar-upload" type="file" className="hidden" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="pan">PAN Document</Label>
                              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <div className="text-sm text-gray-600">
                                  <label htmlFor="pan-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-medium">
                                    Upload PAN
                                  </label>
                                  <p>or drag and drop</p>
                                  <input id="pan-upload" type="file" className="hidden" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</p>
                              </div>
                            </div>
                          </div>

                          {/* KYC Benefits */}
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                            <h4 className="font-semibold mb-4">KYC Benefits</h4>
                            <div className="space-y-3">
                              {[
                                { icon: Wallet, text: "Unlimited withdrawals" },
                                { icon: Shield, text: "Enhanced security" },
                                { icon: Zap, text: "Faster transactions" },
                                { icon: Gift, text: "Exclusive tournaments" },
                                { icon: Crown, text: "Priority support" },
                              ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <benefit.icon className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm">{benefit.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {user?.kycStatus !== 'approved' && (
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          Submit for Verification
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhanced Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Achievements & Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                            achievement.earned
                              ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shadow-lg`
                              : 'border-gray-200 bg-gray-50 opacity-60'
                          }`}
                        >
                          {achievement.earned && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-5 h-5 text-white/80" />
                            </div>
                          )}

                          <div className="text-center">
                            <div className="text-3xl mb-2">{achievement.icon}</div>
                            <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                            <p className={`text-xs mb-2 ${achievement.earned ? 'text-white/80' : 'text-gray-600'}`}>
                              {achievement.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${achievement.earned ? 'bg-white/20 text-white' : 'bg-gray-200'}`}
                              >
                                {achievement.rarity}
                              </Badge>
                              <div className={`text-xs font-semibold ${achievement.earned ? 'text-white' : 'text-gray-500'}`}>
                                +{achievement.xp} XP
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Achievement Progress */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <h4 className="font-semibold mb-3">Achievement Progress</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{achievements.filter(a => a.earned).length}</div>
                          <div className="text-xs text-gray-600">Unlocked</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{achievements.length}</div>
                          <div className="text-xs text-gray-600">Total</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {achievements.filter(a => a.earned).reduce((sum, a) => sum + a.xp, 0)}
                          </div>
                          <div className="text-xs text-gray-600">XP Earned</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            {Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%
                          </div>
                          <div className="text-xs text-gray-600">Completion</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}