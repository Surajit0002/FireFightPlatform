import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Edit, 
  Shield, 
  Bell, 
  Lock, 
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CreditCard
} from "lucide-react";
import type { Transaction } from "@/types";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    upiId: user?.upiId || "",
  });

  const { data: recentTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/wallet/transactions"],
    select: (data) => data.slice(0, 5), // Get only recent 5 transactions
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("PUT", `/api/admin/users/${user?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      upiId: user?.upiId || "",
    });
    setIsEditing(false);
  };

  const getKycStatusIcon = () => {
    switch (user?.kycStatus) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-fire-green" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-fire-red" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getKycStatusText = () => {
    switch (user?.kycStatus) {
      case "approved":
        return { text: "Verified", color: "text-fire-green" };
      case "rejected":
        return { text: "Rejected", color: "text-fire-red" };
      default:
        return { text: "Pending", color: "text-orange-500" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fire-gray mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <CardTitle>Profile Information</CardTitle>
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={updateProfileMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            className="bg-fire-blue text-white"
                          >
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6 mb-8">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={user?.profileImageUrl} />
                        <AvatarFallback className="bg-fire-blue text-white text-2xl">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-fire-gray mb-2">Profile Picture</h3>
                        <p className="text-sm text-gray-500 mb-3">JPG, PNG or GIF. Max size of 2MB</p>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Photo
                        </Button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          value={formData.upiId}
                          onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                          disabled={!isEditing}
                          placeholder="yourname@upi"
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Required for withdrawals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* KYC Section */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>KYC Verification</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getKycStatusIcon()}
                        <div>
                          <p className="font-medium">Verification Status</p>
                          <p className={`text-sm ${getKycStatusText().color}`}>
                            {getKycStatusText().text}
                          </p>
                        </div>
                      </div>
                      
                      {user?.kycStatus !== "approved" && (
                        <Button className="bg-fire-blue text-white">
                          {user?.kycStatus === "pending" ? "View Status" : "Start Verification"}
                        </Button>
                      )}
                    </div>
                    
                    {user?.kycStatus !== "approved" && (
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Complete KYC verification to enable withdrawals and increase your transaction limits.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">Setup 2FA</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Login Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { device: "Chrome on Windows", location: "Mumbai, India", time: "2 hours ago", current: true },
                          { device: "Mobile App", location: "Mumbai, India", time: "1 day ago", current: false },
                          { device: "Chrome on Windows", location: "Delhi, India", time: "3 days ago", current: false },
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{session.device}</p>
                              <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {session.current ? (
                                <Badge className="bg-fire-green text-white">Current</Badge>
                              ) : (
                                <Button variant="outline" size="sm">Revoke</Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Tournament Updates</p>
                          <p className="text-sm text-gray-500">Get notified about tournament results and new tournaments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Match Reminders</p>
                          <p className="text-sm text-gray-500">Receive reminders before your matches start</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Prize Notifications</p>
                          <p className="text-sm text-gray-500">Get notified when you win prizes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotional Emails</p>
                          <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Profile in Leaderboards</p>
                          <p className="text-sm text-gray-500">Allow others to see your ranking and stats</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Online Status</p>
                          <p className="text-sm text-gray-500">Let others see when you're online</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Team Invitations</p>
                          <p className="text-sm text-gray-500">Let other players invite you to their teams</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-fire-red">
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-fire-blue text-white text-xl">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-fire-gray">{user?.username}</h3>
                  <p className="text-sm text-gray-500">Level {user?.level} • {user?.xp} XP</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Joined {new Date(user?.createdAt || "").toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{user?.email || "No email"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span>₹{parseFloat(user?.walletBalance || "0").toLocaleString()} balance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tournaments</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tournaments Won</span>
                  <span className="font-semibold text-fire-green">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-fire-blue">₹{parseFloat(user?.walletBalance || "0").toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Level</span>
                  <span className="font-semibold">{user?.level}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No recent activity
                    </div>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-fire-blue rounded-lg flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {transaction.description || transaction.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`text-sm font-semibold ${
                          ["deposit", "prize_payout", "bonus"].includes(transaction.type)
                            ? "text-fire-green"
                            : "text-fire-red"
                        }`}>
                          {["deposit", "prize_payout", "bonus"].includes(transaction.type) ? "+" : "-"}
                          ₹{parseFloat(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
