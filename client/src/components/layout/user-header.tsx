
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
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-gray-200">
      {/* Compact Top Banner */}
      <div className="bg-fire-red text-white py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Flame className="w-3 h-3 animate-pulse" />
              <span className="font-medium">🔥 FireFight Championship 2024 - Live Now!</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-white text-fire-red border-0 hover:bg-gray-100 text-xs py-0.5">
                <TrendingUp className="w-2.5 h-2.5 mr-1" />
                Hot
              </Badge>
              <span className="text-xs">Prize: ₹50,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Compact Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-fire-red rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-fire-green rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-lg sm:text-xl font-bold text-fire-red">FireFight</span>
                      <Badge className="bg-fire-blue text-white border-0 text-xs px-1.5 py-0.5">
                        Pro
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 font-medium hidden lg:block">Esports Platform</div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Compact */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`relative px-2.5 py-1.5 rounded-md transition-all duration-300 flex items-center space-x-1.5 group text-sm ${
                      item.current
                        ? `${item.color} text-white shadow-md`
                        : "text-gray-700 hover:bg-gray-100"
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                      <span className="font-medium">{item.name}</span>
                      {item.current && (
                        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions - Compact */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search - Desktop */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-8 w-40 xl:w-48 border border-gray-200 focus:border-fire-red focus:ring-fire-red rounded-md h-8 text-sm"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-1 top-1 h-6 w-6 p-0"
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
                className="lg:hidden hover:bg-gray-100 rounded-md h-8 w-8"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Quick Actions - Desktop Only */}
              <div className="hidden 2xl:flex items-center space-x-1">
                {quickActions.slice(0, 2).map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={action.name}
                      variant="ghost"
                      size="sm"
                      className={`${action.color} text-white hover:opacity-90 transition-all duration-300 text-xs px-2 py-1 h-7`}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      <span className="hidden 2xl:inline">{action.name}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Wallet - Compact */}
              <Link href="/wallet">
                <Button className="bg-fire-green hover:bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-md text-xs px-2 sm:px-3 py-1 h-8">
                  <Wallet className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
                  <span className="hidden sm:inline">₹{user?.walletBalance || "1,250"}</span>
                  <span className="sm:hidden">₹1.2K</span>
                </Button>
              </Link>

              {/* Notifications - Compact */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-md h-8 w-8"
                  >
                    <Bell className="w-4 h-4" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-fire-red rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-0">
                  <div className="p-3 bg-fire-red text-white rounded-t-md">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <p className="text-xs opacity-90">3 new notifications</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="p-2.5 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                      <div className="flex items-start space-x-2.5">
                        <div className="w-6 h-6 bg-fire-blue rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">Tournament Starting Soon</p>
                          <p className="text-xs text-gray-500">Valorant Championship in 30 mins</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile - Compact */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-1.5 hover:bg-gray-100 rounded-md p-1.5 h-8"
                  >
                    <Avatar className="w-6 h-6 border border-fire-red">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-fire-red text-white font-bold text-xs">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-700 text-xs">{user?.username || "Player"}</span>
                        <Crown className="w-2.5 h-2.5 text-yellow-500" />
                      </div>
                      <div className="text-xs text-gray-500 hidden lg:block">Level 25 • Pro</div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0">
                  <div className="p-3 bg-fire-red text-white rounded-t-md">
                    <div className="flex items-center space-x-2.5">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={user?.profileImageUrl || ""} />
                        <AvatarFallback className="bg-white text-fire-red font-bold">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{user?.username || "Player"}</div>
                        <div className="text-xs opacity-90">{user?.email}</div>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <Star className="w-2.5 h-2.5 text-yellow-300" />
                          <span className="text-xs">Pro Member</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-sm">
                        <User className="w-3.5 h-3.5 mr-2.5" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/my-tournaments">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-sm">
                        <Trophy className="w-3.5 h-3.5 mr-2.5" />
                        My Tournaments
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/match-center">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-sm">
                        <Gamepad2 className="w-3.5 h-3.5 mr-2.5" />
                        Match Center
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-sm">
                        <Settings className="w-3.5 h-3.5 mr-2.5" />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => window.location.href = '/api/logout'}
                    className="cursor-pointer text-red-600 hover:bg-red-50 text-sm"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2.5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="xl:hidden hover:bg-gray-100 rounded-md h-8 w-8">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="p-4 bg-gradient-to-r from-fire-red to-red-600 text-white">
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
        <div className="lg:hidden bg-white border-t border-gray-200 p-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search tournaments, teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-full border border-gray-200 focus:border-fire-red focus:ring-fire-red rounded-md h-10"
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
