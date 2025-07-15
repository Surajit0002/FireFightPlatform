import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Eye,
  Edit,
  Ban,
  Shield,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  Flag,
} from "lucide-react";
import type { User, Team } from "@shared/schema";

export default function AdminUsersTeams() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowUserModal(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mock user data for demonstration
  const mockUsers = [
    {
      id: "user1",
      username: "ProGamer_X",
      email: "progamer@example.com",
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: "",
      walletBalance: "2450.00",
      totalEarnings: "15000.00",
      winRate: "85.5",
      matchesPlayed: 45,
      xpPoints: 2500,
      level: 8,
      kycStatus: "approved",
      upiId: "progamer@paytm",
      isActive: true,
      role: "user",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    },
    {
      id: "user2",
      username: "ElitePlayer",
      email: "elite@example.com",
      firstName: "Jane",
      lastName: "Smith",
      profileImageUrl: "",
      walletBalance: "1200.00",
      totalEarnings: "8500.00",
      winRate: "78.2",
      matchesPlayed: 32,
      xpPoints: 1800,
      level: 6,
      kycStatus: "pending",
      upiId: "elite@phonepe",
      isActive: true,
      role: "user",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const mockTeams = [
    {
      id: 1,
      name: "Team Elite",
      code: "ELITE1",
      logoUrl: "",
      captainId: "user1",
      captainName: "ProGamer_X",
      totalMembers: 4,
      winRate: "92.5",
      totalEarnings: "45000.00",
      matchesPlayed: 28,
      isActive: true,
      createdAt: new Date().toISOString(),
      members: ["ProGamer_X", "Player2", "Player3", "Player4"]
    },
    {
      id: 2,
      name: "FireX Squad",
      code: "FIREX",
      logoUrl: "",
      captainId: "user2",
      captainName: "ElitePlayer",
      totalMembers: 3,
      winRate: "87.1",
      totalEarnings: "32000.00",
      matchesPlayed: 22,
      isActive: true,
      createdAt: new Date().toISOString(),
      members: ["ElitePlayer", "Player5", "Player6"]
    }
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.isActive) ||
                         (statusFilter === "inactive" && !user.isActive);
    const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter;
    return matchesSearch && matchesStatus && matchesKyc;
  });

  const filteredTeams = mockTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-fire-green';
      case 'pending': return 'bg-fire-orange';
      case 'rejected': return 'bg-fire-red';
      default: return 'bg-gray-500';
    }
  };

  const handleUserAction = (action: string, user: any) => {
    let updateData = {};
    
    switch (action) {
      case 'activate':
        updateData = { isActive: true };
        break;
      case 'deactivate':
        updateData = { isActive: false };
        break;
      case 'verify_kyc':
        updateData = { kycStatus: 'approved' };
        break;
      case 'reject_kyc':
        updateData = { kycStatus: 'rejected' };
        break;
    }

    updateUserMutation.mutate({ id: user.id, data: updateData });
  };

  const UserDetailsModal = () => (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        {selectedUser && (
          <div className="space-y-6">
            {/* User Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={selectedUser.profileImageUrl} />
                    <AvatarFallback className="text-2xl">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{selectedUser.username}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <Badge className={`mt-2 ${selectedUser.isActive ? 'bg-fire-green' : 'bg-fire-red'} text-white`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{selectedUser.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium">{selectedUser.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matches:</span>
                    <span className="font-medium">{selectedUser.matchesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">XP Points:</span>
                    <span className="font-medium">{selectedUser.xpPoints}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Financial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet:</span>
                    <span className="font-medium fire-green">₹{selectedUser.walletBalance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings:</span>
                    <span className="font-medium fire-blue">₹{selectedUser.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">KYC Status:</span>
                    <Badge className={`${getKycStatusColor(selectedUser.kycStatus)} text-white text-xs`}>
                      {selectedUser.kycStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UPI ID:</span>
                    <span className="font-medium text-sm">{selectedUser.upiId}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Joined</label>
                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Login</label>
                    <p className="font-medium">{new Date(selectedUser.lastLoginAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              {selectedUser.isActive ? (
                <Button
                  onClick={() => handleUserAction('deactivate', selectedUser)}
                  className="bg-fire-red hover:bg-red-600 text-white"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Deactivate User
                </Button>
              ) : (
                <Button
                  onClick={() => handleUserAction('activate', selectedUser)}
                  className="bg-fire-green hover:bg-green-600 text-white"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activate User
                </Button>
              )}
              
              {selectedUser.kycStatus === 'pending' && (
                <>
                  <Button
                    onClick={() => handleUserAction('verify_kyc', selectedUser)}
                    className="bg-fire-blue hover:bg-blue-600 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify KYC
                  </Button>
                  <Button
                    onClick={() => handleUserAction('reject_kyc', selectedUser)}
                    variant="outline"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Reject KYC
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const TeamDetailsModal = () => (
    <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Team Details</DialogTitle>
        </DialogHeader>
        
        {selectedTeam && (
          <div className="space-y-6">
            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-fire-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {selectedTeam.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedTeam.name}</h3>
                      <p className="text-gray-500">#{selectedTeam.code}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Captain:</span>
                      <span className="font-medium">{selectedTeam.captainName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members:</span>
                      <span className="font-medium">{selectedTeam.totalMembers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(selectedTeam.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium fire-green">{selectedTeam.winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Earnings:</span>
                    <span className="font-medium fire-blue">₹{selectedTeam.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matches Played:</span>
                    <span className="font-medium">{selectedTeam.matchesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${selectedTeam.isActive ? 'bg-fire-green' : 'bg-fire-red'} text-white`}>
                      {selectedTeam.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedTeam.members.map((member: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member}</div>
                          <div className="text-sm text-gray-500">
                            {index === 0 ? 'Captain' : 'Member'}
                          </div>
                        </div>
                      </div>
                      {index === 0 && <Crown className="w-5 h-5 text-fire-orange" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Users & Teams</h1>
          <p className="text-gray-600">Manage user accounts and team organizations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold fire-gray">{mockUsers.length}</p>
                  <p className="text-sm fire-green">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold fire-gray">{mockUsers.filter(u => u.isActive).length}</p>
                  <p className="text-sm fire-green">98% active rate</p>
                </div>
                <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-3xl font-bold fire-gray">{mockTeams.length}</p>
                  <p className="text-sm fire-blue">+5 this week</p>
                </div>
                <div className="w-12 h-12 bg-fire-orange rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">KYC Pending</p>
                  <p className="text-3xl font-bold fire-gray">{mockUsers.filter(u => u.kycStatus === 'pending').length}</p>
                  <p className="text-sm text-orange-500">Needs review</p>
                </div>
                <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="teams">Teams Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="User Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={kycFilter} onValueChange={setKycFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="KYC Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All KYC</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={user.profileImageUrl} />
                              <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-fire-orange" />
                            <span className="font-medium">{user.level}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{user.winRate}% WR</div>
                            <div className="text-xs text-gray-500">{user.matchesPlayed} matches</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium fire-green">₹{user.walletBalance}</div>
                            <div className="text-xs text-gray-500">₹{user.totalEarnings} earned</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getKycStatusColor(user.kycStatus)} text-white`}>
                            {user.kycStatus.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${user.isActive ? 'bg-fire-green' : 'bg-fire-red'} text-white`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Teams Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <Input
                      type="text"
                      placeholder="Search teams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Captain</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-fire-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {team.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{team.name}</div>
                              <div className="text-sm text-gray-500">#{team.code}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-fire-orange" />
                            <span className="font-medium">{team.captainName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{team.totalMembers}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium fire-green">{team.winRate}% WR</div>
                            <div className="text-xs text-gray-500">{team.matchesPlayed} matches</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium fire-blue">₹{team.totalEarnings}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${team.isActive ? 'bg-fire-green' : 'bg-fire-red'} text-white`}>
                            {team.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowTeamModal(true);
                              }}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <UserDetailsModal />
        <TeamDetailsModal />
      </main>
    </AdminLayout>
  );
}
