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
  Flame, Menu, Search, Wallet, Bell, ChevronDown, User, Settings,
  Home, Trophy, Users2, BarChart3, MessageSquare, 
  Target, Gamepad2, LogOut, Crown
} from "lucide-react";
import { useState } from "react";

export default function UserHeader() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/", 
      current: location === "/",
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: "Tournaments", 
      href: "/tournaments", 
      current: location === "/tournaments",
      icon: <Trophy className="w-4 h-4" />
    },
    { 
      name: "Teams", 
      href: "/teams", 
      current: location === "/teams",
      icon: <Users2 className="w-4 h-4" />
    },
    { 
      name: "Leaderboard", 
      href: "/leaderboard", 
      current: location === "/leaderboard",
      icon: <BarChart3 className="w-4 h-4" />
    },
    { 
      name: "Matches", 
      href: "/match-center", 
      current: location === "/match-center",
      icon: <Target className="w-4 h-4" />
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-gray-200">
      {/* Simple top notification bar */}
      <div className="bg-gradient-to-r from-fire-red to-fire-blue text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>🔥 FireFight Championship 2024 - Join Now!</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-r from-fire-red to-fire-blue rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-fire-red to-fire-blue bg-clip-text text-transparent">
                  FireFight
                </span>
                <Badge variant="outline" className="ml-2 text-xs border-fire-blue text-fire-blue">
                  Pro
                </Badge>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  item.current
                    ? "bg-gradient-to-r from-fire-red to-fire-blue text-white shadow-md"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-fire-red hover:to-fire-blue hover:text-white"
                }`}>
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-64 border-gray-200 focus:border-fire-red focus:ring-fire-red"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Wallet */}
            <Link href="/wallet">
              <Button className="bg-gradient-to-r from-fire-green to-green-600 hover:from-green-600 hover:to-fire-green text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                <Wallet className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">₹{user?.walletBalance || "1000"}</span>
              </Button>
            </Link>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                  <Bell className="w-5 h-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 border-b bg-gradient-to-r from-fire-red to-fire-blue text-white">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm opacity-90">3 new notifications</p>
                </div>
                <div className="p-2">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tournament Starting Soon</p>
                        <p className="text-xs text-gray-500">Valorant Championship in 30 mins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-fire-red to-fire-blue text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-gray-700 text-sm flex items-center space-x-1">
                      <span>{user?.username || "Player"}</span>
                      <Crown className="w-3 h-3 text-yellow-500" />
                    </div>
                    <div className="text-xs text-gray-500">Level 25</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-4 border-b bg-gradient-to-r from-fire-red to-fire-blue text-white rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-white text-fire-red font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user?.username || "Player"}</div>
                      <div className="text-sm opacity-90">{user?.email}</div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-tournaments">
                    <DropdownMenuItem className="cursor-pointer">
                      <Trophy className="w-4 h-4 mr-3" />
                      My Tournaments
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/match-center">
                    <DropdownMenuItem className="cursor-pointer">
                      <Gamepad2 className="w-4 h-4 mr-3" />
                      Match Center
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer">
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
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-fire-red" />
                    <span>FireFight Menu</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search tournaments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div 
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                            item.current
                              ? "bg-gradient-to-r from-fire-red to-fire-blue text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}