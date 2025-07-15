
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  FileCheck,
  Megaphone,
  Settings,
  Activity,
  Target,
  Zap,
  Eye,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  Bell,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    ongoingMatches: 0,
    serverStatus: "online",
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/admin/dashboard", dateRange],
  });

  const { data: pendingWithdrawals = [] } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeUsers: Math.floor(Math.random() * 500) + 100,
        ongoingMatches: Math.floor(Math.random() * 20) + 5,
        serverStatus: Math.random() > 0.1 ? "online" : "maintenance",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 2000);
  };

  const kpiCards = [
    {
      title: "Total Users",
      value: dashboardStats?.totalUsers || 0,
      change: "+12% from last month",
      changeType: "positive",
      icon: Users,
      color: "from-fire-blue to-blue-600",
      trend: [65, 70, 68, 85, 90, 95, 100],
      target: 1500,
      current: dashboardStats?.totalUsers || 0,
    },
    {
      title: "Active Tournaments",
      value: dashboardStats?.activeTournaments || 0,
      change: "+3 this week",
      changeType: "positive",
      icon: Calendar,
      color: "from-fire-red to-red-600",
      trend: [45, 52, 48, 61, 55, 67, 73],
      target: 50,
      current: dashboardStats?.activeTournaments || 0,
    },
    {
      title: "Total Payouts",
      value: `₹${dashboardStats?.totalPayouts || 0}`,
      change: "+25% this month",
      changeType: "positive",
      icon: DollarSign,
      color: "from-fire-green to-green-600",
      trend: [30, 40, 35, 50, 49, 60, 70],
      target: 100000,
      current: dashboardStats?.totalPayouts || 0,
    },
    {
      title: "Active Users",
      value: realTimeData.activeUsers,
      change: "Live count",
      changeType: "neutral",
      icon: Activity,
      color: "from-fire-orange to-orange-600",
      trend: [80, 85, 82, 90, 88, 92, 95],
      target: 500,
      current: realTimeData.activeUsers,
      isLive: true,
    },
  ];

  const quickActions = [
    {
      title: "Create Tournament",
      description: "Set up a new tournament",
      icon: Plus,
      color: "from-fire-red to-red-600",
      action: "/admin/tournaments",
      badge: "Popular",
    },
    {
      title: "Review Results",
      description: "Verify match screenshots",
      icon: FileCheck,
      color: "from-fire-blue to-blue-600",
      action: "/admin/match-results",
      badge: "Urgent",
    },
    {
      title: "Process Withdrawals",
      description: "Approve pending withdrawals",
      icon: CheckCircle,
      color: "from-fire-green to-green-600",
      action: "/admin/wallet-finance",
      badge: pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length} Pending` : null,
    },
    {
      title: "Send Announcement",
      description: "Broadcast to users",
      icon: Megaphone,
      color: "from-fire-teal to-teal-600",
      action: "/admin/announcements",
    },
    {
      title: "View Analytics",
      description: "Platform insights",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      action: "/admin/analytics",
    },
    {
      title: "Manage Users",
      description: "User administration",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      action: "/admin/users-teams",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New user registered",
      user: "ProGamer_X",
      time: "2 minutes ago",
      type: "user",
      priority: "normal",
    },
    {
      id: 2,
      action: "Tournament completed",
      tournament: "Free Fire Championship",
      time: "15 minutes ago",
      type: "tournament",
      priority: "high",
    },
    {
      id: 3,
      action: "Withdrawal processed",
      amount: "₹5,000",
      time: "30 minutes ago",
      type: "withdrawal",
      priority: "normal",
    },
    {
      id: 4,
      action: "KYC document submitted",
      user: "ElitePlayer",
      time: "1 hour ago",
      type: "kyc",
      priority: "urgent",
    },
    {
      id: 5,
      action: "Support ticket created",
      ticket: "#1234",
      time: "2 hours ago",
      type: "support",
      priority: "normal",
    },
  ];

  const systemHealth = [
    { service: "API Server", status: "healthy", uptime: "99.9%", responseTime: "45ms" },
    { service: "Database", status: "healthy", uptime: "99.8%", responseTime: "12ms" },
    { service: "File Storage", status: "warning", uptime: "98.5%", responseTime: "89ms" },
    { service: "Payment Gateway", status: "healthy", uptime: "99.7%", responseTime: "67ms" },
  ];

  return (
    <AdminLayout>
      <main className="p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor and manage your esports platform • {new Date().toLocaleDateString()}
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Server Online
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                {realTimeData.activeUsers} Active Users
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                {realTimeData.ongoingMatches} Live Matches
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-fire-blue to-blue-600 hover:from-blue-600 hover:to-fire-blue"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            const progressPercentage = (kpi.current / kpi.target) * 100;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${kpi.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {kpi.isLive && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-red-500 font-medium">LIVE</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <LineChart className="w-8 h-8 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${
                        kpi.changeType === 'positive' ? 'text-green-600' : 
                        kpi.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {kpi.change}
                      </p>
                      <span className="text-xs text-gray-500">{Math.round(progressPercentage)}% of target</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Health Dashboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>System Health</span>
              </CardTitle>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{service.service}</h4>
                    <Badge className={
                      service.status === 'healthy' ? 'bg-green-100 text-green-800' :
                      service.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response:</span>
                      <span className="font-medium">{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 border-2 border-dashed hover:border-solid transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                        <div className="text-center relative z-10">
                          <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-medium mb-1">{action.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">{action.description}</p>
                          {action.badge && (
                            <Badge className="text-xs bg-fire-red text-white">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Live Activity</span>
              </CardTitle>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      activity.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                      activity.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'user' && <Users className="w-4 h-4" />}
                      {activity.type === 'tournament' && <Trophy className="w-4 h-4" />}
                      {activity.type === 'withdrawal' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'kyc' && <FileCheck className="w-4 h-4" />}
                      {activity.type === 'support' && <Settings className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.user || activity.tournament || activity.amount || activity.ticket} • {activity.time}
                      </p>
                    </div>
                    {activity.priority === 'urgent' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Match Reviews */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5" />
                <span>Pending Match Reviews</span>
                <Badge className="bg-orange-100 text-orange-800">Urgent</Badge>
              </CardTitle>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-fire-red to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      FF
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Free Fire Championship</p>
                      <p className="text-sm text-gray-600">Screenshot submitted by Team Elite</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-red-50 hover:border-red-300">
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-fire-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      BG
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">BGMI Pro League</p>
                      <p className="text-sm text-gray-600">Screenshot submitted by FireX Squad</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">5 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-red-50 hover:border-red-300">
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Requests */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Withdrawal Requests</span>
                <Badge className="bg-blue-100 text-blue-800">{pendingWithdrawals.length}</Badge>
              </CardTitle>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingWithdrawals.slice(0, 2).map((withdrawal: any) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="border-2 border-white shadow-lg">
                        <AvatarFallback className="bg-gradient-to-r from-fire-teal to-teal-600 text-white">
                          {withdrawal.userId?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">User #{withdrawal.userId || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">₹{withdrawal.amount || '0'} • KYC Verified</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">Verified Account</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-red-50 hover:border-red-300">
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingWithdrawals.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No pending withdrawals</p>
                    <p className="text-sm text-gray-400">All requests have been processed</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
}
