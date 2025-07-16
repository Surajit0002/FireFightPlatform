import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Trophy, DollarSign, Bell, Zap, Star, Calendar, MapPin, Target, Award, TrendingUp, Shield, Play, CheckCircle2 } from "lucide-react";
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
  free_fire: "bg-orange-500",
  bgmi: "bg-blue-500",
  valorant: "bg-red-500",
  csgo: "bg-yellow-500",
  pubg: "bg-green-500",
};

const gameNames: Record<string, string> = {
  free_fire: "Free Fire",
  bgmi: "BGMI",
  valorant: "Valorant",
  csgo: "CS:GO",
  pubg: "PUBG",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameColor = gameColors[tournament.game] || "bg-gray-500";
  const gameName = gameNames[tournament.game] || tournament.game.toUpperCase();
  
  const startTime = new Date(tournament.startTime);
  const now = new Date();
  const isLive = tournament.status === "live";
  const isUpcoming = tournament.status === "upcoming";
  const isCompleted = tournament.status === "completed";
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

  const formatDate = () => {
    return startTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const slotsFillPercentage = (tournament.currentSlots / tournament.maxSlots) * 100;
  const entryFee = parseFloat(tournament.entryFee);
  const prizePool = parseFloat(tournament.prizePool);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </Badge>
      );
    }
    if (isCompleted) {
      return (
        <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          COMPLETED
        </Badge>
      );
    }
    if (entryFee === 0) {
      return (
        <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Star className="w-3 h-3" />
          FREE ENTRY
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {formatTimeLeft()}
      </Badge>
    );
  };

  return (
    <Card className="group relative w-full max-w-sm bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-200">
      {/* Header Section */}
      <div className="p-4 pb-2">
        {/* Title and Status */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">
            {tournament.title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Game Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 ${gameColor} rounded-full flex items-center justify-center text-white text-sm`}>
            {gameIcon}
          </div>
          <span className="text-sm font-medium text-gray-700">{gameName}</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-500">{tournament.format}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          {/* Prize Pool */}
          <div className="flex flex-col items-center p-2 bg-orange-50 rounded-lg">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mb-1">
              <Trophy className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500">Prize Pool</span>
            <span className="text-sm font-bold text-orange-600">{formatCurrency(prizePool)}</span>
          </div>

          {/* Slots */}
          <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mb-1">
              <Users className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500">Slots</span>
            <span className="text-sm font-bold text-blue-600">{tournament.currentSlots}/{tournament.maxSlots}</span>
          </div>

          {/* Entry Fee */}
          <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
              <DollarSign className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500">Entry Fee</span>
            <span className="text-sm font-bold text-green-600">
              {entryFee === 0 ? "FREE" : formatCurrency(entryFee)}
            </span>
          </div>

          {/* Start Time */}
          <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mb-1">
              <Calendar className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-500">Starts</span>
            <span className="text-sm font-bold text-purple-600">{formatDate()}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Slots Filled</span>
            <span className="text-xs font-medium text-gray-700">{slotsFillPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                slotsFillPercentage >= 75 ? 'bg-red-500' : 
                slotsFillPercentage >= 50 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${slotsFillPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <Link href={`/tournaments/${tournament.id}`} className="w-full">
          <Button 
            className={`w-full h-10 rounded-lg font-medium transition-all duration-200 ${
              isLive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : isCompleted 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLive ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Join Live
              </>
            ) : isCompleted ? (
              <>
                <Award className="w-4 h-4 mr-2" />
                View Results
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Join Tournament
              </>
            )}
          </Button>
        </Link>
      </div>
    </Card>
  );
}