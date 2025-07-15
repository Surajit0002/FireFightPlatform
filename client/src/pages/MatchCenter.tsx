import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Clock, 
  Trophy, 
  Upload, 
  MessageCircle, 
  Play, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import type { TournamentParticipant, Tournament } from "@/types";

export default function MatchCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: userTournaments = [], isLoading } = useQuery<TournamentParticipant[]>({
    queryKey: ["/api/my-tournaments"],
  });

  // Filter tournaments based on active tab
  const filteredMatches = userTournaments.filter(match => {
    switch (activeTab) {
      case "upcoming":
        return match.tournament?.status === "upcoming";
      case "live":
        return match.tournament?.status === "live";
      case "completed":
        return match.tournament?.status === "completed";
      default:
        return true;
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
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const getResultStatus = (participant: TournamentParticipant) => {
    if (participant.isVerified) {
      return { icon: CheckCircle, text: "Verified", color: "text-fire-green" };
    } else if (participant.screenshotUrl) {
      return { icon: Clock, text: "Under Review", color: "text-orange-500" };
    } else if (participant.tournament?.status === "live") {
      return { icon: Upload, text: "Upload Required", color: "text-fire-red" };
    } else {
      return { icon: XCircle, text: "No Result", color: "text-gray-500" };
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeToStart = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-fire-gray mb-2">Match Center</h1>
          <p className="text-gray-600">Manage your tournament participation and track match progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Matches</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMatches.length === 0 ? (
                    <div className="col-span-full">
                      <Card className="p-12 text-center">
                        <CardContent>
                          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No matches found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {activeTab === "all" 
                              ? "You haven't joined any tournaments yet" 
                              : `No ${activeTab} matches`}
                          </p>
                          <Button asChild className="bg-fire-red text-white">
                            <Link href="/tournaments">Browse Tournaments</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    filteredMatches.map((match) => {
                      const resultStatus = getResultStatus(match);
                      const StatusIcon = resultStatus.icon;
                      
                      return (
                        <Card key={match.id} className="card-hover">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <Link href={`/tournaments/${match.tournamentId}`}>
                                  <h3 className="font-bold text-lg text-fire-gray hover:text-fire-red cursor-pointer mb-1">
                                    {match.tournament?.title || "Tournament"}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-500 capitalize">
                                  {match.tournament?.gameType?.replace("_", " ")} • {match.tournament?.format}
                                </p>
                              </div>
                              {getStatusBadge(match.tournament?.status)}
                            </div>

                            {/* Tournament Info */}
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Prize Pool</span>
                                <span className="font-semibold text-fire-green">
                                  ₹{parseFloat(match.tournament?.prizePool || "0").toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Start Time</span>
                                <span className="font-semibold">
                                  {match.tournament?.startTime ? formatDateTime(match.tournament.startTime) : "TBD"}
                                </span>
                              </div>
                              {match.rank && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Your Rank</span>
                                  <span className="font-semibold text-fire-blue">#{match.rank}</span>
                                </div>
                              )}
                            </div>

                            {/* Countdown for upcoming matches */}
                            {match.tournament?.status === "upcoming" && match.tournament.startTime && (
                              <div className="bg-fire-blue bg-opacity-10 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-fire-blue font-medium">Starts in</span>
                                  <span className="font-bold text-fire-blue">
                                    {getTimeToStart(match.tournament.startTime)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Room Info for live matches */}
                            {match.tournament?.status === "live" && match.tournament.roomId && (
                              <div className="bg-fire-red bg-opacity-10 rounded-lg p-3 mb-4">
                                <div className="text-sm text-fire-red font-medium mb-1">Room Details</div>
                                <div className="font-mono text-fire-red">
                                  ID: {match.tournament.roomId}
                                  {match.tournament.roomPassword && (
                                    <span className="ml-4">Pass: {match.tournament.roomPassword}</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Result Status */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                              <div className="flex items-center space-x-2">
                                <StatusIcon className={`w-4 h-4 ${resultStatus.color}`} />
                                <span className={`text-sm font-medium ${resultStatus.color}`}>
                                  {resultStatus.text}
                                </span>
                              </div>
                              {match.kills !== null && (
                                <div className="text-sm text-gray-600">
                                  {match.kills} kills • {match.points} points
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                              <Button 
                                asChild 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                              >
                                <Link href={`/tournaments/${match.tournamentId}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </Button>

                              {match.tournament?.status === "live" && !match.screenshotUrl && (
                                <Button 
                                  asChild 
                                  size="sm" 
                                  className="flex-1 bg-fire-red text-white"
                                >
                                  <Link href={`/tournaments/${match.tournamentId}`}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Result
                                  </Link>
                                </Button>
                              )}

                              <Button variant="outline" size="sm">
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-fire-red text-white">
                  <Link href="/tournaments">
                    <Trophy className="w-4 h-4 mr-2" />
                    Browse Tournaments
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/teams">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Teams
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/wallet">
                    <DollarSign className="w-4 h-4 mr-2" />
                    View Wallet
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Match Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Matches</span>
                    <span className="font-semibold">{userTournaments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Live Matches</span>
                    <span className="font-semibold text-fire-red">
                      {userTournaments.filter(m => m.tournament?.status === "live").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-fire-green">
                      {userTournaments.filter(m => m.tournament?.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-semibold text-fire-blue">
                      {userTournaments.length > 0 
                        ? `${Math.round((userTournaments.filter(m => m.rank === 1).length / userTournaments.length) * 100)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTournaments.slice(0, 3).map((match) => (
                    <div key={match.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-fire-blue rounded-lg flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {match.tournament?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(match.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                      {match.rank && (
                        <Badge variant="outline" className="text-xs">
                          #{match.rank}
                        </Badge>
                      )}
                    </div>
                  ))}
                  
                  {userTournaments.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
