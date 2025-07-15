import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState(user?.upiId || "");

  const walletBalance = parseFloat(user?.walletBalance || "0");
  const minimumWithdrawal = 100;
  const withdrawalFee = 0; // No fee for now
  const processingTime = "2-24 hours";

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: string; upiId: string }) => {
      return apiRequest("POST", "/api/wallet/withdraw", data);
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and will be processed soon.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
      setAmount("");
    },
    onError: (error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const canWithdraw = () => {
    if (user?.kycStatus !== "approved") return false;
    if (walletBalance < minimumWithdrawal) return false;
    return true;
  };

  const getWithdrawError = () => {
    if (user?.kycStatus !== "approved") {
      return "KYC verification required for withdrawals";
    }
    if (walletBalance < minimumWithdrawal) {
      return `Minimum withdrawal amount is ₹${minimumWithdrawal}`;
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat < minimumWithdrawal) {
      toast({
        title: "Invalid Amount",
        description: `Minimum withdrawal amount is ₹${minimumWithdrawal}`,
        variant: "destructive",
      });
      return;
    }

    if (amountFloat > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!upiId) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({
      amount,
      upiId,
    });
  };

  const getNetAmount = () => {
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat)) return 0;
    return amountFloat - withdrawalFee;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Money</DialogTitle>
        </DialogHeader>

        {/* Wallet Balance Display */}
        <Card className="bg-fire-blue bg-opacity-10 border-fire-blue">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-fire-blue font-medium">Available Balance</p>
              <p className="text-2xl font-bold text-fire-blue">₹{walletBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {!canWithdraw() && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{getWithdrawError()}</AlertDescription>
          </Alert>
        )}

        {canWithdraw() && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div>
              <Label htmlFor="withdrawAmount">Withdrawal Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <Input
                  id="withdrawAmount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="pl-8 text-lg"
                  min={minimumWithdrawal}
                  max={walletBalance}
                  required
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimum: ₹{minimumWithdrawal}</span>
                <span>Maximum: ₹{walletBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <Label>Quick Select</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[500, 1000, 2000, walletBalance].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(Math.min(quickAmount, walletBalance).toString())}
                    className="text-xs"
                    disabled={quickAmount > walletBalance}
                  >
                    {quickAmount === walletBalance ? "All" : `₹${quickAmount}`}
                  </Button>
                ))}
              </div>
            </div>

            {/* UPI ID Input */}
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <div className="relative mt-1">
                <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <Input
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI ID (e.g., 9876543210@paytm, username@upi)
              </p>
            </div>

            {/* Withdrawal Summary */}
            {amount && parseFloat(amount) >= minimumWithdrawal && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Withdrawal Amount</span>
                      <span>₹{parseFloat(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span className="text-fire-green">₹{withdrawalFee} (Free)</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>You'll Receive</span>
                      <span className="text-fire-green">₹{getNetAmount().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing Time</span>
                      <span>{processingTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* KYC Status */}
            <Card className="bg-fire-green bg-opacity-10 border-fire-green">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-fire-green" />
                  <div>
                    <p className="font-medium text-fire-green">KYC Verified</p>
                    <p className="text-sm text-gray-600">Your account is verified for withdrawals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Important Notes:</p>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Withdrawals are processed within {processingTime}</li>
                    <li>• Minimum withdrawal amount is ₹{minimumWithdrawal}</li>
                    <li>• Ensure your UPI ID is correct and active</li>
                    <li>• You'll receive a confirmation SMS once processed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={withdrawMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-fire-red text-white"
                disabled={
                  !amount || 
                  parseFloat(amount) < minimumWithdrawal || 
                  parseFloat(amount) > walletBalance ||
                  !upiId ||
                  withdrawMutation.isPending
                }
              >
                {withdrawMutation.isPending ? "Processing..." : "Withdraw Money"}
              </Button>
            </div>
          </form>
        )}

        {/* Security Note */}
        <div className="text-xs text-gray-500 text-center">
          🔒 Your withdrawal is secured and will be processed safely
        </div>
      </DialogContent>
    </Dialog>
  );
}
