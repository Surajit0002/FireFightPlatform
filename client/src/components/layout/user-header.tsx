import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import {
  Flame, Menu, Wallet, Bell, ChevronDown, User, Settings,
  Home, Trophy, Users2, BarChart3, MessageSquare,
  Target, Gamepad2, LogOut, Crown, Star, Zap, ShoppingCart,
  TrendingUp, Award, Play, Filter, X, Search
} from "lucide-react";
import { useState } from "react";

export default function UserHeader() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      current: location === "/",
      icon: Home,
      color: "bg-blue-600"
    },
    {
      name: "Tournaments",
      href: "/tournaments",
      current: location === "/tournaments",
      icon: Trophy,
      color: "bg-yellow-600"
    },
    {
      name: "Teams",
      href: "/teams",
      current: location === "/teams",
      icon: Users2,
      color: "bg-green-600"
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      current: location === "/leaderboard",
      icon: BarChart3,
      color: "bg-purple-600"
    },
    {
      name: "Matches",
      href: "/match-center",
      current: location === "/match-center",
      icon: Target,
      color: "bg-red-600"
    },
  ];

  const quickActions = [
    { name: "Quick Match", icon: Play, color: "bg-fire-red" },
    { name: "Create Team", icon: Users2, color: "bg-fire-blue" },
    { name: "Join Tournament", icon: Trophy, color: "bg-fire-green" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b-2 border-gray-200">
      {/* Top Banner */}
      <div className="bg-fire-red text-white py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">🔥 FireFight Championship 2024 - Live Now!</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge className="bg-white text-fire-red border-0 hover:bg-gray-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                Hot
              </Badge>
              <span className="text-sm">Prize Pool: ₹50,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <div className="w-12 h-12 bg-fire-red rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-fire-green rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-fire-red">FireFight</span>
                      <Badge className="bg-fire-blue text-white border-0 text-xs px-2 py-1">
                        Pro
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Esports Platform</div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group ${
                      item.current
                        ? `${item.color} text-white shadow-lg`
                        : "text-gray-700 hover:bg-gray-100"
                    }`}>
                      <div className={`p-1 rounded-md ${item.current ? 'bg-white bg-opacity-20' : ''}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                      {item.current && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Search - Desktop */}
              <div className="hidden md:block relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search tournaments, teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-64 border-2 border-gray-200 focus:border-fire-red focus:ring-fire-red rounded-lg h-10"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Search - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden hover:bg-gray-100 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Quick Actions - Desktop */}
              <div className="hidden xl:flex items-center space-x-1">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={action.name}
                      variant="ghost"
                      size="sm"
                      className={`${action.color} text-white hover:opacity-90 transition-all duration-300 hover:scale-105`}
                    >
                      <IconComponent className="w-4 h-4 mr-1" />
                      <span className="hidden 2xl:inline">{action.name}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Wallet */}
              <Link href="/wallet">
                <Button className="bg-fire-green hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">₹{user?.walletBalance || "1,250"}</span>
                </Button>
              </Link>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-lg"
                  >
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-fire-red rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="p-4 bg-fire-red text-white rounded-t-lg">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-sm opacity-90">3 new notifications</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Tournament Starting Soon</p>
                          <p className="text-xs text-gray-500">Valorant Championship in 30 mins</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2"
                  >
                    <Avatar className="w-8 h-8 border-2 border-fire-red">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-fire-red text-white font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-700 text-sm">{user?.username || "Player"}</span>
                        <Crown className="w-3 h-3 text-yellow-500" />
                      </div>
                      <div className="text-xs text-gray-500">Level 25 • Pro</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-0">
                  <div className="p-4 bg-fire-red text-white rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12 border-2 border-white">
                        <AvatarImage src={user?.profileImageUrl || ""} />
                        <AvatarFallback className="bg-white text-fire-red font-bold">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{user?.username || "Player"}</div>
                        <div className="text-sm opacity-90">{user?.email}</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-300" />
                          <span className="text-xs">Pro Member</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/my-tournaments">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                        <Trophy className="w-4 h-4 mr-3" />
                        My Tournaments
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/match-center">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                        <Gamepad2 className="w-4 h-4 mr-3" />
                        Match Center
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => window.location.href = '/api/logout'}
                    className="cursor-pointer text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100 rounded-lg">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-4 bg-fire-red text-white">
                    <SheetTitle className="flex items-center space-x-2 text-white">
                      <Flame className="w-5 h-5" />
                      <span>FireFight Menu</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="p-4 space-y-4">
                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      {navigation.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link key={item.name} href={item.href}>
                            <div
                              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                item.current
                                  ? `${item.color} text-white shadow-lg`
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <div className={`p-2 rounded-lg ${item.current ? 'bg-white bg-opacity-20' : item.color}`}>
                                <IconComponent className={`w-4 h-4 ${item.current ? 'text-white' : 'text-white'}`} />
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Quick Actions Mobile */}
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        {quickActions.map((action) => {
                          const IconComponent = action.icon;
                          return (
                            <Button
                              key={action.name}
                              variant="ghost"
                              className={`w-full justify-start ${action.color} text-white hover:opacity-90`}
                            >
                              <IconComponent className="w-4 h-4 mr-3" />
                              {action.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search tournaments, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-full border-2 border-gray-200 focus:border-fire-red focus:ring-fire-red rounded-lg"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}