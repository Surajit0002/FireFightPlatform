import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileCheck, 
  Plus, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react";
import type { DashboardStats, TournamentParticipant, Transaction } from "@/types";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
  });

  const { data: pendingResults = [] } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/admin/pending-results"],
    queryFn: async () => {
      // This would be a separate endpoint for pending results
      return [];
    },
  });

  const { data: withdrawalRequests = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/withdrawal-requests"],
    queryFn: async () => {
      // This would be a separate endpoint for withdrawal requests
      return [];
    },
  });

  const kpiCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toLocaleString() || "0",
      change: "+12% from last month",
      changeType: "positive",
      icon: Users,
      bgColor: "bg-fire-blue",
    },
    {
      title: "Active Tournaments",
      value: stats?.activeTournaments.toString() || "0",
      change: "+3 this week",
      changeType: "positive",
      icon: Calendar,
      bgColor: "bg-fire-red",
    },
    {
      title: "Total Payouts",
      value: `₹${parseFloat(stats?.totalPayouts || "0").toLocaleString()}`,
      change: "+25% this month",
      changeType: "positive",
      icon: DollarSign,
      bgColor: "bg-fire-green",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews.toString() || "0",
      change: "Needs attention",
      changeType: "warning",
      icon: FileCheck,
      bgColor: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Create Tournament",
      icon: Plus,
      color: "hover:border-fire-red hover:bg-fire-red hover:text-white",
    },
    {
      title: "Review Results", 
      icon: CheckCircle,
      color: "hover:border-fire-blue hover:bg-fire-blue hover:text-white",
    },
    {
      title: "Process Withdrawals",
      icon: DollarSign,
      color: "hover:border-fire-green hover:bg-fire-green hover:text-white",
    },
    {
      title: "Send Announcement",
      icon: Users,
      color: "hover:border-fire-teal hover:bg-fire-teal hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-fire-gray">Admin Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user?.firstName || "Admin"}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Avatar>
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-fire-teal text-white">
                      {user?.firstName?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {kpiCards.map((kpi) => (
                <Card key={kpi.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                        <p className="text-3xl font-bold text-fire-gray">{kpi.value}</p>
                        <p className={`text-sm ${
                          kpi.changeType === "positive" 
                            ? "text-fire-green" 
                            : kpi.changeType === "warning"
                              ? "text-orange-500"
                              : "text-gray-500"
                        }`}>
                          {kpi.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                        <kpi.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      className={`p-4 h-auto border-2 border-dashed transition-all duration-200 group ${action.color}`}
                    >
                      <div className="text-center">
                        <action.icon className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-white" />
                        <p className="font-medium">{action.title}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Match Reviews */}
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Pending Match Reviews</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pendingResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No pending reviews</p>
                      </div>
                    ) : (
                      pendingResults.map((result) => (
                        <div key={result.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center text-white font-bold">
                              FF
                            </div>
                            <div>
                              <p className="font-semibold text-fire-gray">Tournament Result</p>
                              <p className="text-sm text-gray-500">Screenshot submitted</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-fire-green text-white">
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Withdrawal Requests */}
              <Card>
                <CardHeader className="border-b border-gray-200">
                  <CardTitle>Withdrawal Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {withdrawalRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No pending withdrawals</p>
                      </div>
                    ) : (
                      withdrawalRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-fire-gray">User Request</p>
                              <p className="text-sm text-gray-500">₹{parseFloat(request.amount).toLocaleString()} • KYC Verified</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-fire-green text-white">
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
