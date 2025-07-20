import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Target, Zap, Star, DollarSign, Users, Award, X } from "lucide-react";

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
    { place: "🥇 1st", percentage: 40, amount: Math.floor(totalPrizePool * 0.40), color: "bg-yellow-500" },
    { place: "🥈 2nd", percentage: 25, amount: Math.floor(totalPrizePool * 0.25), color: "bg-gray-500" },
    { place: "🥉 3rd", percentage: 10, amount: Math.floor(totalPrizePool * 0.10), color: "bg-orange-500" },
    { place: "4th-5th", percentage: 5, amount: Math.floor(totalPrizePool * 0.05), color: "bg-blue-500", note: "₹" + Math.floor(totalPrizePool * 0.025) + " each" },
    { place: "6th-9th", percentage: 5, amount: Math.floor(totalPrizePool * 0.05), color: "bg-purple-500", note: "₹" + Math.floor(totalPrizePool * 0.0125) + " each" }
  ];

  const bonusDistribution = [
    { category: "Kill Bonus", percentage: 5, amount: Math.floor(totalPrizePool * 0.05), color: "bg-red-500", icon: <Zap className="w-3 h-3 text-white" /> },
    { category: "Organizer", percentage: 3, amount: Math.floor(totalPrizePool * 0.03), color: "bg-gray-600", icon: <DollarSign className="w-3 h-3 text-white" /> },
    { category: "MVP", percentage: 3, amount: Math.floor(totalPrizePool * 0.03), color: "bg-green-500", icon: <Star className="w-3 h-3 text-white" /> },
    { category: "Top Killer", percentage: 2, amount: Math.floor(totalPrizePool * 0.02), color: "bg-blue-600", icon: <Target className="w-3 h-3 text-white" /> },
    { category: "Challenge", percentage: 2, amount: Math.floor(totalPrizePool * 0.02), color: "bg-teal-500", icon: <Award className="w-3 h-3 text-white" /> }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Prize Distribution
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tournament Overview - Compact */}
          <Card className="bg-blue-500 text-white">
            <CardContent className="p-3">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <div className="text-lg font-bold">₹{(totalPrizePool/1000).toFixed(0)}k</div>
                  <div className="opacity-80">Prize Pool</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{tournament.currentParticipants}/{tournament.maxParticipants}</div>
                  <div className="opacity-80">Players</div>
                </div>
                <div>
                  <div className="text-lg font-bold">₹{tournament.entryFee === "0" ? "FREE" : tournament.entryFee}</div>
                  <div className="opacity-80">Entry</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{prizeDistribution.length + bonusDistribution.length}</div>
                  <div className="opacity-80">Rewards</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Prize Distribution - Grid */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-700">🏆 Main Prizes (87%)</h3>
            <div className="grid grid-cols-5 gap-2">
              {prizeDistribution.map((prize, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className={`${prize.color} text-white p-2 rounded text-center mb-2`}>
                      <div className="text-xs font-bold">{prize.place}</div>
                      <div className="text-xs opacity-90">{prize.percentage}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">₹{(prize.amount/1000).toFixed(0)}k</div>
                      {prize.note && (
                        <div className="text-xs text-gray-500 mt-1">{prize.note.replace("₹", "₹").replace(/\d+/, (match) => `${parseInt(match)/1000}k`)}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bonus & Special Awards - Compact Grid */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-700">🎉 Bonus Rewards (13%)</h3>
            <div className="grid grid-cols-5 gap-2">
              {bonusDistribution.map((bonus, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-2 text-center">
                    <div className={`w-8 h-8 ${bonus.color} rounded-full flex items-center justify-center mx-auto mb-1`}>
                      {bonus.icon}
                    </div>
                    <div className="text-xs font-semibold mb-1">{bonus.category}</div>
                    <div className="text-sm font-bold text-green-600">₹{(bonus.amount/1000).toFixed(1)}k</div>
                    <div className="text-xs text-gray-400">{bonus.percentage}%</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Prize Pool Breakdown Bar - Compact */}
          <div>
            <h4 className="text-sm font-bold mb-2 text-gray-700">📊 Distribution</h4>
            <div className="bg-gray-100 rounded p-2">
              <div className="flex h-6 rounded overflow-hidden">
                <div className="bg-yellow-500 flex-[40] flex items-center justify-center text-xs font-bold text-white">40%</div>
                <div className="bg-gray-500 flex-[25] flex items-center justify-center text-xs font-bold text-white">25%</div>
                <div className="bg-orange-500 flex-[10] flex items-center justify-center text-xs font-bold text-white">10%</div>
                <div className="bg-blue-500 flex-[10] flex items-center justify-center text-xs font-bold text-white">10%</div>
                <div className="bg-green-500 flex-[15] flex items-center justify-center text-xs font-bold text-white">15%</div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>₹{(totalPrizePool * 0.40/1000).toFixed(0)}k</span>
                <span>₹{(totalPrizePool * 0.25/1000).toFixed(0)}k</span>
                <span>₹{(totalPrizePool * 0.10/1000).toFixed(0)}k</span>
                <span>₹{(totalPrizePool * 0.10/1000).toFixed(0)}k</span>
                <span>₹{(totalPrizePool * 0.15/1000).toFixed(0)}k</span>
              </div>
            </div>
          </div>

          {/* Rules - Compact */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <h4 className="text-sm font-bold text-blue-800 mb-2">⚖️ Rules:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Auto-scaling based on participation</li>
                <li>• Real-time prize calculations</li>
                <li>• Performance-based kill rewards</li>
                <li>• 24-hour payout guarantee</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}