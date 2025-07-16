import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import TournamentCard from "@/components/tournament-card";
import { LoadingCard, LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Trophy, AlertCircle } from "lucide-react";
import type { Tournament } from "@shared/schema";

export default function Tournaments() {
  const [gameFilter, setGameFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tournaments = [], isLoading, error, refetch } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments", gameFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (gameFilter !== "all") params.append("gameType", gameFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await fetch(`/api/tournaments?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      return res.json();
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const gameTypes = [
    { value: "all", label: "All Games" },
    { value: "free_fire", label: "Free Fire" },
    { value: "bgmi", label: "BGMI" },
    { value: "valorant", label: "Valorant" },
    { value: "other", label: "Other" },
  ];

  const statusTypes = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "live", label: "Live" },
    { value: "completed", label: "Completed" },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary 
            error={error as Error} 
            onRetry={() => refetch()}
            title="Failed to load tournaments"
            description="We couldn't load the tournaments. Please check your connection and try again."
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-fire-blue to-fire-teal rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Esports Tournaments</h1>
          <p className="text-lg opacity-90">Compete in your favorite games and win cash prizes</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <Input
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Game Filter */}
              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gameTypes.map((game) => (
                    <SelectItem key={game.value} value={game.value}>
                      {game.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {(gameFilter !== "all" || statusFilter !== "all" || searchQuery) && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-600">Active filters:</span>
            {gameFilter !== "all" && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Game: {gameTypes.find(g => g.value === gameFilter)?.label}</span>
                <button onClick={() => setGameFilter("all")} className="ml-1">×</button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Status: {statusTypes.find(s => s.value === statusFilter)?.label}</span>
                <button onClick={() => setStatusFilter("all")} className="ml-1">×</button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>Search: {searchQuery}</span>
                <button onClick={() => setSearchQuery("")} className="ml-1">×</button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGameFilter("all");
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="text-fire-red"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>

        {/* Empty State */}
        {filteredTournaments.length === 0 && !isLoading && (
          <Card className="p-12 text-center">
            <CardContent>
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No tournaments found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || gameFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Check back later for new tournaments"}
              </p>
              {(searchQuery || gameFilter !== "all" || statusFilter !== "all") && (
                <Button
                  onClick={() => {
                    setGameFilter("all");
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="bg-fire-red text-white"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredTournaments.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Tournaments
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
