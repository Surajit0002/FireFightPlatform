
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Reply,
  Archive,
  Star,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  message: string;
  isAdmin: boolean;
  authorName: string;
  createdAt: string;
}

export default function AdminSupportTickets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for development
  const mockTickets: SupportTicket[] = [
    {
      id: "1",
      subject: "Unable to join tournament",
      description: "I'm getting an error when trying to join the Free Fire tournament. The page keeps loading.",
      category: "tournament",
      priority: "high",
      status: "open",
      userId: "user1",
      userName: "ProGamer_X",
      userEmail: "progamer@example.com",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      responses: []
    },
    {
      id: "2",
      subject: "Withdrawal not processed",
      description: "I requested a withdrawal 3 days ago but haven't received my money yet. Transaction ID: TXN123456",
      category: "wallet",
      priority: "urgent",
      status: "in_progress",
      userId: "user2",
      userName: "ElitePlayer",
      userEmail: "elite@example.com",
      createdAt: "2024-01-14T14:20:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
      responses: [
        {
          id: "resp1",
          message: "We're looking into your withdrawal request. Our finance team is reviewing the transaction.",
          isAdmin: true,
          authorName: "Support Team",
          createdAt: "2024-01-15T09:15:00Z"
        }
      ]
    },
    {
      id: "3",
      subject: "KYC document rejected",
      description: "My KYC documents were rejected but I don't understand why. Can you please help?",
      category: "kyc",
      priority: "medium",
      status: "resolved",
      userId: "user3",
      userName: "GameMaster",
      userEmail: "gamemaster@example.com",
      createdAt: "2024-01-13T16:45:00Z",
      updatedAt: "2024-01-14T11:30:00Z",
      responses: [
        {
          id: "resp2",
          message: "Your Aadhaar card image was blurry. Please upload a clear image.",
          isAdmin: true,
          authorName: "KYC Team",
          createdAt: "2024-01-14T10:00:00Z"
        },
        {
          id: "resp3",
          message: "Thank you! I've uploaded a new image.",
          isAdmin: false,
          authorName: "GameMaster",
          createdAt: "2024-01-14T10:30:00Z"
        },
        {
          id: "resp4",
          message: "Perfect! Your KYC has been approved.",
          isAdmin: true,
          authorName: "KYC Team",
          createdAt: "2024-01-14T11:30:00Z"
        }
      ]
    }
  ];

  const { data: tickets } = useQuery({
    queryKey: ["/api/admin/support-tickets"],
    queryFn: async () => mockTickets,
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updates }: { ticketId: string; updates: Partial<SupportTicket> }) => {
      return apiRequest(`/api/admin/support-tickets/${ticketId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      toast({ title: "Ticket updated successfully" });
    },
  });

  const addResponseMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      return apiRequest(`/api/admin/support-tickets/${ticketId}/responses`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      setResponseMessage("");
      toast({ title: "Response sent successfully" });
    },
  });

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  }) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4" />;
      case "in_progress": return <AlertTriangle className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      case "closed": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicketMutation.mutate({
      ticketId,
      updates: { status: newStatus as any }
    });
  };

  const handleAddResponse = () => {
    if (!selectedTicket || !responseMessage.trim()) return;
    
    addResponseMutation.mutate({
      ticketId: selectedTicket.id,
      message: responseMessage
    });
  };

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter(t => t.status === "open").length || 0,
    inProgress: tickets?.filter(t => t.status === "in_progress").length || 0,
    resolved: tickets?.filter(t => t.status === "resolved").length || 0,
  };

  return (
    <AdminLayout>
      <main className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Tickets</h1>
          <p className="text-gray-600">Manage and respond to user support requests</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="kyc">KYC</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell onClick={() => handleTicketClick(ticket)}>
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleTicketClick(ticket)}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {ticket.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{ticket.userName}</p>
                          <p className="text-xs text-gray-500">{ticket.userEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleTicketClick(ticket)}>
                      <Badge variant="outline" className="capitalize">
                        {ticket.category}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleTicketClick(ticket)}>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleTicketClick(ticket)}>
                      <Badge className={getStatusColor(ticket.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(ticket.status)}
                          <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleTicketClick(ticket)}>
                      <div className="text-sm">
                        <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-500">{new Date(ticket.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTicketClick(ticket)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) => handleStatusChange(ticket.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tickets Found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                    ? "Try adjusting your search or filters."
                    : "No support tickets have been created yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ticket Detail Modal */}
        <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedTicket && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Ticket #{selectedTicket.id}</span>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Ticket Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">User Information</p>
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarFallback>
                            {selectedTicket.userName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedTicket.userName}</p>
                          <p className="text-sm text-gray-500">{selectedTicket.userEmail}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Ticket Details</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Category:</span> {selectedTicket.category}</p>
                        <p><span className="font-medium">Created:</span> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                        <p><span className="font-medium">Updated:</span> {new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subject and Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedTicket.subject}</h3>
                    <p className="text-gray-700">{selectedTicket.description}</p>
                  </div>

                  {/* Conversation */}
                  <div>
                    <h4 className="text-md font-semibold mb-4">Conversation ({selectedTicket.responses.length})</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {selectedTicket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-3 rounded-lg ${
                            response.isAdmin
                              ? "bg-blue-50 border-l-4 border-blue-500 ml-8"
                              : "bg-gray-50 border-l-4 border-gray-300 mr-8"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">
                              {response.isAdmin ? "🛡️ " : "👤 "}
                              {response.authorName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(response.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Form */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold mb-3">Add Response</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your response..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        rows={4}
                      />
                      <div className="flex items-center justify-between">
                        <Select
                          value={selectedTicket.status}
                          onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleAddResponse}
                          disabled={!responseMessage.trim() || addResponseMutation.isPending}
                        >
                          <Reply className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </AdminLayout>
  );
}
