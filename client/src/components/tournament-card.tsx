
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Trophy, DollarSign, Bell, Zap, Star, Calendar, MapPin, Target, Award, TrendingUp, Shield } from "lucide-react";
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

const gameGradients: Record<string, string> = {
  free_fire: "from-orange-500 via-red-500 to-pink-500",
  bgmi: "from-blue-500 via-purple-500 to-indigo-600",
  valorant: "from-red-500 via-pink-500 to-rose-500",
  csgo: "from-yellow-500 via-orange-500 to-red-500",
  pubg: "from-blue-600 via-purple-600 to-indigo-700",
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
  double_elimination: "Double Elimination",
  single_elimination: "Single Elimination",
  round_robin: "Round Robin",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameGradient = gameGradients[tournament.game] || "from-gray-500 to-gray-700";
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

  const getStatusConfig = () => {
    if (isLive) {
      return {
        badge: "LIVE NOW",
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg",
        icon: <Zap className="w-3 h-3 animate-pulse" />,
        glow: "shadow-red-500/50"
      };
    }
    if (isCompleted) {
      return {
        badge: "COMPLETED",
        className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
        icon: <Award className="w-3 h-3" />,
        glow: "shadow-green-500/30"
      };
    }
    if (parseFloat(tournament.entryFee) === 0) {
      return {
        badge: "FREE ENTRY",
        className: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
        icon: <Star className="w-3 h-3" />,
        glow: "shadow-green-500/30"
      };
    }
    return {
      badge: "UPCOMING",
      className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
      icon: <Calendar className="w-3 h-3" />,
      glow: "shadow-blue-500/30"
    };
  };

  const getSpecialTags = () => {
    const tags = [];
    
    if (tournament.isFeatured) {
      tags.push(
        <div key="featured" className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
          <Star className="w-3 h-3" />
          Featured
        </div>
      );
    }
    
    if (parseFloat(tournament.prizePool) > 50000) {
      tags.push(
        <div key="high-prize" className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          <Trophy className="w-3 h-3" />
          High Prize
        </div>
      );
    }
    
    if (tournament.format === "solo") {
      tags.push(
        <div key="beginner" className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          <Target className="w-3 h-3" />
          Solo
        </div>
      );
    }
    
    return tags;
  };

  const getPosterImage = () => {
    if (tournament.posterUrl) {
      return tournament.posterUrl;
    }
    
    const fallbackPosters: Record<string, string> = {
      free_fire: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=300&fit=crop&crop=center",
      bgmi: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=300&fit=crop&crop=center",
      valorant: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=300&fit=crop&crop=center",
      csgo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=300&fit=crop&crop=center",
      pubg: "https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=600&h=300&fit=crop&crop=center",
    };
    
    return fallbackPosters[tournament.game] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=300&fit=crop&crop=center";
  };

  const slotsFillPercentage = (tournament.currentSlots / tournament.maxSlots) * 100;
  const statusConfig = getStatusConfig();
  const entryFee = parseFloat(tournament.entryFee);
  const prizePool = parseFloat(tournament.prizePool);

  return (
    <Card className={`group relative w-full max-w-sm h-[420px] overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white border-0 ${statusConfig.glow}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50"></div>
      
      {/* Poster Banner with Enhanced Overlay */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={getPosterImage()}
          alt={tournament.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className={`absolute inset-0 bg-gradient-to-r ${gameGradient} opacity-30 mix-blend-overlay`}></div>
        
        {/* Game Icon with Glow Effect */}
        <div className="absolute top-4 left-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${gameGradient} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg backdrop-blur-sm border border-white/20`}>
            {gameIcon}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge className={`${statusConfig.className} px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm`}>
            {statusConfig.icon}
            {statusConfig.badge}
          </Badge>
        </div>
        
        {/* Special Tags */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 max-w-[240px]">
          {getSpecialTags()}
        </div>
        
        {/* Quick Stats Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-white text-xs">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
            <Users className="w-3 h-3" />
            <span className="font-medium">{tournament.currentSlots}/{tournament.maxSlots}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
            <Trophy className="w-3 h-3" />
            <span className="font-medium">₹{(prizePool / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="relative p-6 h-[280px] flex flex-col justify-between bg-white/95 backdrop-blur-sm">
        {/* Header Section */}
        <div className="space-y-3">
          {/* Game Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <div className="font-bold text-lg text-gray-800 leading-tight">{gameName}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="font-medium capitalize">{formatModes[tournament.format] || tournament.format}</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Online
                  </span>
                </div>
              </div>
            </div>
            
            {/* Live Indicator */}
            {isLive && (
              <div className="flex items-center gap-1 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold">LIVE</span>
              </div>
            )}
          </div>

          {/* Tournament Title */}
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 leading-tight">
            {tournament.title}
          </h3>

          {/* Enhanced Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Prize Pool</div>
                  <div className="font-bold text-lg text-orange-600">₹{prizePool.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Entry Fee</div>
                  <div className="font-bold text-lg text-green-600">
                    {entryFee === 0 ? "FREE" : `₹${entryFee.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Slots</div>
                  <div className="font-bold text-lg text-blue-600">
                    {tournament.currentSlots}/{tournament.maxSlots}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">
                    {isLive ? "Live Now" : isCompleted ? "Completed" : "Starts"}
                  </div>
                  <div className="font-bold text-sm text-purple-600">
                    {isLive ? "Playing" : isCompleted ? "Finished" : formatDate()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Slots Filled</span>
              <span className="text-gray-700 font-bold">{slotsFillPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
              <div 
                className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${gameGradient} shadow-sm`}
                style={{ width: `${slotsFillPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button 
              className={`w-full h-12 text-sm font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                isLive 
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-500/30" 
                  : isCompleted
                  ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/30"
                  : entryFee === 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30"
                  : `bg-gradient-to-r ${gameGradient} hover:opacity-90`
              } text-white rounded-xl`}
            >
              {isLive ? (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  Join Live Match
                </div>
              ) : isCompleted ? (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  View Results
                </div>
              ) : entryFee === 0 ? (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Join Free Tournament
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Join Tournament
                </div>
              )}
            </Button>
          </Link>
          
          {!isLive && !isCompleted && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-12 w-12 p-0 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Bell className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>
      </CardContent>

      {/* Floating Time Indicator for Upcoming */}
      {isUpcoming && timeToStart > 0 && (
        <div className="absolute top-48 left-6 right-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Starts in</span>
              </div>
              <div className="font-bold text-sm">
                {formatTimeLeft()}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
