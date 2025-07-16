
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Trophy, DollarSign, Bell, Zap, Star, Calendar, MapPin, Target, Award, TrendingUp, Shield, Play, CheckCircle2, Eye, Heart, Share2 } from "lucide-react";
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
  free_fire: "from-orange-500 to-red-600",
  bgmi: "from-blue-500 to-cyan-600",
  valorant: "from-red-500 to-pink-600",
  csgo: "from-yellow-500 to-orange-600",
  pubg: "from-green-500 to-teal-600",
};

const gameNames: Record<string, string> = {
  free_fire: "Free Fire",
  bgmi: "BGMI",
  valorant: "Valorant",
  csgo: "CS:GO",
  pubg: "PUBG",
};

// Default poster images for each game
const defaultPosters: Record<string, string> = {
  free_fire: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop",
  bgmi: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop",
  valorant: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=200&fit=crop",
  csgo: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=200&fit=crop",
  pubg: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameGradient = gameColors[tournament.game] || "from-gray-500 to-gray-600";
  const gameName = gameNames[tournament.game] || tournament.game.toUpperCase();
  const posterUrl = (tournament as any).posterUrl || defaultPosters[tournament.game] || defaultPosters.pubg;
  
  const startTime = new Date(tournament.startTime);
  const now = new Date();
  const isLive = tournament.status === "live";
  const isUpcoming = tournament.status === "upcoming";
  const isCompleted = tournament.status === "completed";
  const timeToStart = startTime.getTime() - now.getTime();
  const entryFee = parseFloat(tournament.entryFee);
  const prizePool = parseFloat(tournament.prizePool);
  
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
      minute: '2-digit',
    });
  };

  const slotsPercentage = (tournament.currentSlots / tournament.maxSlots) * 100;
  const isAlmostFull = slotsPercentage >= 80;
  const isFree = entryFee === 0;
  const isPremium = prizePool >= 50000;

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="absolute top-3 left-3 bg-red-500 text-white animate-pulse border-0">
          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-ping"></div>
          LIVE
        </Badge>
      );
    }
    if (isCompleted) {
      return (
        <Badge className="absolute top-3 left-3 bg-gray-800 text-white border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          COMPLETED
        </Badge>
      );
    }
    if (isFree) {
      return (
        <Badge className="absolute top-3 left-3 bg-green-500 text-white border-0">
          <Star className="w-3 h-3 mr-1" />
          FREE ENTRY
        </Badge>
      );
    }
    return null;
  };

  const getOverlayTags = () => {
    const tags = [];
    
    if (isPremium && !isLive && !isCompleted) {
      tags.push(
        <Badge key="premium" className="bg-yellow-500 text-black border-0 text-xs">
          <Trophy className="w-3 h-3 mr-1" />
          PREMIUM
        </Badge>
      );
    }
    
    if (isAlmostFull && !isCompleted) {
      tags.push(
        <Badge key="filling" className="bg-orange-500 text-white border-0 text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          FILLING FAST
        </Badge>
      );
    }

    if (tournament.format === "beginner" || tournament.title.toLowerCase().includes("beginner")) {
      tags.push(
        <Badge key="beginner" className="bg-blue-500 text-white border-0 text-xs">
          <Shield className="w-3 h-3 mr-1" />
          BEGINNER
        </Badge>
      );
    }

    return tags;
  };

  return (
    <Card className="group relative w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 overflow-hidden">
      {/* Poster Image with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={posterUrl}
          alt={tournament.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultPosters[tournament.game] || defaultPosters.pubg;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gameGradient} opacity-60`}></div>
        
        {/* Status Badge */}
        {getStatusBadge()}
        
        {/* Additional Overlay Tags */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {getOverlayTags()}
        </div>

        {/* Game Icon */}
        <div className="absolute bottom-3 left-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${gameGradient} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
            {gameIcon}
          </div>
        </div>

        {/* Action Icons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 leading-tight line-clamp-2 mb-2">
              {tournament.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <div className={`w-3 h-3 bg-gradient-to-r ${gameGradient} rounded-full`}></div>
                {gameName}
              </span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span className="capitalize">{tournament.format}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Prize Pool</span>
            </div>
            <div className="font-bold text-lg text-green-800">
              ₹{prizePool >= 100000 ? `${(prizePool / 100000).toFixed(0)}L` : `${(prizePool / 1000).toFixed(0)}k`}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Slots</span>
            </div>
            <div className="font-bold text-lg text-blue-800">
              {tournament.currentSlots}/{tournament.maxSlots}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Entry Fee</span>
            </div>
            <div className="font-bold text-lg text-purple-800">
              {isFree ? "FREE" : `₹${entryFee.toLocaleString()}`}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 border border-orange-100">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">
                {isUpcoming ? "Starts" : isLive ? "Started" : "Ended"}
              </span>
            </div>
            <div className="font-bold text-sm text-orange-800">
              {isUpcoming ? formatTimeLeft() : formatDate()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Slots Filled</span>
            <span className="text-sm font-bold text-gray-900">{slotsPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                slotsPercentage >= 90 ? 'bg-red-500' : 
                slotsPercentage >= 75 ? 'bg-orange-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${slotsPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Countdown Timer for Upcoming */}
        {isUpcoming && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 mb-4 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Starting in</span>
              </div>
              <div className="font-bold text-indigo-800">{formatTimeLeft()}</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link href={`/tournaments/${tournament.id}`} className="w-full block">
          <Button 
            className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
              isLive 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25' 
                : isCompleted 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-500/25'
                  : isFree
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isLive ? (
                <>
                  <Play className="w-5 h-5" />
                  <span>Join Live Tournament</span>
                </>
              ) : isCompleted ? (
                <>
                  <Award className="w-5 h-5" />
                  <span>View Results</span>
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>{isFree ? 'Join Free Tournament' : 'Join Tournament'}</span>
                </>
              )}
            </div>
          </Button>
        </Link>

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {Math.floor(Math.random() * 500) + 100}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Online</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
