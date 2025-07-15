import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  Search,
  Calendar,
  Trophy,
  AlertTriangle,
  Star,
  Gamepad2,
  Gift,
  Settings,
  Filter,
  Clock,
  Pin,
} from "lucide-react";
import type { Announcement } from "@shared/schema";

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<string>("all");

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "general", label: "General" },
    { value: "tournament", label: "Tournament" },
    { value: "maintenance", label: "Maintenance" },
    { value: "winner", label: "Winner Story" },
    { value: "update", label: "Platform Update" },
  ];

  const gameOptions = [
    { value: "all", label: "All Games" },
    { value: "free_fire", label: "Free Fire" },
    { value: "bgmi", label: "BGMI" },
    { value: "valorant", label: "Valorant" },
    { value: "csgo", label: "CS:GO" },
    { value: "pubg", label: "PUBG" },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tournament':
        return <Trophy className="w-5 h-5" />;
      case 'maintenance':
        return <Settings className="w-5 h-5" />;
      case 'winner':
        return <Star className="w-5 h-5" />;
      case 'update':
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <Megaphone className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tournament':
        return 'bg-fire-blue';
      case 'maintenance':
        return 'bg-fire-orange';
      case 'winner':
        return 'bg-fire-green';
      case 'update':
        return 'bg-fire-teal';
      default:
        return 'bg-fire-red';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-fire-orange';
      case 'normal':
        return 'bg-fire-blue';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-fire-blue';
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || announcement.type === selectedType;
    const matchesGame = selectedGame === "all" || announcement.gameFilter === selectedGame;
    return matchesSearch && matchesType && matchesGame;
  });

  const sortedAnnouncements = filteredAnnouncements.sort((a, b) => {
    // Sort by priority first, then by date
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pinnedAnnouncements = sortedAnnouncements.filter(a => a.priority === 'urgent');
  const regularAnnouncements = sortedAnnouncements.filter(a => a.priority !== 'urgent');

  const AnnouncementCard = ({ announcement, isPinned = false }: { announcement: Announcement; isPinned?: boolean }) => (
    <Card className={`card-hover ${isPinned ? 'border-2 border-fire-red' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getTypeColor(announcement.type)} rounded-lg flex items-center justify-center text-white`}>
              {getTypeIcon(announcement.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                {isPinned && <Pin className="w-4 h-4 text-fire-red" />}
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getPriorityColor(announcement.priority)} text-white text-xs`}>
                  {announcement.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="capitalize text-xs">
                  {announcement.type.replace('_', ' ')}
                </Badge>
                {announcement.gameFilter && (
                  <Badge variant="outline" className="text-xs">
                    {announcement.gameFilter.replace('_', ' ').toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
        </div>
        
        {announcement.publishedAt && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Published: {new Date(announcement.publishedAt).toLocaleString()}</span>
              {announcement.expiresAt && (
                <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Announcements & News</h1>
          <p className="text-gray-600">
            Stay updated with the latest news, tournaments, and platform updates
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Game" />
                </SelectTrigger>
                <SelectContent>
                  {gameOptions.map((game) => (
                    <SelectItem key={game.value} value={game.value}>
                      {game.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Pinned Announcements */}
            {pinnedAnnouncements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold fire-gray mb-4 flex items-center space-x-2">
                  <Pin className="w-5 h-5 text-fire-red" />
                  <span>Pinned Announcements</span>
                </h2>
                <div className="space-y-4">
                  {pinnedAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                      isPinned={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Announcements */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold fire-gray">
                  All Announcements ({regularAnnouncements.length})
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {regularAnnouncements.length > 0 ? (
                <div className="space-y-6">
                  {regularAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      announcement={announcement}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Announcements Found</h3>
                    <p className="text-gray-500">
                      {searchTerm || selectedType !== 'all' || selectedGame !== 'all'
                        ? "Try adjusting your search or filters to find more announcements."
                        : "No announcements available at the moment. Check back later!"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2 fire-blue" />
                  Latest Tournaments
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2 fire-orange" />
                  Winner Stories
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2 fire-teal" />
                  Platform Updates
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="w-4 h-4 mr-2 fire-green" />
                  Promotions
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {typeOptions.slice(1).map((type) => {
                    const count = announcements.filter(a => a.type === type.value).length;
                    return (
                      <div key={type.value} className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${getTypeColor(type.value)} rounded-full`}></div>
                          <span>{type.label}</span>
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Winners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 fire-orange" />
                  <span>Recent Winners</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-fire-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">ProGamer_X</div>
                      <div className="text-xs text-gray-500">Won ₹5,000 in Free Fire</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">EliteSquad</div>
                      <div className="text-xs text-gray-500">Won ₹10,000 in BGMI</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-fire-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">ChampionGG</div>
                      <div className="text-xs text-gray-500">Won ₹2,500 in Valorant</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Status */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tournaments:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                      <span className="text-sm fire-green">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payments:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                      <span className="text-sm fire-green">Operational</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Live Support:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                      <span className="text-sm fire-green">Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 fire-blue" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-fire-red pl-3">
                    <div className="font-medium">Free Fire Championship</div>
                    <div className="text-gray-500">Tomorrow at 8:00 PM</div>
                  </div>
                  
                  <div className="border-l-4 border-fire-blue pl-3">
                    <div className="font-medium">BGMI Weekly Tournament</div>
                    <div className="text-gray-500">Sunday at 6:00 PM</div>
                  </div>
                  
                  <div className="border-l-4 border-fire-green pl-3">
                    <div className="font-medium">Valorant Pro Series</div>
                    <div className="text-gray-500">Next Monday</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
