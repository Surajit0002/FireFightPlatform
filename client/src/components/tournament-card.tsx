import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Trophy,
  Gamepad2,
  Calendar,
  MapPin,
  Zap,
  Target,
  Heart,
  Bookmark,
  Share2,
  Coins,
  Star,
  Medal,
  Crown,
  Fire,
  DollarSign,
  Gift,
  Eye,
  TrendingUp,
  Timer,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import PrizeDistributionModal from "./tournament/PrizeDistributionModal";
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
  pubg: "from-green-500 to-emerald-600",
};

const gameNames: Record<string, string> = {
  free_fire: "Free Fire",
  bgmi: "BGMI",
  valorant: "Valorant",
  csgo: "CS:GO",
  pubg: "PUBG",
};

const posterImages: Record<string, string> = {
  free_fire:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
  bgmi: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
  valorant:
    "https://images.unsplash.com/photo-1538481199464-7160b5f4b1c3?w=400&h=250&fit=crop",
  csgo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
  pubg: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    Math.floor(Math.random() * 100) + 50,
  );
  const [viewCount] = useState(Math.floor(Math.random() * 500) + 100);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

  const gameIcon = gameIcons[tournament.game] || "🎮";
  const gameColor = gameColors[tournament.game] || "from-gray-500 to-gray-600";
  const gameName = gameNames[tournament.game] || tournament.game.toUpperCase();
  const posterImage =
    posterImages[tournament.game] ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop";

  const startTime = new Date(tournament.startTime);
  const now = new Date();
  const isLive = tournament.status === "live";
  const isUpcoming = tournament.status === "upcoming";
  const isCompleted = tournament.status === "completed";
  const timeToStart = startTime.getTime() - now.getTime();

  const formatTimeLeft = () => {
    if (timeToStart <= 0) return "Started";

    const days = Math.floor(timeToStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeToStart % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = () => {
    return startTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const slotsFillPercentage =
    (tournament.currentSlots / tournament.maxSlots) * 100;
  const entryFee = parseFloat(tournament.entryFee);
  const prizePool = parseFloat(tournament.prizePool);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return `${amount.toFixed(0)}`;
  };

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </Badge>
      );
    }
    if (isCompleted) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
          <CheckCircle2 className="w-3 h-3" />
          COMPLETED
        </Badge>
      );
    }
    if (entryFee === 0) {
      return (
        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
          <Gift className="w-3 h-3" />
          FREE
        </Badge>
      );
    }
    return (
      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
        <Timer className="w-3 h-3" />
        {formatTimeLeft()}
      </Badge>
    );
  };

  const getUrgencyIndicator = () => {
    if (slotsFillPercentage >= 90) {
      return (
        <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
          <Zap className="w-3 h-3" />
          Almost Full!
        </div>
      );
    }
    if (slotsFillPercentage >= 75) {
      return (
        <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
          <Target className="w-3 h-3" />
          Filling Fast
        </div>
      );
    }
    return null;
  };

  const getTournamentType = () => {
    if (prizePool >= 100000)
      return { label: "MEGA", color: "from-purple-500 to-pink-600" };
    if (prizePool >= 50000)
      return { label: "PREMIUM", color: "from-blue-500 to-cyan-600" };
    if (entryFee === 0)
      return { label: "FREE", color: "from-green-500 to-emerald-600" };
    return { label: "STANDARD", color: "from-gray-500 to-gray-600" };
  };

  const tournamentType = getTournamentType();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.share?.({
      title: tournament.title,
      text: `Join ${tournament.title} - ${formatCurrency(prizePool)} prize pool!`,
      url: window.location.href,
    });
  };

  return (
    <Card className="group relative w-full max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 overflow-hidden">
      {/* Poster Image Header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={posterImage}
          alt={tournament.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${gameColor} opacity-80`}
        ></div>

        {/* Top Row - Status and Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2">
            {getStatusBadge()}
            <Badge
              className={`bg-gradient-to-r ${tournamentType.color} text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg`}
            >
              {tournamentType.label}
            </Badge>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleBookmark}
              className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-yellow-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="absolute top-36 right-1 transform -translate-x-1">
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-2xl">{gameIcon}</span>
            <span className="text-white font-medium text-sm">{gameName}</span>
          </div>
        </div>

        {/* Title and Format */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 drop-shadow-lg">
            {tournament.title}
          </h3>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Crown className="w-4 h-4" />
            <span className="capitalize">{tournament.format}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Prize Pool */}
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Prize Pool</p>
              <p className="font-bold text-orange-600">
                ₹{formatCurrency(prizePool)}
              </p>
            </div>
          </div>

          {/* Team Size */}
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Team Size</p>
              <p className="font-bold text-purple-600">
                {tournament.teamSize || 4} Players
              </p>
            </div>
          </div>
        </div>

        {/* Slots and Progress */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {tournament.currentSlots}/{tournament.maxSlots} Players
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-gray-700">
                {slotsFillPercentage.toFixed(0)}%
              </div>
              {getUrgencyIndicator()}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                slotsFillPercentage >= 90
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : slotsFillPercentage >= 75
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                    : "bg-gradient-to-r from-blue-500 to-emerald-500"
              }`}
              style={{ width: `${slotsFillPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Tournament Details */}
        <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Start Time</p>
              <p className="font-medium">{formatDate()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Mode</p>
              <p className="font-medium">Online</p>
            </div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            asChild
            className={`font-bold ${
              tournament.status === "live"
                ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                : entryFee === 0
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            } text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
          >
            <Link href={`/tournaments/${tournament.id}`}>
              <Zap className="w-4 h-4 mr-1" />
              {entryFee === 0 ? "Join Free" : `Join ₹${formatCurrency(entryFee)}`}
            </Link>
          </Button>

          <Button
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              setIsPrizeModalOpen(true);
            }}
          >
            <Gift className="w-4 h-4 mr-1" />
            Prizes
          </Button>
        </div>
      </CardContent>

      <PrizeDistributionModal
        isOpen={isPrizeModalOpen}
        onClose={() => setIsPrizeModalOpen(false)}
        tournament={{
          title: tournament.title,
          prizePool: tournament.prizePool,
          entryFee: tournament.entryFee,
          currentParticipants: tournament.currentParticipants || 0,
          maxParticipants: tournament.maxParticipants || 100,
        }}
      />
    </Card>
  );
}
