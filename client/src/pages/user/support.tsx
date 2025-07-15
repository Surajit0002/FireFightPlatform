import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserHeader from "@/components/layout/user-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  HelpCircle,
  Plus,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Upload,
  Search,
  ExternalLink,
  Bot,
  User,
} from "lucide-react";
import type { SupportTicket } from "@shared/schema";

export default function Support() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: tickets = [] } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createTicketMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/support/tickets", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setShowCreateTicket(false);
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createTicketMutation.mutate({
      ...data,
      category: selectedCategory,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-fire-blue';
      case 'in_progress': return 'bg-fire-orange';
      case 'resolved': return 'bg-fire-green';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <MessageCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const faqData = [
    {
      question: "How do I withdraw my winnings?",
      answer: "Go to your Wallet page and click 'Withdraw'. Make sure your KYC is completed and you have a valid UPI ID linked to your account. Minimum withdrawal amount is ₹50."
    },
    {
      question: "Why was my match result rejected?",
      answer: "Match results can be rejected if the screenshot is unclear, doesn't show the final result, or if there are discrepancies in the reported kills/rank. Please upload a clear screenshot showing your final position and kills."
    },
    {
      question: "How do I join a team tournament?",
      answer: "First create or join a team from the Teams page. Then when joining a tournament, select 'Team' option and choose your team from the dropdown. Make sure your team has the required number of members."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support UPI, Credit/Debit Cards, and Net Banking for deposits. For withdrawals, we only support UPI transfers to ensure fast and secure transactions."
    },
    {
      question: "How long does KYC verification take?",
      answer: "KYC verification typically takes 24-48 hours. Make sure to upload clear, readable documents. You'll receive a notification once your verification is complete."
    },
    {
      question: "Can I cancel a tournament registration?",
      answer: "You can cancel your registration up to 30 minutes before the tournament starts. The entry fee will be refunded to your wallet. After this time, cancellations are not allowed."
    },
  ];

  const categories = [
    { value: "match", label: "Match Issues" },
    { value: "wallet", label: "Wallet & Payments" },
    { value: "kyc", label: "KYC Verification" },
    { value: "general", label: "General Support" },
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold fire-gray mb-2">Support Center</h1>
            <p className="text-gray-600">
              Get help with your account, tournaments, and technical issues
            </p>
          </div>
          <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
            <DialogTrigger asChild>
              <Button className="bg-fire-red hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    {...register("subject", { required: "Subject is required" })}
                    placeholder="Brief description of your issue"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", { required: "Description is required" })}
                    placeholder="Detailed description of your issue..."
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label>Attachments (Optional)</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-fire-blue">Upload files</span> or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">Screenshots, documents up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateTicket(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-fire-red hover:bg-red-600 text-white flex-1"
                    disabled={createTicketMutation.isPending}
                  >
                    {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 fire-blue" />
                  <span>Quick Help</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <div className="font-medium">💰 Withdrawal Help</div>
                      <div className="text-sm text-gray-500">Issues with withdrawing winnings</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <div className="font-medium">🎮 Match Problems</div>
                      <div className="text-sm text-gray-500">Tournament or match related issues</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <div className="font-medium">📱 Account Issues</div>
                      <div className="text-sm text-gray-500">Login, profile, or KYC problems</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 text-left">
                    <div>
                      <div className="font-medium">👥 Team Help</div>
                      <div className="text-sm text-gray-500">Creating or managing teams</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5 fire-green" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* My Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>My Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {ticket.category}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            #{ticket.id}
                          </span>
                        </div>
                        
                        <h4 className="font-medium mb-1">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Support Tickets</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't created any support tickets yet.
                    </p>
                    <Button onClick={() => setShowCreateTicket(true)} className="bg-fire-red hover:bg-red-600 text-white">
                      Create Your First Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-fire-blue rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-gray-500">Available 24/7</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-fire-green rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-sm text-gray-500">+91 98765 43210</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-fire-orange rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-500">support@firefight.gg</div>
                  </div>
                </div>

                <Button className="w-full bg-fire-green hover:bg-green-600 text-white mt-4">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            {/* Help Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Help Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Game Rules & Guidelines
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  How to Upload Results
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Payment & Withdrawal Guide
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  KYC Verification Help
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Live Chat:</span>
                  <span className="font-semibold">< 5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Email/Ticket:</span>
                  <span className="font-semibold">< 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp:</span>
                  <span className="font-semibold">< 1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-semibold">9 AM - 9 PM</span>
                </div>
              </CardContent>
            </Card>

            {/* Status Page */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Platform:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                      <span className="fire-green">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payments:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                      <span className="fire-green">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tournaments:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-fire-green rounded-full"></div>
                      <span className="fire-green">Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
