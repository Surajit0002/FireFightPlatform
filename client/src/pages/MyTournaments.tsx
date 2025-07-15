import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Calendar, 
  DollarSign, 
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target
} from "lucide-react";
import { Link } from "wouter";
import type { TournamentParticipant } from "@/types";

export default function MyTournaments() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: userTournaments = [], isLoading } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/my-tournaments"],
  });

  // Filter tournaments based on active tab
  const filteredTournaments = userTournaments.filter(tournament => {
    switch (activeTab) {
      case "upcoming":
        return tournament.tournament?.status === "upcoming";
      case "live":
        return tournament.tournament?.status === "live";
      case "completed":
        return tournament.tournament?.status === "completed";
      case "won":
        return tournament.rank === 1;
      default:
        return true;
    }
  });

  // Sort tournaments
  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      case "prize":
        return parseFloat(b.tournament?.prizePool || "0") - parseFloat(a.tournament?.prizePool || "0");
      case "rank":
        return (a.rank || 999) - (b.rank || 999);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "live":
        return <Badge className="bg-fire-red text-white tournament-live">LIVE</Badge>;
      case "upcoming":
        return <Badge className="bg-fire-blue text-white">UPCOMING</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 text-white">COMPLETED</Badge>;
      case "cancelled":
        return <Badge variant="destructive">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getResultIcon = (participant: TournamentParticipant) => {
    if (participant.tournament?.status !== "completed") return null;
    
    if (participant.rank === 1) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    } else if (participant.rank && participant.rank <= 3) {
      return <Target className="w-5 h-5 text-fire-blue" />;
    }
    return null;
  };

  const getVerificationStatus = (participant: TournamentParticipant) => {
    if (participant.isVerified) {
      return { icon: CheckCircle, text: "Verified", color: "text-fire-green" };
    } else if (participant.screenshotUrl) {
      return { icon: Clock, text: "Under Review", color: "text-orange-500" };
    } else if (participant.tournament?.status === "live") {
      return { icon: AlertCircle, text: "Upload Required", color: "text-fire-red" };
    }
    return { icon: XCircle, text: "No Result", color: "text-gray-500" };
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateTotalEarnings = () => {
    return userTournaments
      .filter(t => t.rank === 1 && t.tournament?.status === "completed")
      .reduce((total, t) => total + parseFloat(t.tournament?.prizePool || "0"), 0);
  };

  const getTournamentStats = () => {
    const total = userTournaments.length;
    const won = userTournaments.filter(t => t.rank === 1).length;
    const top3 = userTournaments.filter(t => t.rank && t.rank <= 3).length;
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
    
    return { total, won, top3, winRate };
  };

  const stats = getTournamentStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fire-gray mb-2">My Tournaments</h1>
          <p className="text-gray-600">Track your tournament history and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tournaments</p>
                  <p className="text-3xl font-bold text-fire-gray">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tournaments Won</p>
                  <p className="text-3xl font-bold text-fire-gray">{stats.won}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top 3 Finishes</p>
                  <p className="text-3xl font-bold text-fire-gray">{stats.top3}</p>
                </div>
                <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Win Rate</p>
                  <p className="text-3xl font-bold text-fire-gray">{stats.winRate}%</p>
                </div>
                <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="won">Won</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="prize">Highest Prize</SelectItem>
                <SelectItem value="rank">Best Rank</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {sortedTournaments.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No tournaments found
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === "all" 
                    ? "You haven't joined any tournaments yet" 
                    : `No ${activeTab} tournaments`}
                </p>
                <Button asChild className="bg-fire-red text-white">
                  <Link href="/tournaments">Browse Tournaments</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedTournaments.map((tournament) => {
              const verificationStatus = getVerificationStatus(tournament);
              const StatusIcon = verificationStatus.icon;
              const resultIcon = getResultIcon(tournament);
              
              return (
                <Card key={tournament.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
                      {/* Tournament Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {resultIcon}
                            <div>
                              <Link href={`/tournaments/${tournament.tournamentId}`}>
                                <h3 className="font-bold text-lg text-fire-gray hover:text-fire-red cursor-pointer">
                                  {tournament.tournament?.title || "Tournament"}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500 capitalize">
                                {tournament.tournament?.gameType?.replace("_", " ")} • {tournament.tournament?.format}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(tournament.tournament?.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Prize Pool</span>
                            <div className="font-semibold text-fire-green">
                              ₹{parseFloat(tournament.tournament?.prizePool || "0").toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Entry Fee</span>
                            <div className="font-semibold">
                              {parseFloat(tournament.tournament?.entryFee || "0") === 0 
                                ? "FREE" 
                                : `₹${parseFloat(tournament.tournament?.entryFee || "0").toLocaleString()}`}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Joined</span>
                            <div className="font-semibold">
                              {formatDateTime(tournament.joinedAt)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Participants</span>
                            <div className="font-semibold">
                              {tournament.tournament?.currentParticipants}/{tournament.tournament?.maxParticipants}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="lg:ml-6 flex flex-col justify-between space-y-4">
                        {/* Rank & Performance */}
                        {tournament.rank && (
                          <div className="text-center lg:text-right">
                            <div className="text-2xl font-bold text-fire-blue">#{tournament.rank}</div>
                            <div className="text-sm text-gray-500">Final Rank</div>
                            {tournament.kills !== null && (
                              <div className="text-sm text-gray-600 mt-1">
                                {tournament.kills} kills • {tournament.points} points
                              </div>
                            )}
                          </div>
                        )}

                        {/* Verification Status */}
                        <div className="flex items-center justify-center lg:justify-end space-x-2">
                          <StatusIcon className={`w-4 h-4 ${verificationStatus.color}`} />
                          <span className={`text-sm font-medium ${verificationStatus.color}`}>
                            {verificationStatus.text}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/tournaments/${tournament.tournamentId}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          
                          {tournament.tournament?.status === "completed" && tournament.rank === 1 && (
                            <Button size="sm" className="bg-fire-green text-white">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Claim Prize
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline for live/completed tournaments */}
                    {(tournament.tournament?.status === "live" || tournament.tournament?.status === "completed") && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-fire-green" />
                              <span>Joined</span>
                            </div>
                            {tournament.tournament.roomId && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-fire-green" />
                                <span>Room Shared</span>
                              </div>
                            )}
                            {tournament.screenshotUrl && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-fire-green" />
                                <span>Result Uploaded</span>
                              </div>
                            )}
                            {tournament.isVerified && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 text-fire-green" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                          
                          {tournament.notes && (
                            <div className="text-orange-600">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              Admin Notes
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Load More */}
        {sortedTournaments.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
