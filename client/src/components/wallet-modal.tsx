import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Smartphone } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw";
}

export default function WalletModal({ isOpen, onClose, type }: WalletModalProps) {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { amount: string }) => {
      const endpoint = type === "deposit" ? "/api/wallet/deposit" : "/api/wallet/withdraw";
      await apiRequest("POST", endpoint, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${type === "deposit" ? "Deposit" : "Withdrawal request"} processed successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      onClose();
      setAmount("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (type === "deposit" && amountNum < 10) {
      toast({
        title: "Minimum Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    if (type === "withdraw" && amountNum < 50) {
      toast({
        title: "Minimum Amount",
        description: "Minimum withdrawal amount is ₹50",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({ amount });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === "deposit" ? (
              <>
                <CreditCard className="w-5 h-5 fire-green" />
                <span>Add Money</span>
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 fire-blue" />
                <span>Withdraw Money</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">
              Amount {type === "deposit" ? "(Min ₹10)" : "(Min ₹50)"}
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="Enter amount"
                min={type === "deposit" ? "10" : "50"}
                step="1"
                required
              />
            </div>
          </div>

          {type === "deposit" && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">Payment Methods:</p>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded">
                  <span>💳</span>
                  <span>UPI</span>
                </div>
                <div className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded">
                  <span>💰</span>
                  <span>Cards</span>
                </div>
                <div className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded">
                  <span>🏦</span>
                  <span>Net Banking</span>
                </div>
              </div>
            </div>
          )}

          {type === "withdraw" && (
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-700 mb-1">
                Withdrawal will be processed to your registered UPI ID within 24 hours.
              </p>
              <p className="text-xs text-orange-600">
                Processing fee: ₹5 (for amounts below ₹500)
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                type === "deposit"
                  ? "bg-fire-green hover:bg-green-600"
                  : "bg-fire-blue hover:bg-blue-600"
              } text-white`}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Processing..."
                : type === "deposit"
                ? "Add Money"
                : "Withdraw"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
