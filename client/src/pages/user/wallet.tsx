
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import WalletModal from "@/components/wallet-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Eye,
  Shield,
  Settings,
  Send,
  Repeat,
  DollarSign,
  Target,
  Award,
  Coins,
  RefreshCw,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function WalletPage() {
  const { user } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
    if (status === 'pending') return <Clock className="w-3 h-3 text-orange-500" />;
    if (status === 'failed') return <XCircle className="w-3 h-3 text-red-500" />;
    
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-3 h-3 text-green-500" />;
      case 'withdrawal': return <ArrowUpRight className="w-3 h-3 text-red-500" />;
      case 'prize': return <Star className="w-3 h-3 text-yellow-500" />;
      case 'entry_fee': return <ArrowUpRight className="w-3 h-3 text-blue-500" />;
      default: return <Wallet className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const num = parseFloat(amount);
    return type === 'deposit' || type === 'prize' ? `+₹${num.toFixed(2)}` : `-₹${num.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">💰 Wallet</h1>
          <p className="text-sm text-gray-600">
            Manage your balance and transactions
          </p>
        </div>

        {/* Main Balance Card */}
        <div className="mb-4">
          <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5" />
                    <span className="text-sm font-medium">Total Balance</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-1">
                    ₹{user?.walletBalance || "0.00"}
                  </div>
                  <div className="text-xs opacity-90">
                    Total Earnings: ₹{user?.totalEarnings || "0.00"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl sm:text-6xl opacity-20">💎</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button 
                  onClick={() => setShowDepositModal(true)}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Money
                </Button>
                <Button 
                  onClick={() => setShowWithdrawModal(true)}
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <Card className="bg-green-500 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">₹{totalDeposits.toFixed(0)}</div>
              <div className="text-xs opacity-90">Deposits</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">₹{totalWinnings.toFixed(0)}</div>
              <div className="text-xs opacity-90">Winnings</div>
            </CardContent>
          </Card>

          <Card className="bg-red-500 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">₹{totalWithdrawals.toFixed(0)}</div>
              <div className="text-xs opacity-90">Withdrawn</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500 text-white border-0">
            <CardContent className="p-3 text-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold">{pendingWithdrawals.length}</div>
              <div className="text-xs opacity-90">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          <Button 
            onClick={() => setShowDepositModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 h-auto flex-col gap-2"
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs">UPI Deposit</span>
          </Button>
          
          <Button 
            onClick={() => setShowWithdrawModal(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 h-auto flex-col gap-2"
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-xs">UPI Withdraw</span>
          </Button>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white p-4 h-auto flex-col gap-2">
            <Download className="w-5 h-5" />
            <span className="text-xs">Statement</span>
          </Button>

          <Button className="bg-pink-500 hover:bg-pink-600 text-white p-4 h-auto flex-col gap-2">
            <Users className="w-5 h-5" />
            <span className="text-xs">Refer & Earn</span>
          </Button>

          <Button className="bg-teal-500 hover:bg-teal-600 text-white p-4 h-auto flex-col gap-2">
            <Gift className="w-5 h-5" />
            <span className="text-xs">Bonus</span>
          </Button>

          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 h-auto flex-col gap-2">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Wallet Features */}
          <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Instant Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Instant Deposits</div>
                  <div className="text-xs opacity-90">UPI in seconds</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">24/7 Withdrawals</div>
                  <div className="text-xs opacity-90">Anytime access</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">100% Secure</div>
                  <div className="text-xs opacity-90">Bank-level security</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bonuses & Rewards */}
          <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Bonuses & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium text-sm">Refer Friends</span>
                </div>
                <div className="text-xs opacity-90 mb-2">
                  Earn ₹50 for each friend!
                </div>
                <Button size="sm" className="bg-white text-orange-500 hover:bg-gray-100 w-full">
                  Share Code
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Referral Earnings:</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Balance:</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Limits */}
          <Card className="bg-gradient-to-br from-blue-400 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Daily Limit:</span>
                  <span className="font-semibold">₹50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Min Withdrawal:</span>
                  <span className="font-semibold">₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>KYC Status:</span>
                  <Badge className={`${user?.kycStatus === 'approved' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                    {user?.kycStatus || 'Pending'}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: user?.kycStatus === 'approved' ? '100%' : '50%' }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gray-800 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Transactions
              </span>
              <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.slice(0, 8).map((transaction, index) => (
                  <div key={transaction.id} className={`flex items-center justify-between p-4 border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type, transaction.status)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {transaction.description || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-sm ${
                        transaction.type === 'deposit' || transaction.type === 'prize' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatAmount(transaction.amount, transaction.type)}
                      </div>
                      <Badge 
                        className={`text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No transactions yet</p>
                  <p className="text-gray-400 text-sm">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Withdrawals Alert */}
        {pendingWithdrawals.length > 0 && (
          <Card className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Pending Withdrawals</div>
                  <div className="text-sm opacity-90">
                    You have {pendingWithdrawals.length} withdrawal(s) being processed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
