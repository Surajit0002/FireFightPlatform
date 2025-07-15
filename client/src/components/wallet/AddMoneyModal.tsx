import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Gift, DollarSign } from "lucide-react";

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMoneyModal({ isOpen, onClose }: AddMoneyModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [promoCode, setPromoCode] = useState("");

  const addMoneyMutation = useMutation({
    mutationFn: async (data: { amount: string; method: string; promoCode?: string }) => {
      return apiRequest("POST", "/api/wallet/deposit", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Money added successfully! Payment is being processed.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
      setAmount("");
      setPromoCode("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      description: "Pay using UPI ID or QR code",
      icon: Smartphone,
      popular: true,
    },
    {
      id: "card",
      name: "Debit/Credit Card",
      description: "Visa, Mastercard, RuPay",
      icon: CreditCard,
      popular: false,
    },
    {
      id: "netbanking",
      name: "Net Banking",
      description: "All major banks supported",
      icon: DollarSign,
      popular: false,
    },
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat) || amountFloat < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    if (amountFloat > 100000) {
      toast({
        title: "Amount Too High",
        description: "Maximum deposit amount is ₹1,00,000",
        variant: "destructive",
      });
      return;
    }

    addMoneyMutation.mutate({
      amount,
      method: selectedMethod,
      promoCode: promoCode || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Enter Amount</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="pl-8 text-lg"
                min="10"
                max="100000"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum: ₹10 • Maximum: ₹1,00,000</p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <Label>Quick Select</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-xs"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label>Payment Method</Label>
            <div className="space-y-2 mt-2">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? "border-fire-blue bg-fire-blue bg-opacity-10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-5 h-5 text-fire-blue" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{method.name}</span>
                          {method.popular && (
                            <Badge variant="outline" className="text-xs">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? "border-fire-blue bg-fire-blue"
                          : "border-gray-300"
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <Label htmlFor="promoCode">Promo Code (Optional)</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="promoCode"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
              />
              <Button type="button" variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </div>

          {/* Offer Card */}
          <Card className="bg-fire-green bg-opacity-10 border-fire-green">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-fire-green" />
                <div>
                  <p className="font-medium text-fire-green">First Deposit Bonus!</p>
                  <p className="text-sm text-gray-600">Get 10% extra on your first deposit above ₹500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Summary */}
          {amount && parseFloat(amount) > 0 && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span>₹{parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-fire-green">
                    <span>Bonus (if applicable)</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total to Pay</span>
                    <span>₹{parseFloat(amount).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={addMoneyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-fire-green text-white"
              disabled={!amount || parseFloat(amount) < 10 || addMoneyMutation.isPending}
            >
              {addMoneyMutation.isPending ? "Processing..." : "Proceed to Pay"}
            </Button>
          </div>
        </form>

        {/* Security Note */}
        <div className="text-xs text-gray-500 text-center">
          🔒 Your payment is secured with 256-bit SSL encryption
        </div>
      </DialogContent>
    </Dialog>
  );
}
