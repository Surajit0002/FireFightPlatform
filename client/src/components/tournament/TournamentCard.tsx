import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Gamepad2, DollarSign, Gift } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import PrizeDistributionModal from "./PrizeDistributionModal";
import type { Tournament } from "@/types";

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-fire-red text-white tournament-live">LIVE</Badge>;
      case "upcoming":
        return <Badge className="bg-fire-blue text-white">UPCOMING</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 text-white">COMPLETED</Badge>;
      default:
        return <Badge variant="outline">{status.toUpperCase()}</Badge>;
    }
  };

  const getGameIcon = (gameType: string) => {
    // You can replace this with actual game icons
    return <Gamepad2 className="w-12 h-12 rounded-lg object-cover" />;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) {
      return "Started";
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const entryFeeFloat = parseFloat(tournament.entryFee);
  const prizePoolFloat = parseFloat(tournament.prizePool);

  return (
    <Card className="card-hover border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
                {tournament.gameType.replace("_", " ")}
              </h4>
            </div>
          </div>
          {getStatusBadge(tournament.status)}
        </div>

        <h3 className="font-bold text-lg text-fire-gray mb-4">{tournament.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              Prize Pool
            </span>
            <span className="font-semibold text-fire-green">
              ₹{prizePoolFloat.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Entry Fee</span>
            <span className="font-semibold">
              {entryFeeFloat === 0 ? (
                <span className="text-fire-green">FREE</span>
              ) : (
                `₹${entryFeeFloat.toLocaleString()}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Format</span>
            <span className="font-semibold capitalize">{tournament.format}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Slots
            </span>
            <span className="font-semibold">
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>
        </div>

        {tournament.status === "upcoming" && (
          <div className="bg-gray-100 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-600 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Starts in
            </div>
            <div className="font-bold text-fire-blue">
              {formatDateTime(tournament.startTime)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button asChild className={`${
            entryFeeFloat === 0 
              ? "bg-fire-green hover:bg-green-600" 
              : tournament.status === "live" 
                ? "bg-fire-red hover:bg-red-600" 
                : "bg-fire-blue hover:bg-blue-600"
          } text-white font-semibold`}>
            <Link href={`/tournaments/${tournament.id}`}>
              <DollarSign className="w-4 h-4 mr-1" />
              {entryFeeFloat === 0 ? "Join FREE" : `Join ₹${entryFeeFloat}`}
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="border-fire-blue text-fire-blue hover:bg-fire-blue hover:text-white font-semibold"
            onClick={(e) => {
              e.preventDefault();
              setIsPrizeModalOpen(true);
            }}
          >
            <Gift className="w-4 h-4 mr-1" />
            Prizes
          </Button>
        </div>

        <PrizeDistributionModal
          isOpen={isPrizeModalOpen}
          onClose={() => setIsPrizeModalOpen(false)}
          tournament={{
            title: tournament.title,
            prizePool: tournament.prizePool,
            entryFee: tournament.entryFee,
            currentParticipants: tournament.currentParticipants,
            maxParticipants: tournament.maxParticipants
          }}
        />
      </CardContent>
    </Card>
  );
}
