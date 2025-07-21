import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import AddMoneyModal from "@/components/wallet/AddMoneyModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Gift,
  CreditCard,
  Smartphone,
} from "lucide-react";
import type { Transaction } from "@/types";

export default function Wallet() {
  const { user } = useAuth();
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/wallet/transactions"],
  });

  const walletBalance = parseFloat(user?.walletBalance || "0");

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    if (!matchesType) return false;

    if (timeFilter === "all") return true;

    const transactionDate = new Date(transaction.createdAt);
    const now = new Date();

    switch (timeFilter) {
      case "today":
        return transactionDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return transactionDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return transactionDate >= monthAgo;
      default:
        return true;
    }
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="w-4 h-4 text-fire-green" />;
      case "withdrawal":
        return <Minus className="w-4 h-4 text-fire-red" />;
      case "tournament_fee":
        return <DollarSign className="w-4 h-4 text-fire-blue" />;
      case "prize_payout":
        return <TrendingUp className="w-4 h-4 text-fire-green" />;
      case "bonus":
      case "referral":
        return <Gift className="w-4 h-4 text-fire-teal" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-fire-green text-white">Completed</Badge>;
      case "pending":
        return <Badge className="bg-orange-500 text-white">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTransactionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const calculateStats = () => {
    const deposits = transactions
      .filter((t) => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const withdrawals = transactions
      .filter((t) => t.type === "withdrawal" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const winnings = transactions
      .filter((t) => t.type === "prize_payout" && t.status === "completed")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const pending = transactions
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return { deposits, withdrawals, winnings, pending };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fire-gray mb-2">Wallet</h1>
          <p className="text-gray-600">
            Manage your funds and track transactions
          </p>
        </div>

        {/* Wallet Overview */}
        <Card className="mb-8 bg-gradient-to-r from-fire-blue to-fire-teal text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-sm font-medium opacity-90 mb-2">
                  Current Balance
                </h2>
                <div className="text-4xl font-bold mb-4">
                  ₹{walletBalance.toLocaleString()}
                </div>
                <div className="flex space-x-4 text-sm opacity-90">
                  <div>
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Total Winnings: ₹{stats.winnings.toLocaleString()}
                  </div>
                  <div>
                    <TrendingDown className="w-4 h-4 inline mr-1" />
                    Total Withdrawn: ₹{stats.withdrawals.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-4 md:mt-0">
                <Button
                  onClick={() => setIsAddMoneyOpen(true)}
                  className="bg-white text-fire-blue hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button
                  onClick={() => setIsWithdrawOpen(true)}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-fire-blue"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4  gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Deposits
                      </p>
                      <p className="text-2xl font-bold text-fire-green">
                        ₹{stats.deposits.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Winnings
                      </p>
                      <p className="text-2xl font-bold text-fire-blue">
                        ₹{stats.winnings.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-orange-500">
                        ₹{stats.pending.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex space-x-4">
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="deposit">Deposits</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                        <SelectItem value="tournament_fee">
                          Tournament Fees
                        </SelectItem>
                        <SelectItem value="prize_payout">
                          Prize Payouts
                        </SelectItem>
                        <SelectItem value="bonus">Bonuses</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No transactions found
                      </h3>
                      <p className="text-gray-500">
                        Your transaction history will appear here
                      </p>
                    </div>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-fire-gray">
                                {formatTransactionType(transaction.type)}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {transaction.description ||
                                  `Transaction ${transaction.id}`}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(
                                  transaction.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${
                                [
                                  "deposit",
                                  "prize_payout",
                                  "bonus",
                                  "referral",
                                ].includes(transaction.type)
                                  ? "text-fire-green"
                                  : "text-fire-red"
                              }`}
                            >
                              {[
                                "deposit",
                                "prize_payout",
                                "bonus",
                                "referral",
                              ].includes(transaction.type)
                                ? "+"
                                : "-"}
                              ₹{parseFloat(transaction.amount).toLocaleString()}
                            </div>
                            <div className="mt-1">
                              {getStatusBadge(transaction.status)}
                            </div>
                            {transaction.referenceId && (
                              <p className="text-xs text-gray-400 mt-1">
                                Ref: {transaction.referenceId}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setIsAddMoneyOpen(true)}
                  className="w-full bg-fire-green text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button
                  onClick={() => setIsWithdrawOpen(true)}
                  variant="outline"
                  className="w-full"
                  disabled={walletBalance <= 0}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
                <Button variant="outline" className="w-full">
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Bonus
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-withdraw</span>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">UPI ID</span>
                  <Button variant="outline" size="sm">
                    {user?.upiId ? "Update" : "Add"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">KYC Status</span>
                  <Badge
                    variant={
                      user?.kycStatus === "approved" ? "default" : "outline"
                    }
                  >
                    {user?.kycStatus || "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Linked Services */}
            <Card>
              <CardHeader>
                <CardTitle>Linked Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Recharge Mobile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="w-4 h-4 mr-2" />
                  Gift Cards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Transfer to Friend
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Tips */}
            <Card className="bg-fire-blue bg-opacity-10 border-fire-blue">
              <CardHeader>
                <CardTitle className="text-fire-blue">💡 Wallet Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Complete KYC verification for faster withdrawals</p>
                <p>• Minimum withdrawal amount is ₹100</p>
                <p>• Refer friends to earn bonus cash</p>
                <p>• Tournament winnings are auto-credited</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
      />
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </div>
  );
}
