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
import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, ChevronDown, User, Settings, LogOut, Wallet } from "lucide-react";

export default function UserHeader() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/", current: location === "/" },
    { name: "Tournaments", href: "/tournaments", current: location === "/tournaments" },
    { name: "Teams", href: "/teams", current: location === "/teams" },
    { name: "Leaderboard", href: "/leaderboard", current: location === "/leaderboard" },
    { name: "News", href: "/announcements", current: location === "/announcements" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-fire-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold fire-gray">FireFight</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span
                  className={`${
                    item.current
                      ? "fire-red font-medium border-b-2 border-red-500 pb-1"
                      : "text-gray-500 hover:text-gray-700 transition-colors"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search tournaments..."
                className="pl-10 pr-4 py-2 w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Wallet */}
            <Link href="/wallet">
              <Button className="bg-fire-green hover:bg-green-600 text-white font-medium">
                <Wallet className="w-4 h-4 mr-2" />
                ₹{user?.walletBalance || "0.00"}
              </Button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block fire-gray font-medium">
                    {user?.username || "Player"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/my-tournaments">
                  <DropdownMenuItem>
                    <span className="w-4 h-4 mr-2">🏆</span>
                    My Tournaments
                  </DropdownMenuItem>
                </Link>
                <Link href="/match-center">
                  <DropdownMenuItem>
                    <span className="w-4 h-4 mr-2">🎮</span>
                    Match Center
                  </DropdownMenuItem>
                </Link>
                <Link href="/wallet">
                  <DropdownMenuItem>
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/support">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Support
                  </DropdownMenuItem>
                </Link>
                {(user?.role === 'admin' || user?.role === 'moderator') && (
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <span className="w-4 h-4 mr-2">⚙️</span>
                      Admin Panel
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
