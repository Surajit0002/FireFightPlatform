
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Target, Zap, Star, DollarSign, Users, Award } from "lucide-react";

interface PrizeDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: {
    title: string;
    prizePool: string;
    entryFee: string;
    currentParticipants: number;
    maxParticipants: number;
  };
}

export default function PrizeDistributionModal({ isOpen, onClose, tournament }: PrizeDistributionModalProps) {
  const totalPrizePool = parseFloat(tournament.prizePool);

  // Prize Distribution Logic
  const prizeDistribution = [
    { place: "🥇 1st Place", percentage: 40, amount: Math.floor(totalPrizePool * 0.40), color: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
    { place: "🥈 2nd Place", percentage: 25, amount: Math.floor(totalPrizePool * 0.25), color: "bg-gradient-to-r from-gray-400 to-gray-600" },
    { place: "🥉 3rd Place", percentage: 10, amount: Math.floor(totalPrizePool * 0.10), color: "bg-gradient-to-r from-orange-400 to-orange-600" },
    { place: "4th - 5th Place", percentage: 5, amount: Math.floor(totalPrizePool * 0.05), color: "bg-gradient-to-r from-blue-400 to-blue-600", note: "₹" + Math.floor(totalPrizePool * 0.025) + " each" },
    { place: "6th - 9th Place", percentage: 5, amount: Math.floor(totalPrizePool * 0.05), color: "bg-gradient-to-r from-purple-400 to-purple-600", note: "₹" + Math.floor(totalPrizePool * 0.0125) + " each" }
  ];

  const bonusDistribution = [
    { category: "Per Kill Bonus", percentage: 5, amount: Math.floor(totalPrizePool * 0.05), color: "bg-fire-red" },
    { category: "Organizer Fee", percentage: 3, amount: Math.floor(totalPrizePool * 0.03), color: "bg-gray-500" },
    { category: "MVP Award", percentage: 3, amount: Math.floor(totalPrizePool * 0.03), color: "bg-fire-green" },
    { category: "Most Kills", percentage: 2, amount: Math.floor(totalPrizePool * 0.02), color: "bg-fire-blue" },
    { category: "Surprise Challenge", percentage: 2, amount: Math.floor(totalPrizePool * 0.02), color: "bg-fire-teal" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Prize Distribution - {tournament.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tournament Overview */}
          <Card className="bg-gradient-to-r from-fire-red to-fire-blue text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">₹{totalPrizePool.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Prize Pool</div>
                </div>
                <div>
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                  <div className="text-sm opacity-90">Players</div>
                </div>
                <div>
                  <Target className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">₹{tournament.entryFee === "0" ? "FREE" : tournament.entryFee}</div>
                  <div className="text-sm opacity-90">Entry Fee</div>
                </div>
                <div>
                  <Award className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{prizeDistribution.length + bonusDistribution.length}</div>
                  <div className="text-sm opacity-90">Prize Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Prize Distribution */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              🏆 Main Prize Distribution (87%)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prizeDistribution.map((prize, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    <div className={`${prize.color} text-white p-3 rounded-lg mb-3`}>
                      <div className="font-bold text-lg">{prize.place}</div>
                      <div className="text-sm opacity-90">{prize.percentage}% of total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹{prize.amount.toLocaleString()}</div>
                      {prize.note && (
                        <div className="text-sm text-gray-600 mt-1">{prize.note}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bonus & Special Awards */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-fire-green" />
              🎉 Bonus & Special Awards (13%)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {bonusDistribution.map((bonus, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${bonus.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      {bonus.category === "Per Kill Bonus" && <Zap className="w-6 h-6 text-white" />}
                      {bonus.category === "MVP Award" && <Star className="w-6 h-6 text-white" />}
                      {bonus.category === "Most Kills" && <Target className="w-6 h-6 text-white" />}
                      {bonus.category === "Organizer Fee" && <DollarSign className="w-6 h-6 text-white" />}
                      {bonus.category === "Surprise Challenge" && <Award className="w-6 h-6 text-white" />}
                    </div>
                    <div className="font-semibold text-sm mb-1">{bonus.category}</div>
                    <div className="text-lg font-bold text-green-600">₹{bonus.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{bonus.percentage}%</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Rules & Notes */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-bold text-blue-800 mb-3">⚖️ Dynamic Adjustment Rules:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• If fewer players join, rewards auto-scale proportionally</li>
                <li>• Entry pool increases = amounts auto-calculate in real-time</li>
                <li>• Kill rewards split among qualified kills based on performance</li>
                <li>• Reserved funds redirected if challenges not completed</li>
                <li>• All prizes distributed within 24 hours of tournament completion</li>
              </ul>
            </CardContent>
          </Card>

          {/* Prize Pool Breakdown Visualization */}
          <div>
            <h4 className="font-bold mb-3">📊 Prize Pool Breakdown</h4>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex h-8 rounded overflow-hidden">
                <div className="bg-yellow-400 flex-[40] flex items-center justify-center text-xs font-bold text-white">
                  1st - 40%
                </div>
                <div className="bg-gray-400 flex-[25] flex items-center justify-center text-xs font-bold text-white">
                  2nd - 25%
                </div>
                <div className="bg-orange-400 flex-[10] flex items-center justify-center text-xs font-bold text-white">
                  3rd - 10%
                </div>
                <div className="bg-blue-400 flex-[10] flex items-center justify-center text-xs font-bold text-white">
                  4th-9th - 10%
                </div>
                <div className="bg-green-500 flex-[15] flex items-center justify-center text-xs font-bold text-white">
                  Bonus - 15%
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>₹{Math.floor(totalPrizePool * 0.40).toLocaleString()}</span>
                <span>₹{Math.floor(totalPrizePool * 0.25).toLocaleString()}</span>
                <span>₹{Math.floor(totalPrizePool * 0.10).toLocaleString()}</span>
                <span>₹{Math.floor(totalPrizePool * 0.10).toLocaleString()}</span>
                <span>₹{Math.floor(totalPrizePool * 0.15).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
