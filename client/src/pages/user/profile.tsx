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
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      upiId: user?.upiId || "",
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

  const achievements = [
    { id: 1, name: "First Victory", description: "Win your first tournament", earned: true, icon: "🏆" },
    { id: 2, name: "Team Player", description: "Join a team", earned: true, icon: "👥" },
    { id: 3, name: "Rising Star", description: "Reach level 5", earned: true, icon: "⭐" },
    { id: 4, name: "Tournament Master", description: "Win 10 tournaments", earned: false, icon: "🎯" },
    { id: 5, name: "Elite Player", description: "Reach top 10 leaderboard", earned: false, icon: "👑" },
    { id: 6, name: "Cash Collector", description: "Earn ₹10,000", earned: false, icon: "💰" },
  ];

  const securityLog = [
    { id: 1, action: "Login", device: "Chrome on Windows", ip: "192.168.1.1", time: "2 hours ago" },
    { id: 2, action: "Profile Update", device: "Mobile App", ip: "192.168.1.2", time: "1 day ago" },
    { id: 3, action: "Password Change", device: "Chrome on Windows", ip: "192.168.1.1", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Profile & Settings</h1>
          <p className="text-gray-600">
            Manage your account information, preferences, and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="text-2xl">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-fire-blue hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="text-lg font-semibold fire-gray mb-1">
                  {user?.username || "Player"}
                </h3>
                <p className="text-gray-500 mb-4">Level {user?.level || 1} Player</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>XP Progress</span>
                    <span>{currentXP}/{xpToNextLevel}</span>
                  </div>
                  <Progress value={xpProgress} className="w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold fire-green">₹{user?.totalEarnings || "0.00"}</div>
                    <div className="text-xs text-gray-500">Earnings</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold fire-blue">{user?.winRate || 0}%</div>
                    <div className="text-xs text-gray-500">Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matches Played:</span>
                    <span className="font-semibold">{user?.matchesPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Balance:</span>
                    <span className="font-semibold fire-green">₹{user?.walletBalance || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">KYC Status:</span>
                    <Badge variant={user?.kycStatus === 'approved' ? 'default' : 'secondary'}>
                      {user?.kycStatus || 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-semibold">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          {...register("username", { required: "Username is required" })}
                          placeholder="Enter username"
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
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          {...register("upiId")}
                          placeholder="Enter UPI ID (e.g., yourname@paytm)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Required for withdrawals. Ensure this is accurate.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="bg-fire-blue hover:bg-blue-600 text-white"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Security Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Change Password</h4>
                        <div className="space-y-3">
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Current password"
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
                          <Input type="password" placeholder="New password" />
                          <Input type="password" placeholder="Confirm new password" />
                        </div>
                        <Button className="mt-3 bg-fire-red hover:bg-red-600 text-white">
                          Update Password
                        </Button>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Login History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {securityLog.map((log) => (
                          <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium">{log.action}</div>
                              <div className="text-sm text-gray-500">
                                {log.device} • {log.ip}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">{log.time}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Tournament Updates</h4>
                          <p className="text-sm text-gray-600">
                            Get notified when tournaments start or when results are available
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Wallet Activities</h4>
                          <p className="text-sm text-gray-600">
                            Notifications for deposits, withdrawals, and winnings
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Team Invitations</h4>
                          <p className="text-sm text-gray-600">
                            Get notified when someone invites you to join their team
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Promotional Offers</h4>
                          <p className="text-sm text-gray-600">
                            Receive notifications about special offers and bonuses
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-600">
                            Receive important updates via email
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">
                            Get SMS alerts for critical account activities
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* KYC Tab */}
              <TabsContent value="kyc" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>KYC Verification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-fire-blue rounded-full flex items-center justify-center">
                          {user?.kycStatus === 'approved' ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : user?.kycStatus === 'rejected' ? (
                            <XCircle className="w-6 h-6 text-white" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            KYC Status: {user?.kycStatus === 'approved' ? 'Verified' : 
                                        user?.kycStatus === 'rejected' ? 'Rejected' : 'Pending'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {user?.kycStatus === 'approved' 
                              ? 'Your identity has been verified successfully.'
                              : user?.kycStatus === 'rejected'
                              ? 'Your documents were rejected. Please resubmit with correct information.'
                              : 'Complete KYC verification to unlock all features and withdraw winnings.'}
                          </p>
                        </div>
                      </div>

                      {user?.kycStatus !== 'approved' && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="aadhaar">Aadhaar Document</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <label htmlFor="aadhaar-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-fire-blue hover:text-blue-500">
                                    <span>Upload Aadhaar</span>
                                    <input id="aadhaar-upload" name="aadhaar-upload" type="file" className="sr-only" />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="pan">PAN Document</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <label htmlFor="pan-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-fire-blue hover:text-blue-500">
                                    <span>Upload PAN</span>
                                    <input id="pan-upload" name="pan-upload" type="file" className="sr-only" />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                              </div>
                            </div>
                          </div>

                          <Button className="bg-fire-green hover:bg-green-600 text-white">
                            Submit for Verification
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>Achievements & Badges</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-lg border-2 ${
                            achievement.earned
                              ? 'border-fire-green bg-green-50'
                              : 'border-gray-200 bg-gray-50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-medium">{achievement.name}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                            {achievement.earned && (
                              <CheckCircle className="w-6 h-6 text-fire-green" />
                            )}
                          </div>
                        </div>
                      ))}
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
