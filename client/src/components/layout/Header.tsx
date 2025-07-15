import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", current: location === "/" },
    { name: "Tournaments", href: "/tournaments", current: location === "/tournaments" },
    { name: "Teams", href: "/teams", current: location === "/teams" },
    { name: "Leaderboard", href: "/leaderboard", current: location === "/leaderboard" },
    { name: "Match Center", href: "/match-center", current: location === "/match-center" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 bg-fire-red rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-fire-gray">FireFight</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={`${
                    item.current
                      ? "text-fire-red font-medium border-b-2 border-fire-red pb-1"
                      : "text-gray-500 hover:text-fire-gray transition-colors"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop */}
            <div className="hidden md:block relative">
              <Input
                type="text"
                placeholder="Search tournaments..."
                className="pl-10 pr-4 w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Wallet Balance */}
            <Badge className="bg-fire-green text-white px-4 py-2 font-medium">
              ₹{parseFloat(user?.walletBalance || "0").toLocaleString()}
            </Badge>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5 text-gray-400" />
              </Button>
              <div className="absolute -top-1 -right-1 bg-fire-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </div>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-fire-blue text-white">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-fire-gray font-medium hidden md:block">
                    {user?.username || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-tournaments">My Tournaments</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet">Wallet</Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/support">Support</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.location.href = "/api/logout"}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`block px-3 py-2 rounded-md ${
                      item.current
                        ? "bg-fire-red text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
            {/* Mobile Search */}
            <div className="mt-4 px-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tournaments..."
                  className="pl-10 pr-4"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
