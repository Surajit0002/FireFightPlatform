import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
  FileText,
  Shield,
  CreditCard,
  Trophy,
  Upload
} from "lucide-react";
import type { SupportTicket } from "@/types";

export default function Support() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    description: "",
    category: "general",
  });

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: typeof ticketForm) => {
      return apiRequest("POST", "/api/support/tickets", data);
    },
    onSuccess: () => {
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setIsCreateTicketOpen(false);
      setTicketForm({ subject: "", description: "", category: "general" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-fire-blue" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-fire-green" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-orange-500 text-white">Open</Badge>;
      case "in_progress":
        return <Badge className="bg-fire-blue text-white">In Progress</Badge>;
      case "resolved":
        return <Badge className="bg-fire-green text-white">Resolved</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-500 text-white">High</Badge>;
      case "medium":
        return <Badge className="bg-fire-blue text-white">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const categories = [
    { value: "general", label: "General Inquiry", icon: HelpCircle },
    { value: "tournament", label: "Tournament Issues", icon: Trophy },
    { value: "wallet", label: "Wallet & Payments", icon: CreditCard },
    { value: "technical", label: "Technical Issues", icon: Shield },
    { value: "account", label: "Account Issues", icon: FileText },
  ];

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "How do I join a tournament?",
          answer: "To join a tournament, browse the tournaments page, select a tournament you want to participate in, and click 'Join Tournament'. Make sure you have sufficient wallet balance if there's an entry fee."
        },
        {
          question: "What games are supported on FireFight?",
          answer: "We currently support Free Fire, BGMI (Battlegrounds Mobile India), Valorant, and other popular esports titles. More games are added regularly based on community demand."
        },
        {
          question: "How do I create a team?",
          answer: "Go to the Teams page and click 'Create Team'. Fill in your team details, invite members using their usernames or share your team code for others to join."
        }
      ]
    },
    {
      category: "Payments",
      questions: [
        {
          question: "How do I add money to my wallet?",
          answer: "Click on your wallet balance in the header, then select 'Add Money'. You can use UPI, debit/credit cards, or net banking. Minimum deposit is ₹10."
        },
        {
          question: "How long do withdrawals take?",
          answer: "Withdrawals are processed within 2-24 hours for KYC verified accounts. You'll receive a confirmation SMS once the money is transferred to your UPI ID."
        },
        {
          question: "What is the minimum withdrawal amount?",
          answer: "The minimum withdrawal amount is ₹100. Make sure your UPI ID is correct and active before requesting a withdrawal."
        }
      ]
    },
    {
      category: "Tournaments",
      questions: [
        {
          question: "How are tournament results verified?",
          answer: "Players upload screenshots of their match results, which are then reviewed by our moderation team. Results are typically verified within 1-2 hours of submission."
        },
        {
          question: "What happens if I miss a tournament?",
          answer: "If you miss a tournament you've joined, you'll forfeit your entry fee. Make sure to check tournament timings and join the room when it's shared."
        },
        {
          question: "Can I get a refund if a tournament is cancelled?",
          answer: "Yes, if a tournament is cancelled by the organizers, all entry fees are automatically refunded to participants' wallets within 24 hours."
        }
      ]
    }
  ];

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicket = () => {
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and description.",
        variant: "destructive",
      });
      return;
    }

    createTicketMutation.mutate(ticketForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fire-gray mb-2">Support Center</h1>
          <p className="text-gray-600">Get help with your account, tournaments, and technical issues</p>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover cursor-pointer border-fire-blue border-opacity-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-fire-gray mb-2">Live Chat</h3>
              <p className="text-sm text-gray-500 mb-4">Chat with our support team</p>
              <Button className="bg-fire-blue text-white">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer border-fire-green border-opacity-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-fire-gray mb-2">WhatsApp Support</h3>
              <p className="text-sm text-gray-500 mb-4">Get help via WhatsApp</p>
              <Button className="bg-fire-green text-white">Contact Now</Button>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer border-fire-teal border-opacity-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-fire-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-fire-gray mb-2">Email Support</h3>
              <p className="text-sm text-gray-500 mb-4">Send us an email</p>
              <Button className="bg-fire-teal text-white">Send Email</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tickets" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              {/* Tickets Tab */}
              <TabsContent value="tickets">
                <Card>
                  <CardHeader className="border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                      <CardTitle>Support Tickets</CardTitle>
                      <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-fire-red text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Create Support Ticket</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select 
                                value={ticketForm.category} 
                                onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                      <div className="flex items-center space-x-2">
                                        <category.icon className="w-4 h-4" />
                                        <span>{category.label}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                value={ticketForm.subject}
                                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                placeholder="Brief description of your issue"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={ticketForm.description}
                                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                                placeholder="Provide detailed information about your issue"
                                rows={4}
                                className="mt-1"
                              />
                            </div>

                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                onClick={() => setIsCreateTicketOpen(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCreateTicket}
                                disabled={createTicketMutation.isPending}
                                className="flex-1 bg-fire-red text-white"
                              >
                                {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {/* Search */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <Input
                          placeholder="Search tickets..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Tickets List */}
                    <div className="divide-y divide-gray-200">
                      {filteredTickets.length === 0 ? (
                        <div className="p-12 text-center">
                          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No tickets found</h3>
                          <p className="text-gray-500 mb-4">
                            {tickets.length === 0 
                              ? "You haven't created any support tickets yet"
                              : "No tickets match your search"}
                          </p>
                          <Button
                            onClick={() => setIsCreateTicketOpen(true)}
                            className="bg-fire-red text-white"
                          >
                            Create Your First Ticket
                          </Button>
                        </div>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <div key={ticket.id} className="p-6 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(ticket.status)}
                                <div>
                                  <h3 className="font-semibold text-fire-gray">{ticket.subject}</h3>
                                  <p className="text-sm text-gray-500">
                                    Ticket #{ticket.id} • {ticket.category}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getPriorityBadge(ticket.priority)}
                                {getStatusBadge(ticket.status)}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                              <span>Last updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {faqs.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h3 className="text-lg font-semibold text-fire-gray mb-4">{category.category}</h3>
                          <Accordion type="single" collapsible className="space-y-2">
                            {category.questions.map((faq, faqIndex) => (
                              <AccordionItem 
                                key={faqIndex} 
                                value={`${categoryIndex}-${faqIndex}`}
                                className="border border-gray-200 rounded-lg px-4"
                              >
                                <AccordionTrigger className="text-left hover:no-underline">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Status */}
            <Card>
              <CardHeader>
                <CardTitle>Support Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Open Tickets</span>
                    <span className="font-semibold text-orange-500">
                      {tickets.filter(t => t.status === "open").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">In Progress</span>
                    <span className="font-semibold text-fire-blue">
                      {tickets.filter(t => t.status === "in_progress").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Resolved</span>
                    <span className="font-semibold text-fire-green">
                      {tickets.filter(t => t.status === "resolved").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Response</span>
                    <span className="font-semibold">2-4 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-fire-blue" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500">support@firefight.gg</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-fire-green" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-gray-500">+91 99999 99999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-fire-teal" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-gray-500">24/7 Support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Report Tournament Issue
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Problem
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Account Security
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Help Tips */}
            <Card className="bg-fire-blue bg-opacity-10 border-fire-blue">
              <CardHeader>
                <CardTitle className="text-fire-blue">💡 Help Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Include screenshots when reporting issues</p>
                <p>• Provide your username and tournament details</p>
                <p>• Check FAQ before creating tickets</p>
                <p>• Use live chat for urgent issues</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
