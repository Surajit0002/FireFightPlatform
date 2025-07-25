import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import TournamentCard from "@/components/tournament-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Trophy, Clock, Users, DollarSign } from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function Tournaments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [showFilters, setShowFilters] = useState(false);

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const gameOptions = [
    { value: "all", label: "All Games", icon: "🎮" },
    { value: "free_fire", label: "Free Fire", icon: "🔥" },
    { value: "bgmi", label: "BGMI", icon: "🎯" },
    { value: "valorant", label: "Valorant", icon: "⚡" },
    { value: "csgo", label: "CS:GO", icon: "💥" },
    { value: "pubg", label: "PUBG", icon: "🏆" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "live", label: "Live" },
    { value: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "prize_pool", label: "Prize Pool" },
    { value: "entry_fee", label: "Entry Fee" },
    { value: "soonest", label: "Starting Soon" },
    { value: "slots_left", label: "Slots Available" },
  ];

  // Filter and sort tournaments
  const filteredTournaments = tournaments
    .filter((tournament) => {
      const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGame = selectedGame === "all" || tournament.game === selectedGame;
      const matchesStatus = selectedStatus === "all" || tournament.status === selectedStatus;
      return matchesSearch && matchesGame && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "prize_pool":
          return parseFloat(b.prizePool) - parseFloat(a.prizePool);
        case "entry_fee":
          return parseFloat(a.entryFee) - parseFloat(b.entryFee);
        case "soonest":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case "slots_left":
          return (b.maxSlots - b.currentSlots) - (a.maxSlots - a.currentSlots);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const liveTournaments = filteredTournaments.filter(t => t.status === 'live');
  const upcomingTournaments = filteredTournaments.filter(t => t.status === 'upcoming');
  const freeTournaments = filteredTournaments.filter(t => parseFloat(t.entryFee) === 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative hero-gradient rounded-3xl p-8 mb-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative max-w-4xl">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex-1 mb-6 lg:mb-0">
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Discover Epic Tournaments
                </h1>
                <p className="text-xl mb-6 opacity-90 max-w-2xl">
                  Join competitive esports tournaments, compete with players worldwide, and win amazing prizes in your favorite games
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                    {liveTournaments.length} Live Tournaments
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    {upcomingTournaments.length} Starting Soon
                  </Badge>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-medium">
                    <Trophy className="w-4 h-4 mr-2" />
                    {freeTournaments.length} Free to Enter
                  </Badge>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-48 h-48 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-24 h-24 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search tournaments by name, game, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-xl focus:bg-white transition-colors"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Game Filter */}
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger className="w-full sm:w-48 h-12 bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Select Game" />
                </SelectTrigger>
                <SelectContent>
                  {gameOptions.map((game) => (
                    <SelectItem key={game.value} value={game.value}>
                      <span className="flex items-center space-x-2">
                        <span>{game.icon}</span>
                        <span>{game.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48 h-12 bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Tournament Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 h-12 bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((sort) => (
                    <SelectItem key={sort.value} value={sort.value}>
                      {sort.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Button - Both Mobile and Desktop */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white border-r border-gray-200">
                <SheetHeader className="pb-6">
                  <SheetTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filter Tournaments
                  </SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                  {/* Quick Filter Tags */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Quick Filters</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={selectedStatus === "live" ? "default" : "outline"}
                        onClick={() => setSelectedStatus(selectedStatus === "live" ? "all" : "live")}
                        className="text-xs"
                      >
                        🔴 Live Now
                      </Button>
                      <Button
                        size="sm"
                        variant={searchTerm.includes("free") ? "default" : "outline"}
                        onClick={() => setSearchTerm(searchTerm.includes("free") ? "" : "free")}
                        className="text-xs"
                      >
                        🎁 Free Entry
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedStatus === "upcoming" ? "default" : "outline"}
                        onClick={() => setSelectedStatus(selectedStatus === "upcoming" ? "all" : "upcoming")}
                        className="text-xs"
                      >
                        ⏰ Starting Soon
                      </Button>
                    </div>
                  </div>

                  {/* Game Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Game</label>
                    <Select value={selectedGame} onValueChange={setSelectedGame}>
                      <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select Game" />
                      </SelectTrigger>
                      <SelectContent>
                        {gameOptions.map((game) => (
                          <SelectItem key={game.value} value={game.value}>
                            <span className="flex items-center space-x-2">
                              <span>{game.icon}</span>
                              <span>{game.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Tournament Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-11 bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((sort) => (
                          <SelectItem key={sort.value} value={sort.value}>
                            {sort.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filter Actions */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedGame("all");
                        setSelectedStatus("all");
                        setSortBy("latest");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                    <Button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Apply Filters ({filteredTournaments.length})
                    </Button>
                  </div>

                  {/* Filter Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Active Filters:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {selectedGame !== "all" && (
                        <div>Game: {gameOptions.find(g => g.value === selectedGame)?.label}</div>
                      )}
                      {selectedStatus !== "all" && (
                        <div>Status: {statusOptions.find(s => s.value === selectedStatus)?.label}</div>
                      )}
                      {searchTerm && (
                        <div>Search: "{searchTerm}"</div>
                      )}
                      <div className="font-medium text-blue-600">
                        {filteredTournaments.length} tournaments found
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{tournaments.length}</div>
              <div className="text-sm text-gray-500">Total Tournaments</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-orange rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{liveTournaments.length}</div>
              <div className="text-sm text-gray-500">Live Now</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">{freeTournaments.length}</div>
              <div className="text-sm text-gray-500">Free Entry</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold fire-gray">
                {tournaments.reduce((acc, t) => acc + t.currentSlots, 0)}
              </div>
              <div className="text-sm text-gray-500">Players Joined</div>
            </CardContent>
          </Card>
        </div>

        

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold fire-gray">
            Tournaments ({filteredTournaments.length})
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {filteredTournaments.length} of {tournaments.length} tournaments
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="flex">
                <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tournaments Found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms to find more tournaments.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGame("all");
                  setSelectedStatus("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
