import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
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
import {
  LayoutDashboard,
  Calendar,
  FileCheck,
  Wallet,
  Users,
  FileText,
  Megaphone,
  BarChart3,
  HelpCircle,
  Bell,
  LogOut,
  Home,
} from "lucide-react";

const sidebarNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Tournaments", href: "/admin/tournaments", icon: Calendar },
  { name: "Match Results", href: "/admin/match-results", icon: FileCheck },
  { name: "Wallet & Finance", href: "/admin/wallet-finance", icon: Wallet },
  { name: "Users & Teams", href: "/admin/users-teams", icon: Users },
  { name: "KYC Management", href: "/admin/kyc-management", icon: FileText },
  { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Support Tickets", href: "/admin/support-tickets", icon: HelpCircle },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-fire-teal rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold fire-gray">FireFight Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  User Portal
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback>
                        {user?.username?.charAt(0).toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="fire-gray font-medium">
                      {user?.username || "Admin"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {sidebarNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-fire-teal text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
