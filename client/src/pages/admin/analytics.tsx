
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Trophy,
  Activity,
  Calendar,
  Target,
  Eye,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Star,
  Zap,
} from "lucide-react";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics", dateRange],
    queryFn: async () => {
      // Mock data - replace with actual API call
      return {
        totalUsers: 1247,
        activeUsers: 892,
        totalRevenue: 125000,
        totalTournaments: 156,
        avgSessionTime: "24m 35s",
        conversionRate: 12.4,
        userGrowth: [
          { date: "2024-01-01", users: 800, revenue: 45000 },
          { date: "2024-01-02", users: 850, revenue: 48000 },
          { date: "2024-01-03", users: 920, revenue: 52000 },
          { date: "2024-01-04", users: 980, revenue: 55000 },
          { date: "2024-01-05", users: 1100, revenue: 62000 },
          { date: "2024-01-06", users: 1180, revenue: 68000 },
          { date: "2024-01-07", users: 1247, revenue: 72000 },
        ],
        gamePopularity: [
          { game: "Free Fire", users: 450, percentage: 36, color: "from-red-500 to-red-600" },
          { game: "BGMI", users: 380, percentage: 31, color: "from-blue-500 to-blue-600" },
          { game: "Valorant", users: 280, percentage: 22, color: "from-green-500 to-green-600" },
          { game: "CS:GO", users: 137, percentage: 11, color: "from-purple-500 to-purple-600" },
        ],
        deviceStats: [
          { device: "Mobile", users: 850, percentage: 68 },
          { device: "Desktop", users: 297, percentage: 24 },
          { device: "Tablet", users: 100, percentage: 8 },
        ],
        topRegions: [
          { region: "Mumbai", users: 245, percentage: 19.6 },
          { region: "Delhi", users: 198, percentage: 15.9 },
          { region: "Bangalore", users: 167, percentage: 13.4 },
          { region: "Chennai", users: 134, percentage: 10.7 },
          { region: "Kolkata", users: 112, percentage: 9.0 },
        ],
      };
    },
  });

  const dateRanges = [
    { value: "1d", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
    { value: "1y", label: "Last Year" },
  ];

  const kpiMetrics = [
    {
      title: "Total Users",
      value: analytics?.totalUsers || 0,
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      target: 1500,
      description: "Registered platform users",
    },
    {
      title: "Active Users",
      value: analytics?.activeUsers || 0,
      change: "+8%",
      changeType: "positive",
      icon: Activity,
      color: "from-green-500 to-green-600",
      target: 1000,
      description: "Users active in selected period",
    },
    {
      title: "Total Revenue",
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString()}`,
      change: "+25%",
      changeType: "positive",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      target: 150000,
      description: "Platform revenue generated",
    },
    {
      title: "Tournaments",
      value: analytics?.totalTournaments || 0,
      change: "+18%",
      changeType: "positive",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
      target: 200,
      description: "Tournaments completed",
    },
    {
      title: "Avg Session",
      value: analytics?.avgSessionTime || "0m",
      change: "+5%",
      changeType: "positive",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      target: 30,
      description: "Average user session time",
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.conversionRate || 0}%`,
      change: "+2.1%",
      changeType: "positive",
      icon: Target,
      color: "from-orange-500 to-orange-600",
      target: 15,
      description: "User to player conversion",
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <AdminLayout>
      <main className="p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-fire-blue to-purple-600 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Deep insights into platform performance and user behavior
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-fire-blue to-blue-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {kpiMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const progressValue = typeof metric.value === 'number' ? 
              (metric.value / metric.target) * 100 : 
              parseFloat(metric.value.replace(/[^\d.]/g, '')) / metric.target * 100;
            
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-15 transition-opacity`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      metric.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {metric.changeType === 'positive' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                      {metric.change}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                    <Progress value={Math.min(progressValue, 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>User Growth Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-600 font-medium">Interactive Growth Chart</p>
                      <p className="text-sm text-gray-500">User acquisition over time</p>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">+12%</p>
                          <p className="text-xs text-gray-500">Growth Rate</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">1,247</p>
                          <p className="text-xs text-gray-500">Total Users</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">892</p>
                          <p className="text-xs text-gray-500">Active Users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Game Popularity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Game Popularity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.gamePopularity?.map((game, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 bg-gradient-to-r ${game.color} rounded-full`}></div>
                            <span className="font-medium">{game.game}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{game.users}</span>
                            <span className="text-sm text-gray-500 ml-2">({game.percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={game.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Device Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Device Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.deviceStats?.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {device.device === 'Mobile' && <Smartphone className="w-5 h-5 text-blue-500" />}
                          {device.device === 'Desktop' && <Monitor className="w-5 h-5 text-green-500" />}
                          {device.device === 'Tablet' && <Tablet className="w-5 h-5 text-purple-500" />}
                          <span className="font-medium">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{device.users}</p>
                          <p className="text-sm text-gray-500">{device.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Regions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Top Regions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.topRegions?.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-fire-blue to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{region.users}</p>
                          <p className="text-xs text-gray-500">{region.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-700">Conversion Rate</span>
                        <span className="text-lg font-bold text-green-800">12.4%</span>
                      </div>
                      <Progress value={12.4} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">Bounce Rate</span>
                        <span className="text-lg font-bold text-blue-800">23.7%</span>
                      </div>
                      <Progress value={23.7} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-700">Retention Rate</span>
                        <span className="text-lg font-bold text-purple-800">67.2%</span>
                      </div>
                      <Progress value={67.2} className="h-2 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <div>
                          <span className="font-medium">New Users (30d)</span>
                          <p className="text-sm text-gray-500">User acquisition this month</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-600 text-white text-lg px-3 py-1">+342</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-8 h-8 text-green-600" />
                        <div>
                          <span className="font-medium">Active Users (7d)</span>
                          <p className="text-sm text-gray-500">Weekly active users</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white text-lg px-3 py-1">892</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Target className="w-8 h-8 text-purple-600" />
                        <div>
                          <span className="font-medium">Retention Rate</span>
                          <p className="text-sm text-gray-500">7-day retention</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-600 text-white text-lg px-3 py-1">67%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <div className="text-center">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                      <p className="text-gray-600 font-medium">User Activity Heatmap</p>
                      <p className="text-sm text-gray-500">Peak hours: 7-11 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <span className="font-medium">Tournament Entry Fees</span>
                      <div className="text-right">
                        <Badge className="bg-green-600 text-white">₹89,340</Badge>
                        <p className="text-sm text-gray-500 mt-1">71.5%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <span className="font-medium">Platform Fees</span>
                      <div className="text-right">
                        <Badge className="bg-blue-600 text-white">₹23,180</Badge>
                        <p className="text-sm text-gray-500 mt-1">18.5%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                      <span className="font-medium">Premium Features</span>
                      <div className="text-right">
                        <Badge className="bg-purple-600 text-white">₹12,480</Badge>
                        <p className="text-sm text-gray-500 mt-1">10.0%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                    <div className="text-center">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                      <p className="text-gray-600 font-medium">Revenue trends chart</p>
                      <p className="text-sm text-gray-500">+25% growth this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <span className="font-medium">Completed Tournaments</span>
                      <Badge className="bg-yellow-600 text-white text-lg px-3 py-1">156</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <span className="font-medium">Average Participants</span>
                      <Badge className="bg-green-600 text-white text-lg px-3 py-1">24</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <span className="font-medium">Success Rate</span>
                      <Badge className="bg-blue-600 text-white text-lg px-3 py-1">94%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Game Modes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
                    <div className="text-center">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                      <p className="text-gray-600 font-medium">Game mode popularity chart</p>
                      <p className="text-sm text-gray-500">Squad mode leads at 45%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <p className="text-2xl font-bold">24m 35s</p>
                      <p className="text-sm text-gray-500">Avg Session Time</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">4.2</p>
                      <p className="text-sm text-gray-500">Pages per Session</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                      <Star className="w-8 h-8 mx-auto mb-2 text-rose-600" />
                      <p className="text-2xl font-bold">4.6/5</p>
                      <p className="text-sm text-gray-500">User Rating</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                      <Globe className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                      <p className="text-2xl font-bold">23.7%</p>
                      <p className="text-sm text-gray-500">Bounce Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tournaments</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Teams</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Wallet</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </AdminLayout>
  );
}
