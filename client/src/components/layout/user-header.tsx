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
import { Bell, Search, ChevronDown, User, Settings, LogOut, Wallet, Menu, X, Gamepad2, Trophy, Users2, BarChart3, MessageSquare, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserHeader() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigation = [
    { 
      name: "Home", 
      href: "/", 
      current: location === "/",
      icon: <Gamepad2 className="w-4 h-4" />,
      description: "Gaming dashboard"
    },
    { 
      name: "Tournaments", 
      href: "/tournaments", 
      current: location === "/tournaments",
      icon: <Trophy className="w-4 h-4" />,
      description: "Live competitions"
    },
    { 
      name: "Teams", 
      href: "/teams", 
      current: location === "/teams",
      icon: <Users2 className="w-4 h-4" />,
      description: "Squad management"
    },
    { 
      name: "Leaderboard", 
      href: "/leaderboard", 
      current: location === "/leaderboard",
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Global rankings"
    },
    { 
      name: "News", 
      href: "/announcements", 
      current: location === "/announcements",
      icon: <MessageSquare className="w-4 h-4" />,
      description: "Latest updates"
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

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-fire-red via-fire-orange to-fire-blue rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-fire-green rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-fire-red via-fire-orange to-fire-blue bg-clip-text text-transparent">
                  FireFight
                </span>
                <div className="text-xs text-gray-500 -mt-1">Esports Platform</div>
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                  item.current
                    ? "bg-gradient-to-r from-fire-red to-fire-blue text-white shadow-lg"
                    : "text-gray-600 hover:text-fire-red hover:bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.current && (
                    <div className="absolute inset-0 bg-gradient-to-r from-fire-red to-fire-blue rounded-xl opacity-20 animate-pulse"></div>
                  )}
                  {!item.current && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-fire-red transition-all duration-300 group-hover:w-full"></div>
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Enhanced Right Side */}
          <div className="flex items-center space-x-3">
            {/* Advanced Search */}
            <div className={`hidden md:block relative transition-all duration-300 ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tournaments, teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 pr-4 py-2 w-64 transition-all duration-300 ${
                    isSearchFocused 
                      ? 'ring-2 ring-fire-red ring-opacity-50 border-fire-red w-72' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <Search className={`w-5 h-5 absolute left-3 top-2.5 transition-colors duration-300 ${
                  isSearchFocused ? 'text-fire-red' : 'text-gray-400'
                }`} />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Wallet Button */}
            <Link href="/wallet">
              <Button className="bg-gradient-to-r from-fire-green to-green-600 hover:from-green-600 hover:to-fire-green text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden sm:block">₹{user?.walletBalance || "0.00"}</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-md transition-opacity duration-300"></div>
              </Button>
            </Link>

            {/* Enhanced Notifications */}
            <div className="relative">
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
            </div>

            {/* Enhanced Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50 rounded-xl p-2 group">
                  <Avatar className="w-8 h-8 ring-2 ring-transparent group-hover:ring-fire-red transition-all duration-300">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-fire-red text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="font-medium text-fire-gray text-sm">
                      {user?.username || "Player"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Level {Math.floor(Math.random() * 50) + 1}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback className="bg-fire-red text-white font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-fire-gray">
                        {user?.username || "Player"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.email}
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        <Zap className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 1000) + 500} XP
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-red hover:text-white transition-colors duration-200">
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-tournaments">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-blue hover:text-white transition-colors duration-200">
                      <Trophy className="w-4 h-4 mr-3" />
                      My Tournaments
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/match-center">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-green hover:text-white transition-colors duration-200">
                      <Gamepad2 className="w-4 h-4 mr-3" />
                      Match Center
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/wallet">
                    <DropdownMenuItem className="cursor-pointer hover:bg-fire-teal hover:text-white transition-colors duration-200">
                      <Wallet className="w-4 h-4 mr-3" />
                      Wallet & Earnings
                    </DropdownMenuItem>
                  </Link>
                </div>

                <DropdownMenuSeparator />

                <div className="py-2">
                  <Link href="/support">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                      <Settings className="w-4 h-4 mr-3" />
                      Support & Settings
                    </DropdownMenuItem>
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'moderator') && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer hover:bg-purple-100 text-purple-600 transition-colors duration-200">
                        <span className="w-4 h-4 mr-3">⚙️</span>
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="p-6 border-b bg-gradient-to-r from-fire-red to-fire-blue text-white">
                  <SheetTitle className="text-white text-left">Navigation</SheetTitle>
                  <SheetDescription className="text-white/90 text-left">
                    Quick access to all features
                  </SheetDescription>
                </SheetHeader>

                <div className="p-6">
                  {/* Mobile Search */}
                  <div className="relative mb-6">
                    <Input
                      type="text"
                      placeholder="Search tournaments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <div 
                          className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                            item.current
                              ? "bg-gradient-to-r from-fire-red to-fire-blue text-white shadow-lg"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className={`text-xs ${
                              item.current ? 'text-white/80' : 'text-gray-500'
                            }`}>
                              {item.description}
                            </div>
                          </div>
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