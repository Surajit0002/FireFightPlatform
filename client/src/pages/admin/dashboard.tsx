import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";

export default function AdminDashboard() {
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/admin/dashboard"],
  });

  const { data: pendingWithdrawals = [] } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const kpiCards = [
    {
      title: "Total Users",
      value: dashboardStats?.totalUsers || 0,
      change: "+12% from last month",
      icon: Users,
      color: "bg-fire-blue",
      trend: "up"
    },
    {
      title: "Active Tournaments",
      value: dashboardStats?.activeTournaments || 0,
      change: "+3 this week",
      icon: Calendar,
      color: "bg-fire-red",
      trend: "up"
    },
    {
      title: "Total Payouts",
      value: `₹${dashboardStats?.totalPayouts || 0}`,
      change: "+25% this month",
      icon: DollarSign,
      color: "bg-fire-green",
      trend: "up"
    },
    {
      title: "Pending Reviews",
      value: dashboardStats?.pendingReviews || 0,
      change: "Needs attention",
      icon: AlertTriangle,
      color: "bg-fire-orange",
      trend: "alert"
    }
  ];

  const quickActions = [
    {
      title: "Create Tournament",
      description: "Set up a new tournament",
      icon: Plus,
      color: "bg-fire-red",
      action: "/admin/tournaments"
    },
    {
      title: "Review Results",
      description: "Verify match screenshots",
      icon: FileCheck,
      color: "bg-fire-blue",
      action: "/admin/match-results"
    },
    {
      title: "Process Withdrawals",
      description: "Approve pending withdrawals",
      icon: CheckCircle,
      color: "bg-fire-green",
      action: "/admin/wallet-finance"
    },
    {
      title: "Send Announcement",
      description: "Broadcast to users",
      icon: Megaphone,
      color: "bg-fire-teal",
      action: "/admin/announcements"
    }
  ];

  const recentActivity = [
    { id: 1, action: "New user registered", user: "ProGamer_X", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Tournament completed", tournament: "Free Fire Championship", time: "15 minutes ago", type: "tournament" },
    { id: 3, action: "Withdrawal processed", amount: "₹5,000", time: "30 minutes ago", type: "withdrawal" },
    { id: 4, action: "KYC document submitted", user: "ElitePlayer", time: "1 hour ago", type: "kyc" },
    { id: 5, action: "Support ticket created", ticket: "#1234", time: "2 hours ago", type: "support" },
  ];

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your esports platform</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                      <p className="text-3xl font-bold fire-gray">{kpi.value}</p>
                      <p className={`text-sm ${
                        kpi.trend === 'up' ? 'fire-green' : 
                        kpi.trend === 'alert' ? 'text-orange-500' : 'text-gray-500'
                      }`}>
                        {kpi.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 border-2 border-dashed hover:border-solid transition-all duration-200 group"
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-medium mb-1">{action.title}</h4>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Match Reviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Match Reviews</CardTitle>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center text-white font-bold">
                      FF
                    </div>
                    <div>
                      <p className="font-semibold fire-gray">Free Fire Championship</p>
                      <p className="text-sm text-gray-500">Screenshot submitted by Team Elite</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-fire-green hover:bg-green-600 text-white">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-fire-blue rounded-lg flex items-center justify-center text-white font-bold">
                      BG
                    </div>
                    <div>
                      <p className="font-semibold fire-gray">BGMI Pro League</p>
                      <p className="text-sm text-gray-500">Screenshot submitted by FireX Squad</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-fire-green hover:bg-green-600 text-white">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center text-white font-bold">
                      VL
                    </div>
                    <div>
                      <p className="font-semibold fire-gray">Valorant Weekly</p>
                      <p className="text-sm text-gray-500">Results verified and approved</p>
                    </div>
                  </div>
                  <Badge className="bg-fire-green text-white">✓ Approved</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Withdrawal Requests</CardTitle>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingWithdrawals.slice(0, 3).map((withdrawal: any) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {withdrawal.userId?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold fire-gray">User #{withdrawal.userId}</p>
                        <p className="text-sm text-gray-500">₹{withdrawal.amount} • KYC Verified</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-fire-green hover:bg-green-600 text-white">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingWithdrawals.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No pending withdrawals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-fire-blue' :
                    activity.type === 'tournament' ? 'bg-fire-red' :
                    activity.type === 'withdrawal' ? 'bg-fire-green' :
                    activity.type === 'kyc' ? 'bg-fire-orange' :
                    'bg-fire-teal'
                  }`}>
                    {activity.type === 'user' && <Users className="w-5 h-5 text-white" />}
                    {activity.type === 'tournament' && <Trophy className="w-5 h-5 text-white" />}
                    {activity.type === 'withdrawal' && <DollarSign className="w-5 h-5 text-white" />}
                    {activity.type === 'kyc' && <FileCheck className="w-5 h-5 text-white" />}
                    {activity.type === 'support' && <Settings className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {activity.user || activity.tournament || activity.amount || activity.ticket} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
