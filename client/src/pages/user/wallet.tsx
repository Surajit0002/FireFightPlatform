import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import WalletModal from "@/components/wallet-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  Wallet,
  Plus,
  Minus,
  TrendingUp,
  Download,
  CreditCard,
  Smartphone,
  Gift,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Zap,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function WalletPage() {
  const { user } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/wallet/transactions"],
  });

  // Calculate wallet stats
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const totalWinnings = transactions
    .filter(t => t.type === 'prize' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    if (status === 'failed') return <XCircle className="w-4 h-4 text-red-500" />;
    
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-fire-green" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-fire-red" />;
      case 'prize': return <Star className="w-4 h-4 text-fire-orange" />;
      case 'entry_fee': return <ArrowUpRight className="w-4 h-4 text-fire-blue" />;
      default: return <Wallet className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': case 'prize': return 'text-fire-green';
      case 'withdrawal': case 'entry_fee': return 'text-fire-red';
      default: return 'text-gray-600';
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const num = parseFloat(amount);
    return type === 'deposit' || type === 'prize' ? `+₹${num.toFixed(2)}` : `-₹${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Wallet</h1>
          <p className="text-gray-600">
            Manage your balance, deposits, withdrawals and transaction history
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Balance Card */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-r from-fire-blue to-blue-600 text-white mb-6">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet className="w-6 h-6" />
                      <span className="text-lg">Wallet Balance</span>
                    </div>
                    <div className="text-4xl font-bold mb-2">
                      ₹{user?.walletBalance || "0.00"}
                    </div>
                    <div className="text-sm opacity-90">
                      Total Earnings: ₹{user?.totalEarnings || "0.00"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl opacity-20">💰</div>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <Button 
                    onClick={() => setShowDepositModal(true)}
                    className="bg-white text-fire-blue hover:bg-gray-100 flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </Button>
                  <Button 
                    onClick={() => setShowWithdrawModal(true)}
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-fire-blue flex-1"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ArrowDownLeft className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg font-bold fire-gray">₹{totalDeposits.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Total Deposits</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-fire-orange rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg font-bold fire-gray">₹{totalWinnings.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Prize Winnings</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-fire-red rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-lg font-bold fire-gray">₹{totalWithdrawals.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Total Withdrawals</div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionIcon(transaction.type, transaction.status)}
                          <div>
                            <div className="font-medium">
                              {transaction.description || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                            {formatAmount(transaction.amount, transaction.type)}
                          </div>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 
                                   transaction.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  )}
                </div>
                
                {transactions.length > 10 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Transactions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Withdrawals */}
            {pendingWithdrawals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Pending Withdrawals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingWithdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">₹{withdrawal.amount}</span>
                          <Clock className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                          Requested {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setShowDepositModal(true)}
                  className="w-full bg-fire-green hover:bg-green-600 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Money via UPI
                </Button>
                
                <Button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="w-full bg-fire-blue hover:bg-blue-600 text-white"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Withdraw to UPI
                </Button>

                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Features */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-fire-green rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Instant Deposits</div>
                      <div className="text-sm text-gray-500">Add money instantly via UPI</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-fire-blue rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">24/7 Withdrawals</div>
                      <div className="text-sm text-gray-500">Withdraw anytime, anywhere</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-fire-orange rounded-full flex items-center justify-center">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Bonus Rewards</div>
                      <div className="text-sm text-gray-500">Earn bonus on deposits</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bonus & Referrals */}
            <Card>
              <CardHeader>
                <CardTitle>Bonuses & Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-fire-orange to-orange-600 text-white p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Refer Friends</span>
                    </div>
                    <div className="text-sm opacity-90 mb-2">
                      Earn ₹50 for each friend you refer!
                    </div>
                    <Button size="sm" className="bg-white text-fire-orange hover:bg-gray-100">
                      Share Code
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Referral Earnings:</span>
                      <span className="font-semibold">₹0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus Balance:</span>
                      <span className="font-semibold">₹0.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Withdrawal Limit:</span>
                    <span className="font-semibold">₹50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Withdrawal:</span>
                    <span className="font-semibold">₹50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KYC Status:</span>
                    <Badge variant={user?.kycStatus === 'approved' ? 'default' : 'secondary'}>
                      {user?.kycStatus || 'Pending'}
                    </Badge>
                  </div>
                  <Progress value={user?.kycStatus === 'approved' ? 100 : 50} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <WalletModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          type="deposit"
        />
        
        <WalletModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          type="withdraw"
        />
      </main>
    </div>
  );
}
