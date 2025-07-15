import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Trophy, DollarSign } from "lucide-react";
import { Link } from "wouter";
import type { Tournament } from "@shared/schema";

interface TournamentCardProps {
  tournament: Tournament;
}

const gameIcons: Record<string, string> = {
  free_fire: "🔥",
  bgmi: "🎯",
  valorant: "⚡",
  csgo: "💥",
  pubg: "🎮",
};

const gameColors: Record<string, string> = {
  free_fire: "bg-fire-red",
  bgmi: "bg-fire-blue",
  valorant: "bg-fire-green",
  csgo: "bg-fire-orange",
  pubg: "bg-purple-500",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameColor = gameColors[tournament.game] || "bg-fire-red";
  
  const startTime = new Date(tournament.startTime);
  const now = new Date();
  const isLive = tournament.status === "live";
  const timeToStart = startTime.getTime() - now.getTime();
  
  const formatTimeLeft = () => {
    if (timeToStart <= 0) return "Started";
    
    const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const statusBadge = () => {
    if (isLive) {
      return (
        <Badge className="bg-fire-red text-white tournament-live">
          LIVE
        </Badge>
      );
    }
    if (tournament.status === "completed") {
      return <Badge variant="secondary">COMPLETED</Badge>;
    }
    if (parseFloat(tournament.entryFee) === 0) {
      return <Badge className="bg-fire-green text-white">FREE</Badge>;
    }
    return <Badge className="bg-fire-blue text-white">UPCOMING</Badge>;
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${gameColor} rounded-lg flex items-center justify-center text-white text-2xl`}>
            {gameIcon}
          </div>
          {statusBadge()}
        </div>

        <h3 className="font-bold text-lg fire-gray mb-2 line-clamp-1">
          {tournament.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Prize Pool</span>
            <span className="font-semibold fire-green flex items-center">
              <Trophy className="w-3 h-3 mr-1" />
              ₹{tournament.prizePool}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Entry Fee</span>
            <span className="font-semibold flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              {parseFloat(tournament.entryFee) === 0 ? "FREE" : `₹${tournament.entryFee}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Format</span>
            <span className="font-semibold capitalize">{tournament.format}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Slots</span>
            <span className="font-semibold flex items-center">
              <Users className="w-3 h-3 mr-1" />
              {tournament.currentSlots}/{tournament.maxSlots}
            </span>
          </div>
        </div>

        {!isLive && timeToStart > 0 && (
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Starts in
            </div>
            <div className={`font-bold ${isLive ? "fire-red" : "fire-blue"}`}>
              {formatTimeLeft()}
            </div>
          </div>
        )}

        <Link href={`/tournaments/${tournament.id}`}>
          <Button 
            className={`w-full ${
              isLive 
                ? "bg-fire-red hover:bg-red-600" 
                : parseFloat(tournament.entryFee) === 0
                ? "bg-fire-green hover:bg-green-600"
                : "bg-fire-blue hover:bg-blue-600"
            } text-white font-semibold`}
          >
            {isLive ? "Join Live Match" : parseFloat(tournament.entryFee) === 0 ? "Join Free Tournament" : "Join Tournament"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
