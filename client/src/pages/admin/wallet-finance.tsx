import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Download,
  CreditCard,
  Smartphone,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function AdminWalletFinance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: withdrawals = [] } = useQuery({
    queryKey: ["/api/admin/withdrawals"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
    enabled: false, // This would need to be implemented
  });

  const processWithdrawalMutation = useMutation({
    mutationFn: async ({ id, action, notes }: { id: number; action: 'approve' | 'reject'; notes?: string }) => {
      await apiRequest("POST", `/api/admin/withdrawals/${id}/${action}`, { notes });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Withdrawal processed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/withdrawals"] });
      setShowReviewModal(false);
      setSelectedTransaction(null);
      setAdminNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mock data for demonstration
  const mockTransactions = [
    {
      id: 1,
      userId: "user1",
      username: "ProGamer_X",
      amount: "5000.00",
      type: "withdrawal",
      status: "pending",
      description: "Withdrawal request",
      upiId: "progamer@paytm",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      userId: "user2",
      username: "ElitePlayer",
      amount: "2500.00",
      type: "withdrawal",
      status: "pending",
      description: "Prize withdrawal",
      upiId: "elite@phonepe",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      userId: "user3",
      username: "ChampionGG",
      amount: "1000.00",
      type: "deposit",
      status: "completed",
      description: "Wallet top-up",
      createdAt: new Date().toISOString()
    }
  ];

  const mockStats = {
    totalRevenue: 125000,
    totalPayouts: 89000,
    pendingWithdrawals: 15000,
    processingFees: 2500
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-fire-orange';
      case 'completed': return 'bg-fire-green';
      case 'failed': return 'bg-fire-red';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <TrendingDown className="w-4 h-4 text-fire-green" />;
      case 'withdrawal': return <TrendingUp className="w-4 h-4 text-fire-red" />;
      case 'prize': return <DollarSign className="w-4 h-4 text-fire-orange" />;
      default: return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleProcessWithdrawal = (action: 'approve' | 'reject') => {
    if (!selectedTransaction) return;
    
    if (action === 'reject' && !adminNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    processWithdrawalMutation.mutate({
      id: selectedTransaction.id,
      action,
      notes: adminNotes
    });
  };

  const TransactionReviewModal = () => (
    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Transaction</DialogTitle>
        </DialogHeader>
        
        {selectedTransaction && (
          <div className="space-y-6">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">User:</span>
                    <div className="font-medium">{selectedTransaction.username}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <div className="font-medium">₹{selectedTransaction.amount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium capitalize">{selectedTransaction.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${getStatusColor(selectedTransaction.status)} text-white`}>
                      {selectedTransaction.status.toUpperCase()}
                    </Badge>
                  </div>
                  {selectedTransaction.upiId && (
                    <div className="col-span-2">
                      <span className="text-gray-600">UPI ID:</span>
                      <div className="font-medium">{selectedTransaction.upiId}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this transaction..."
                rows={3}
              />
            </div>

            {/* Actions */}
            {selectedTransaction.status === 'pending' && selectedTransaction.type === 'withdrawal' && (
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => handleProcessWithdrawal('approve')}
                  className="bg-fire-green hover:bg-green-600 text-white flex-1"
                  disabled={processWithdrawalMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Withdrawal
                </Button>
                <Button
                  onClick={() => handleProcessWithdrawal('reject')}
                  className="bg-fire-red hover:bg-red-600 text-white flex-1"
                  disabled={processWithdrawalMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Withdrawal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold fire-gray mb-2">Wallet & Finance</h1>
          <p className="text-gray-600">Manage transactions, withdrawals, and financial operations</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold fire-gray">₹{mockStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm fire-green">+15% this month</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                  <p className="text-3xl font-bold fire-gray">₹{mockStats.totalPayouts.toLocaleString()}</p>
                  <p className="text-sm fire-blue">+8% this month</p>
                </div>
                <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Withdrawals</p>
                  <p className="text-3xl font-bold fire-gray">₹{mockStats.pendingWithdrawals.toLocaleString()}</p>
                  <p className="text-sm text-orange-500">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-fire-orange rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing Fees</p>
                  <p className="text-3xl font-bold fire-gray">₹{mockStats.processingFees.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
                <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="withdrawals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="withdrawals">Withdrawal Requests</TabsTrigger>
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Financial Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pending Withdrawals</CardTitle>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UPI ID</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions
                      .filter(t => t.type === 'withdrawal' && t.status === 'pending')
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.username}</div>
                              <div className="text-sm text-gray-500">ID: {transaction.userId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">₹{transaction.amount}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{transaction.upiId}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                              {transaction.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setShowReviewModal(true);
                                }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Review
                              </Button>
                              <Button
                                size="sm"
                                className="bg-fire-green hover:bg-green-600 text-white"
                                onClick={() => handleProcessWithdrawal('approve')}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-fire-red hover:bg-red-600 text-white"
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setShowReviewModal(true);
                                }}
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {mockTransactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Withdrawals</h3>
                    <p className="text-gray-500">All withdrawal requests have been processed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <Input
                      type="text"
                      placeholder="Search by user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="prize">Prize Payouts</SelectItem>
                      <SelectItem value="entry_fee">Entry Fees</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.username}</div>
                            <div className="text-sm text-gray-500">ID: {transaction.userId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            transaction.type === 'deposit' || transaction.type === 'prize' 
                              ? 'fire-green' : 'fire-red'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'prize' ? '+' : '-'}₹{transaction.amount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                            {transaction.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setShowReviewModal(true);
                            }}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                      <p>Revenue chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <DollarSign className="w-12 h-12 mx-auto mb-2" />
                      <p>Transaction volume chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <TransactionReviewModal />
      </main>
    </AdminLayout>
  );
}
