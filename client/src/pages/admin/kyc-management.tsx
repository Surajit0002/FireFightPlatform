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
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Search,
  AlertTriangle,
  CreditCard,
  User,
  Calendar,
  Shield,
  Flag,
} from "lucide-react";
import type { KycDocument, User as UserType } from "@shared/schema";

export default function AdminKycManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: kycDocuments = [] } = useQuery({
    queryKey: ["/api/admin/kyc-documents", statusFilter],
    enabled: false, // This would need to be implemented
  });

  const reviewKycMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: number; status: string; reason?: string }) => {
      await apiRequest("POST", `/api/admin/kyc/${id}/review`, { status, rejectionReason: reason });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "KYC document reviewed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc-documents"] });
      setShowReviewModal(false);
      setSelectedDocument(null);
      setRejectionReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mock KYC data for demonstration
  const mockKycDocuments = [
    {
      id: 1,
      userId: "user1",
      username: "ProGamer_X",
      email: "progamer@example.com",
      documentType: "aadhaar",
      documentNumber: "XXXX-XXXX-1234",
      documentUrl: "https://example.com/aadhaar1.jpg",
      status: "pending",
      submittedAt: new Date().toISOString(),
      profileImageUrl: ""
    },
    {
      id: 2,
      userId: "user1",
      username: "ProGamer_X",
      email: "progamer@example.com",
      documentType: "pan",
      documentNumber: "ABCDE1234F",
      documentUrl: "https://example.com/pan1.jpg",
      status: "pending",
      submittedAt: new Date().toISOString(),
      profileImageUrl: ""
    },
    {
      id: 3,
      userId: "user2",
      username: "ElitePlayer",
      email: "elite@example.com",
      documentType: "aadhaar",
      documentNumber: "XXXX-XXXX-5678",
      documentUrl: "https://example.com/aadhaar2.jpg",
      status: "approved",
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      verifiedAt: new Date().toISOString(),
      verifiedBy: "admin1",
      profileImageUrl: ""
    },
    {
      id: 4,
      userId: "user3",
      username: "ChampionGG",
      email: "champion@example.com",
      documentType: "pan",
      documentNumber: "FGHIJ5678K",
      documentUrl: "https://example.com/pan2.jpg",
      status: "rejected",
      submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      rejectionReason: "Document image is unclear. Please resubmit with a clearer image.",
      verifiedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      verifiedBy: "admin1",
      profileImageUrl: ""
    }
  ];

  const filteredDocuments = mockKycDocuments.filter((doc) => {
    const matchesSearch = doc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = documentTypeFilter === "all" || doc.documentType === documentTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-fire-orange';
      case 'approved': return 'bg-fire-green';
      case 'rejected': return 'bg-fire-red';
      default: return 'bg-gray-500';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'aadhaar': return <CreditCard className="w-4 h-4" />;
      case 'pan': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleKycAction = (action: 'approve' | 'reject') => {
    if (!selectedDocument) return;
    
    if (action === 'reject' && !rejectionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    reviewKycMutation.mutate({
      id: selectedDocument.id,
      status: action === 'approve' ? 'approved' : 'rejected',
      reason: action === 'reject' ? rejectionReason : undefined
    });
  };

  const KycReviewModal = () => (
    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review KYC Document</DialogTitle>
        </DialogHeader>
        
        {selectedDocument && (
          <div className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedDocument.profileImageUrl} />
                    <AvatarFallback>
                      {selectedDocument.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedDocument.username}</h3>
                    <p className="text-gray-500">{selectedDocument.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <div className="font-medium">{selectedDocument.userId}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <div className="font-medium">
                      {new Date(selectedDocument.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Document Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-gray-600">Document Type:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getDocumentTypeIcon(selectedDocument.documentType)}
                      <span className="font-medium capitalize">{selectedDocument.documentType}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Document Number:</span>
                    <div className="font-medium">{selectedDocument.documentNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className={`${getStatusColor(selectedDocument.status)} text-white mt-1`}>
                      {selectedDocument.status.toUpperCase()}
                    </Badge>
                  </div>
                  {selectedDocument.verifiedAt && (
                    <div>
                      <span className="text-gray-600">Verified:</span>
                      <div className="font-medium">
                        {new Date(selectedDocument.verifiedAt).toLocaleString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Document Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Document Preview</p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Previous Rejection Reason (if any) */}
            {selectedDocument.status === 'rejected' && selectedDocument.rejectionReason && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-red-600">Previous Rejection Reason</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{selectedDocument.rejectionReason}</p>
                </CardContent>
              </Card>
            )}

            {/* Review Notes */}
            {selectedDocument.status === 'pending' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a detailed reason for rejection..."
                  rows={4}
                />
              </div>
            )}

            {/* Actions */}
            {selectedDocument.status === 'pending' && (
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => handleKycAction('approve')}
                  className="bg-fire-green hover:bg-green-600 text-white flex-1"
                  disabled={reviewKycMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Document
                </Button>
                <Button
                  onClick={() => handleKycAction('reject')}
                  className="bg-fire-red hover:bg-red-600 text-white flex-1"
                  disabled={reviewKycMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Document
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
          <h1 className="text-3xl font-bold fire-gray mb-2">KYC Management</h1>
          <p className="text-gray-600">Review and verify user identity documents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold fire-gray">
                    {mockKycDocuments.filter(d => d.status === 'pending').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold fire-gray">
                    {mockKycDocuments.filter(d => d.status === 'approved').length}
                  </p>
                  <p className="text-sm fire-green">This month</p>
                </div>
                <div className="w-12 h-12 bg-fire-green rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold fire-gray">
                    {mockKycDocuments.filter(d => d.status === 'rejected').length}
                  </p>
                  <p className="text-sm fire-red">This month</p>
                </div>
                <div className="w-12 h-12 bg-fire-red rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold fire-gray">{mockKycDocuments.length}</p>
                  <p className="text-sm fire-blue">All time</p>
                </div>
                <div className="w-12 h-12 bg-fire-blue rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <Input
                  type="text"
                  placeholder="Search by user, email, or document number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="aadhaar">Aadhaar</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* KYC Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Documents ({filteredDocuments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={document.profileImageUrl} />
                          <AvatarFallback>
                            {document.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{document.username}</div>
                          <div className="text-sm text-gray-500">{document.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getDocumentTypeIcon(document.documentType)}
                        <span className="capitalize font-medium">{document.documentType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {document.documentNumber}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(document.status)} text-white`}>
                        {document.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(document.submittedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDocument(document);
                            setShowReviewModal(true);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                        
                        {document.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-fire-green hover:bg-green-600 text-white"
                              onClick={() => handleKycAction('approve')}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-fire-red hover:bg-red-600 text-white"
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowReviewModal(true);
                              }}
                            >
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </>
                        )}

                        {document.status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Flag className="w-3 h-3 mr-1" />
                            Reason
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Documents Found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'pending' || documentTypeFilter !== 'all'
                    ? "Try adjusting your search or filters."
                    : "No KYC documents to review at the moment."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <KycReviewModal />
      </main>
    </AdminLayout>
  );
}
