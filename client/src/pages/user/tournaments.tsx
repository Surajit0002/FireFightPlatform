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
        <div className="hero-gradient rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Browse Tournaments</h1>
            <p className="text-xl mb-6 opacity-90">
              Find the perfect tournament for your skill level and favorite games
            </p>
            <div className="flex space-x-4">
              <Badge className="bg-white text-fire-red px-3 py-1">
                {liveTournaments.length} Live
              </Badge>
              <Badge className="bg-white text-fire-blue px-3 py-1">
                {upcomingTournaments.length} Upcoming
              </Badge>
              <Badge className="bg-white text-fire-green px-3 py-1">
                {freeTournaments.length} Free
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <Input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Game Filter */}
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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
              <SelectTrigger className="w-full md:w-48">
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

            {/* Mobile Filter Button */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Tournaments</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Game</label>
                    <Select value={selectedGame} onValueChange={setSelectedGame}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gameOptions.map((game) => (
                          <SelectItem key={game.value} value={game.value}>
                            {game.icon} {game.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
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

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold fire-gray">
            Tournaments ({filteredTournaments.length})
          </h2>
          <div className="text-sm text-gray-500">
            Showing {filteredTournaments.length} of {tournaments.length} tournaments
          </div>
        </div>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
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
