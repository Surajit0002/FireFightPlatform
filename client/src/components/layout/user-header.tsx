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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { 
  Flame, Zap, Menu, X, Search, Wallet, Bell, ChevronDown, User, Settings,
  Gamepad2, Trophy, Users2, BarChart3, MessageSquare, 
  Star, Gift, Calendar, Home, TrendingUp, Award, Shield, 
  Headphones, Globe, Plus, Filter, Clock, Target, 
  PlayCircle, Coins, Crown, Bolt, LogOut
} from "lucide-react";
import { useState, useEffect } from "react";

export default function UserHeader() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/", 
      current: location === "/",
      icon: <Home className="w-4 h-4" />,
      description: "Gaming dashboard",
      badge: "New"
    },
    { 
      name: "Live", 
      href: "/tournaments", 
      current: location === "/tournaments",
      icon: <PlayCircle className="w-4 h-4" />,
      description: "Live tournaments",
      badge: "Live",
      isLive: true
    },
    { 
      name: "Tournaments", 
      href: "/all-tournaments", 
      current: location === "/all-tournaments",
      icon: <Trophy className="w-4 h-4" />,
      description: "All competitions"
    },
    { 
      name: "Teams", 
      href: "/teams", 
      current: location === "/teams",
      icon: <Users2 className="w-4 h-4" />,
      description: "Squad management"
    },
    { 
      name: "Rankings", 
      href: "/leaderboard", 
      current: location === "/leaderboard",
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Global rankings"
    },
    { 
      name: "Matches", 
      href: "/match-center", 
      current: location === "/match-center",
      icon: <Target className="w-4 h-4" />,
      description: "Match center"
    },
    { 
      name: "News", 
      href: "/announcements", 
      current: location === "/announcements",
      icon: <MessageSquare className="w-4 h-4" />,
      description: "Latest updates"
    },
  ];

  const quickActions = [
    { 
      name: "Quick Match", 
      icon: <Bolt className="w-4 h-4" />, 
      color: "bg-yellow-500",
      action: () => console.log("Quick match")
    },
    { 
      name: "Create Team", 
      icon: <Plus className="w-4 h-4" />, 
      color: "bg-blue-500",
      action: () => console.log("Create team")
    },
    { 
      name: "Join Tournament", 
      icon: <Trophy className="w-4 h-4" />, 
      color: "bg-green-500",
      action: () => console.log("Join tournament")
    },
    { 
      name: "Rewards", 
      icon: <Gift className="w-4 h-4" />, 
      color: "bg-purple-500",
      action: () => console.log("View rewards")
    },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-xl border-b border-gray-200 backdrop-blur-md' 
        : 'bg-white shadow-lg'
    }`}>
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-fire-red via-fire-orange to-fire-blue text-white text-xs py-1 px-2 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
            <Flame className="w-3 h-3 animate-pulse flex-shrink-0" />
            <span className="hidden sm:inline truncate">🔥 FireFight Championship 2024 - Register Now!</span>
            <span className="sm:hidden truncate">🔥 Championship Live!</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs flex-shrink-0">
            <div className="hidden xs:flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="hidden sm:inline">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="sm:hidden">{currentTime.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>IST</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 overflow-hidden">
          {/* Enhanced Logo - Responsive */}
          <Link href="/">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-fire-red rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg sm:text-xl">F</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-fire-green rounded-full animate-pulse flex items-center justify-center">
                  <Bolt className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                </div>
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-bold text-fire-red truncate">
                    FireFight
                  </span>
                  <Badge variant="outline" className="text-xs border-fire-blue text-fire-blue flex-shrink-0">
                    Pro
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 -mt-1 flex items-center space-x-1">
                  <span className="truncate">Esports Platform</span>
                  <div className="w-1 h-1 bg-fire-green rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-fire-green flex-shrink-0">Online</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation - Solid colors when selected */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-hidden">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className={`relative px-2 xl:px-3 py-2 rounded-lg transition-all duration-300 group whitespace-nowrap ${
                  item.current
                    ? "bg-fire-red text-white shadow-lg"
                    : "text-gray-600 hover:text-white hover:bg-fire-red/90"
                }`}>
                  <div className="flex items-center space-x-1.5 xl:space-x-2">
                    <div className={`${item.current ? 'text-white' : 'text-current'}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm xl:text-base">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.isLive ? "destructive" : "secondary"} 
                        className={`text-xs px-1 py-0 h-4 ${
                          item.isLive ? 'animate-pulse bg-red-500 text-white' : 
                          item.current ? 'bg-white text-fire-red' : 'bg-gray-100'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Enhanced Right Side - Responsive */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 min-w-0 flex-shrink-0">
            {/* Quick Actions - Only on larger screens */}
            <div className="hidden 2xl:flex items-center space-x-1">
              {quickActions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="ghost"
                  onClick={action.action}
                  className={`${action.color} text-white hover:opacity-90 transition-all duration-300 hover:scale-105 px-2 py-1`}
                >
                  {action.icon}
                  <span className="ml-1 text-xs">{action.name}</span>
                </Button>
              ))}
            </div>

            {/* Advanced Search - Enhanced Responsiveness */}
            <div className={`hidden md:block relative transition-all duration-300 flex-1 max-w-xs lg:max-w-sm xl:max-w-md ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-9 pr-16 py-2 w-full transition-all duration-300 ${
                    isSearchFocused 
                      ? 'ring-2 ring-fire-red ring-opacity-50 border-fire-red' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  isSearchFocused ? 'text-fire-red' : 'text-gray-400'
                }`} />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <Filter className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Player Level & XP */}
            <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-lg">
              <Crown className="w-4 h-4 text-purple-600" />
              <div className="text-xs">
                <div className="font-bold text-purple-700">Level {Math.floor(Math.random() * 50) + 1}</div>
                <div className="text-purple-500">{Math.floor(Math.random() * 1000) + 500} XP</div>
              </div>
            </div>

            {/* Enhanced Wallet Button - Mobile Responsive */}
            <Link href="/wallet">
              <Button className="bg-fire-green hover:bg-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group px-2 sm:px-4">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                  <div className="flex flex-col items-start min-w-0">
                    <span className="hidden lg:block text-xs opacity-90">Balance</span>
                    <span className="text-xs sm:text-sm font-bold truncate">₹{user?.walletBalance || "1000"}</span>
                  </div>
                </div>
              </Button>
            </Link>

            {/* Enhanced Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative hover:bg-fire-red hover:text-white transition-all duration-300 group"
                >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs animate-pulse"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-4 border-b bg-gradient-to-r from-fire-red to-fire-blue text-white">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm opacity-90">You have 3 new notifications</p>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((notif) => (
                    <div key={notif} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Tournament Starting Soon</p>
                          <p className="text-xs text-gray-500">Valorant Championship in 30 mins</p>
                          <p className="text-xs text-gray-400">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50 rounded-xl p-2 group">
                  <Avatar className="w-9 h-9 ring-2 ring-transparent group-hover:ring-fire-red transition-all duration-300">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-fire-red text-white font-bold text-sm">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-fire-gray text-sm flex items-center space-x-1">
                      <span>{user?.username || "Player"}</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        <Star className="w-2 h-2 mr-1" />
                        Pro
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Level {Math.floor(Math.random() * 50) + 1}</span>
                      <div className="w-1 h-1 bg-fire-green rounded-full"></div>
                      <span className="text-fire-green">Online</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2">
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-fire-red to-fire-blue text-white rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-14 h-14 ring-2 ring-white">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-white text-fire-red font-bold text-lg">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">
                        {user?.username || "Player"}
                      </div>
                      <div className="text-sm opacity-90">
                        {user?.email}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                          <Zap className="w-3 h-3 mr-1" />
                          {Math.floor(Math.random() * 1000) + 500} XP
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                          <Award className="w-3 h-3 mr-1" />
                          {Math.floor(Math.random() * 10) + 1} Wins
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-red hover:text-white transition-colors duration-200 rounded-lg">
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-tournaments">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-blue hover:text-white transition-colors duration-200 rounded-lg">
                      <Trophy className="w-4 h-4 mr-3" />
                      My Tournaments
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/match-center">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-green hover:text-white transition-colors duration-200 rounded-lg">
                      <Gamepad2 className="w-4 h-4 mr-3" />
                      Match Center
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/wallet">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-teal hover:text-white transition-colors duration-200 rounded-lg">
                      <Wallet className="w-4 h-4 mr-3" />
                      Wallet & Earnings
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/achievements">
                    <DropdownMenuItem className="cursor-pointer hover:bg-purple-600 hover:text-white transition-colors duration-200 rounded-lg">
                      <Award className="w-4 h-4 mr-3" />
                      Achievements
                    </DropdownMenuItem>
                  </Link>
                </div>

                <DropdownMenuSeparator />

                <div className="py-2 space-y-1">
                  <Link href="/support">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-lg">
                      <Headphones className="w-4 h-4 mr-3" />
                      Support & Help
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition-colors duration-200 rounded-lg">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'moderator') && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer hover:bg-purple-100 text-purple-600 transition-colors duration-200 rounded-lg">
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors duration-200 rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-fire-red hover:text-white">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="p-6 border-b bg-gradient-to-r from-fire-red to-fire-blue text-white">
                  <SheetTitle className="text-white text-left flex items-center space-x-2">
                    <Flame className="w-5 h-5" />
                    <span>FireFight Menu</span>
                  </SheetTitle>
                  <SheetDescription className="text-white/90 text-left">
                    Quick access to all features and settings
                  </SheetDescription>
                </SheetHeader>

                <div className="p-6 space-y-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search tournaments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Quick Actions Mobile */}
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="flex flex-col items-center space-y-1 h-16 text-xs"
                        onClick={action.action}
                      >
                        <div className={`w-6 h-6 ${action.color} rounded-full flex items-center justify-center text-white`}>
                          {action.icon}
                        </div>
                        <span>{action.name}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Mobile Navigation - Solid colors for selected */}
                  <div className="space-y-2 overflow-y-auto">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Navigation</h3>
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div 
                          className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                            item.current
                              ? "bg-fire-red text-white shadow-lg"
                              : "hover:bg-fire-red/10 hover:text-fire-red text-gray-700"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className={`${item.current ? 'text-white' : 'text-current'} flex-shrink-0`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium truncate">{item.name}</div>
                              <div className={`text-xs truncate ${
                                item.current ? 'text-white/80' : 'text-gray-500'
                              }`}>
                                {item.description || 'Navigate to ' + item.name}
                              </div>
                            </div>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant={item.isLive ? "destructive" : "secondary"} 
                              className={`text-xs flex-shrink-0 ${
                                item.isLive ? 'animate-pulse bg-red-500 text-white' : 
                                item.current ? 'bg-white text-fire-red' : 'bg-gray-100'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
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