import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Trophy, DollarSign, Bell } from "lucide-react";
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

const gameNames: Record<string, string> = {
  free_fire: "Free Fire",
  bgmi: "BGMI",
  valorant: "Valorant",
  csgo: "CS:GO",
  pubg: "PUBG",
};

const formatModes: Record<string, string> = {
  solo: "Solo",
  duo: "Duo",
  squad: "Squad",
  team: "Team",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameColor = gameColors[tournament.game] || "bg-fire-red";
  const gameName = gameNames[tournament.game] || tournament.game.toUpperCase();
  
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

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="bg-fire-red text-white animate-pulse">
          LIVE NOW
        </Badge>
      );
    }
    if (tournament.status === "completed") {
      return <Badge variant="secondary">COMPLETED</Badge>;
    }
    if (parseFloat(tournament.entryFee) === 0) {
      return <Badge className="bg-fire-green text-white">FREE ENTRY</Badge>;
    }
    return <Badge className="bg-fire-blue text-white">UPCOMING</Badge>;
  };

  const getOverlayTags = () => {
    const tags = [];
    
    if (tournament.isFeatured) {
      tags.push(
        <Badge key="featured" className="bg-yellow-500 text-black text-xs">
          ⭐ Featured
        </Badge>
      );
    }
    
    if (parseFloat(tournament.entryFee) === 0) {
      tags.push(
        <Badge key="free" className="bg-green-500 text-white text-xs">
          🆓 Free
        </Badge>
      );
    }
    
    if (tournament.format === "solo") {
      tags.push(
        <Badge key="beginner" className="bg-blue-500 text-white text-xs">
          🎯 Beginner Friendly
        </Badge>
      );
    }
    
    return tags;
  };

  const getPosterImage = () => {
    if (tournament.posterUrl) {
      return tournament.posterUrl;
    }
    
    // Fallback poster based on game
    const fallbackPosters: Record<string, string> = {
      free_fire: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center",
      bgmi: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop&crop=center",
      valorant: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop&crop=center",
      csgo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop&crop=center",
      pubg: "https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=400&h=200&fit=crop&crop=center",
    };
    
    return fallbackPosters[tournament.game] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center";
  };

  const slotsFillPercentage = (tournament.currentSlots / tournament.maxSlots) * 100;

  return (
    <Card className="w-full max-w-sm h-[300px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
      {/* Poster Banner */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={getPosterImage()}
          alt={tournament.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Overlay Tags */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[200px]">
          {getOverlayTags()}
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4 h-[168px] flex flex-col justify-between">
        {/* Header Info */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${gameColor} rounded-lg flex items-center justify-center text-white text-lg`}>
              {gameIcon}
            </div>
            <div>
              <div className="font-bold text-sm text-gray-800">{gameName}</div>
              <div className="text-xs text-gray-500 capitalize">
                {formatModes[tournament.format] || tournament.format}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-1">
          {tournament.title}
        </h3>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span className="text-gray-600">₹{tournament.prizePool}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-green-500" />
            <span className="text-gray-600">
              {parseFloat(tournament.entryFee) === 0 ? "Free" : `₹${tournament.entryFee}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-blue-500" />
            <span className="text-gray-600">
              {tournament.currentSlots}/{tournament.maxSlots}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-500" />
            <span className="text-gray-600 text-xs">
              {isLive ? "Live" : formatTimeLeft()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${gameColor}`}
            style={{ width: `${slotsFillPercentage}%` }}
          ></div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button 
              className={`w-full h-8 text-xs font-semibold ${
                isLive 
                  ? "bg-fire-red hover:bg-red-600" 
                  : parseFloat(tournament.entryFee) === 0
                  ? "bg-fire-green hover:bg-green-600"
                  : "bg-fire-blue hover:bg-blue-600"
              } text-white`}
            >
              {isLive ? "Join Live" : tournament.status === "completed" ? "View Results" : "Join Now"}
            </Button>
          </Link>
          
          {!isLive && tournament.status !== "completed" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 border-gray-300 hover:border-gray-400"
            >
              <Bell className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
