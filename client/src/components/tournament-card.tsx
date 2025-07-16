
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Users, 
  Trophy, 
  DollarSign, 
  Bell, 
  Zap, 
  Star, 
  Calendar, 
  MapPin, 
  Target, 
  Award, 
  TrendingUp, 
  Shield, 
  Play, 
  CheckCircle2, 
  Eye, 
  Heart, 
  Share2,
  Sparkles,
  Crown,
  Fire,
  Timer,
  Coins,
  Users2,
  ChevronRight,
  AlertCircle,
  Gamepad2
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
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
  cod: "🎖️",
  apex: "🌟",
  fortnite: "🏗️",
  rocket_league: "🚀",
  overwatch: "🎯",
};

const gameColors: Record<string, string> = {
  free_fire: "from-orange-500 via-red-500 to-pink-500",
  bgmi: "from-blue-500 via-cyan-500 to-teal-500",
  valorant: "from-green-500 via-emerald-500 to-cyan-500",
  csgo: "from-orange-500 via-yellow-500 to-red-500",
  pubg: "from-purple-500 via-blue-500 to-indigo-500",
  cod: "from-gray-700 via-gray-900 to-black",
  apex: "from-red-500 via-orange-500 to-yellow-500",
  fortnite: "from-blue-400 via-purple-500 to-pink-500",
  rocket_league: "from-blue-500 via-cyan-400 to-green-500",
  overwatch: "from-orange-400 via-blue-500 to-purple-500",
};

const gameNames: Record<string, string> = {
  free_fire: "Free Fire",
  bgmi: "BGMI",
  valorant: "Valorant",
  csgo: "CS:GO",
  pubg: "PUBG Mobile",
  cod: "Call of Duty",
  apex: "Apex Legends",
  fortnite: "Fortnite",
  rocket_league: "Rocket League",
  overwatch: "Overwatch",
};

const defaultPosters: Record<string, string> = {
  free_fire: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
  bgmi: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
  valorant: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
  csgo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
  pubg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
  const isFree = entryFee === 0;
  const slotsPercentage = (tournament.currentSlots / tournament.maxSlots) * 100;
  
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

  const getPriorityBadge = () => {
    if (prizePool >= 100000) return { text: "PREMIUM", color: "bg-gradient-to-r from-yellow-400 to-orange-500", icon: Crown };
    if (prizePool >= 50000) return { text: "HIGH STAKES", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: Fire };
    if (isFree) return { text: "FREE ENTRY", color: "bg-gradient-to-r from-green-500 to-emerald-500", icon: Sparkles };
    return null;
  };

  const getStatusIndicator = () => {
    if (isLive) return { text: "LIVE", color: "bg-red-500", icon: Play, pulse: true };
    if (isCompleted) return { text: "COMPLETED", color: "bg-gray-500", icon: CheckCircle2, pulse: false };
    if (isUpcoming) return { text: "UPCOMING", color: "bg-blue-500", icon: Clock, pulse: false };
    return { text: "UNKNOWN", color: "bg-gray-400", icon: AlertCircle, pulse: false };
  };

  const priorityBadge = getPriorityBadge();
  const statusIndicator = getStatusIndicator();

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
      {/* Background Poster with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gameGradient} opacity-85`} />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* Priority Badge */}
            {priorityBadge && (
              <Badge className={`${priorityBadge.color} text-white shadow-lg border-0 px-3 py-1.5 text-xs font-bold`}>
                <priorityBadge.icon className="w-3 h-3 mr-1" />
                {priorityBadge.text}
              </Badge>
            )}
            
            {/* Status Badge */}
            <Badge className={`${statusIndicator.color} text-white shadow-lg border-0 px-3 py-1.5 text-xs font-bold ${statusIndicator.pulse ? 'animate-pulse' : ''}`}>
              <statusIndicator.icon className="w-3 h-3 mr-1" />
              {statusIndicator.text}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Bell className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex items-center justify-center text-2xl">
              {gameIcon}
            </div>
            <div className="text-white">
              <div className="text-sm font-medium opacity-90">{gameName}</div>
              <div className="text-xs opacity-70 capitalize">{tournament.format}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-6">
        {/* Tournament Title */}
        <div>
          <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {tournament.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate()}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <Users2 className="w-4 h-4" />
            <span>{tournament.currentSlots}/{tournament.maxSlots}</span>
          </div>
        </div>

        {/* Stats Grid - Single Row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-3 text-center border border-green-100">
            <Trophy className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <div className="font-bold text-sm text-green-800">
              ₹{prizePool >= 100000 ? `${(prizePool / 100000).toFixed(0)}L` : `${(prizePool / 1000).toFixed(0)}k`}
            </div>
            <div className="text-xs text-green-600">
              {prizePool >= 50000 ? "High Stakes" : "Standard"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-3 text-center border border-blue-100">
            <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <div className="font-bold text-sm text-blue-800">
              {tournament.currentSlots}/{tournament.maxSlots}
            </div>
            <div className="text-xs text-blue-600">
              {slotsPercentage >= 80 ? "Almost Full" : slotsPercentage >= 50 ? "Half Full" : "Available"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-3 text-center border border-purple-100">
            <Coins className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <div className="font-bold text-sm text-purple-800">
              {isFree ? "FREE" : `₹${entryFee >= 1000 ? `${(entryFee / 1000).toFixed(0)}k` : entryFee.toLocaleString()}`}
            </div>
            <div className="text-xs text-purple-600">
              {isFree ? "No Cost" : entryFee <= 100 ? "Low Cost" : "Premium"}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-3 text-center border border-orange-100">
            <Timer className="w-4 h-4 text-orange-600 mx-auto mb-1" />
            <div className="font-bold text-sm text-orange-800">
              {isUpcoming ? formatTimeLeft() : isLive ? "LIVE" : "Ended"}
            </div>
            <div className="text-xs text-orange-600">
              {isUpcoming ? (timeToStart <= 3600000 ? "Soon" : "Scheduled") : 
               isLive ? "In Progress" : "Finished"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Slots Filled</span>
            <span className="font-semibold text-gray-900">{Math.round(slotsPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                slotsPercentage >= 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                slotsPercentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${slotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          
          {isLive && (
            <Link href={`/tournaments/${tournament.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium shadow-lg">
                <Play className="w-4 h-4 mr-2" />
                Join Live
              </Button>
            </Link>
          )}
          
          {isUpcoming && (
            <Link href={`/tournaments/${tournament.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg">
                <Zap className="w-4 h-4 mr-2" />
                Join Now
              </Button>
            </Link>
          )}
          
          {isCompleted && (
            <Link href={`/tournaments/${tournament.id}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 font-medium"
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Results
              </Button>
            </Link>
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{Math.floor(Math.random() * 1000) + 500} views</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate()}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
