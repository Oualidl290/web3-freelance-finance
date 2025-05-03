
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useInvoices, Invoice } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { ArrowLeft, Download, Copy, Calendar, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateInvoiceStatus, releaseEscrow } = useInvoices();
  const [isReleasing, setIsReleasing] = useState(false);
  
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      if (!id) throw new Error("Invoice ID is required");
      
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          client:client_id (
            id, name, email, wallet_address, client_type
          )
        `)
        .eq("id", id)
        .single();
        
      if (error) throw error;
      return data as Invoice;
    },
    enabled: !!user && !!id,
  });
  
  const { data: invoiceViews = [] } = useQuery({
    queryKey: ["invoice-views", id],
    queryFn: async () => {
      if (!user || !id) return [];
      
      const { data, error } = await supabase
        .from("invoice_views")
        .select("*")
        .eq("invoice_id", id)
        .order("viewed_at", { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id && !!invoice,
  });

  const handleCopyLink = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(`${window.location.origin}/public-invoice/${id}`);
    toast({
      title: "Link Copied",
      description: "Invoice link copied to clipboard",
    });
  };
  
  const handleReleaseEscrow = async () => {
    if (!id) return;
    
    setIsReleasing(true);
    try {
      await releaseEscrow.mutateAsync(id);
    } catch (error) {
      console.error("Error releasing escrow:", error);
    } finally {
      setIsReleasing(false);
    }
  };
  
  const getStatusBadgeColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "escrow_held":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "escrow_released":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  const formatStatusLabel = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "escrow_held":
        return "In Escrow";
      case "escrow_released":
        return "Escrow Released";
      case "pending":
        return "Pending";
      case "draft":
        return "Draft";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-apple-secondary">
        <NavBar />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-apple-accent1" />
            <p className="mt-4 text-lg">Loading invoice details...</p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }
  
  if (error || !invoice) {
    return (
      <div className="min-h-screen flex flex-col bg-apple-secondary">
        <NavBar />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500" />
            <h1 className="text-xl font-medium mt-4">Invoice Not Found</h1>
            <p className="mt-2 text-gray-600">
              The invoice you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-apple-secondary">
      <NavBar />
      
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center text-muted-foreground"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-medium tracking-tight text-apple-text">{invoice.invoice_number}</h1>
                <Badge className={`${getStatusBadgeColor(invoice.status)}`}>
                  {formatStatusLabel(invoice.status)}
                </Badge>
              </div>
              <p className="text-gray-500 mt-1">
                {invoice.title || "Untitled Invoice"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="rounded-full flex items-center gap-2"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button 
                className="bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full"
              >
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-apple">
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invoice Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-xl font-medium">${invoice.amount.toFixed(2)} USD</p>
                      <p className="text-sm text-muted-foreground">
                        ({invoice.crypto_amount || invoice.amount} {invoice.crypto_currency?.toUpperCase() || "USDC"})
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2">
                        {invoice.status === "pending" && <Clock className="text-amber-500 h-4 w-4" />}
                        {invoice.status === "paid" && <CheckCircle className="text-green-500 h-4 w-4" />}
                        {invoice.status === "escrow_held" && <Clock className="text-blue-500 h-4 w-4" />}
                        {invoice.status === "escrow_released" && <CheckCircle className="text-green-500 h-4 w-4" />}
                        <p className="text-xl font-medium">{formatStatusLabel(invoice.status)}</p>
                      </div>
                      {invoice.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Due {format(new Date(invoice.due_date), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="text-xl font-medium truncate">
                        {invoice.client?.name || "Unnamed Client"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {invoice.client?.client_type === "email" 
                          ? invoice.client.email 
                          : invoice.client?.wallet_address?.substring(0, 8) + "..." + invoice.client?.wallet_address?.substring(invoice.client.wallet_address.length - 6)
                        }
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Invoice Description */}
                  <div>
                    <h3 className="font-medium mb-3">Description</h3>
                    <p className="text-gray-600">{invoice.description || "No description provided"}</p>
                  </div>
                  
                  {/* Invoice Timeline */}
                  <div>
                    <h3 className="font-medium mb-3">Timeline</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mt-1 mr-4 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-green-600"></div>
                        </div>
                        <div>
                          <p className="font-medium">Invoice Created</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(invoice.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      
                      {invoice.status !== "draft" && (
                        <div className="flex items-start">
                          <div className={`mt-1 mr-4 h-4 w-4 rounded-full ${invoice.status === "pending" ? "bg-amber-100" : "bg-green-100"} flex items-center justify-center`}>
                            <div className={`h-2 w-2 rounded-full ${invoice.status === "pending" ? "bg-amber-600" : "bg-green-600"}`}></div>
                          </div>
                          <div>
                            <p className="font-medium">Invoice Sent</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(invoice.updated_at || invoice.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {(invoice.status === "paid" || invoice.status === "escrow_held" || invoice.status === "escrow_released") && (
                        <div className="flex items-start">
                          <div className={`mt-1 mr-4 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center`}>
                            <div className={`h-2 w-2 rounded-full bg-green-600`}></div>
                          </div>
                          <div>
                            <p className="font-medium">Payment Received</p>
                            <p className="text-sm text-gray-500">
                              {invoice.payment_date ? format(new Date(invoice.payment_date), "MMM d, yyyy 'at' h:mm a") : "Date not recorded"}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {invoice.status === "escrow_released" && (
                        <div className="flex items-start">
                          <div className="mt-1 mr-4 h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-green-600"></div>
                          </div>
                          <div>
                            <p className="font-medium">Escrow Released</p>
                            <p className="text-sm text-gray-500">
                              {invoice.escrow_release_date ? format(new Date(invoice.escrow_release_date), "MMM d, yyyy 'at' h:mm a") : "Date not recorded"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="activity">
                <TabsList className="bg-apple-secondary rounded-full p-1">
                  <TabsTrigger value="activity" className="rounded-full">Activity</TabsTrigger>
                  <TabsTrigger value="details" className="rounded-full">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity" className="pt-4">
                  <Card className="rounded-apple">
                    <CardHeader>
                      <CardTitle>Activity Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {invoiceViews.length > 0 ? (
                        <div className="space-y-4">
                          {invoiceViews.map((view) => (
                            <div key={view.id} className="flex items-start">
                              <div className="mt-1 mr-4 flex-shrink-0">
                                <div className="bg-blue-100 p-1 rounded-full">
                                  <Calendar className="h-3 w-3 text-blue-600" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm">
                                  Invoice viewed {view.location && `from ${view.location}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(view.viewed_at), "MMM d, yyyy 'at' h:mm a")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">No activity recorded yet</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="details" className="pt-4">
                  <Card className="rounded-apple">
                    <CardHeader>
                      <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Invoice Number</p>
                          <p className="font-medium">{invoice.invoice_number}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Created Date</p>
                          <p className="font-medium">
                            {format(new Date(invoice.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                        
                        {invoice.due_date && (
                          <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="font-medium">
                              {format(new Date(invoice.due_date), "MMM d, yyyy")}
                            </p>
                          </div>
                        )}
                        
                        {invoice.escrow_enabled && (
                          <div>
                            <p className="text-sm text-muted-foreground">Escrow Period</p>
                            <p className="font-medium">
                              {invoice.escrow_days || 7} days
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {invoice.escrow_enabled && invoice.status === "escrow_held" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                          <div className="flex items-center mb-2">
                            <Clock className="h-5 w-5 text-blue-600 mr-2" />
                            <p className="font-medium">Funds in Escrow</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            This payment is currently held in escrow. You can release the funds now or wait for the escrow period to end.
                          </p>
                          <Button 
                            onClick={handleReleaseEscrow}
                            disabled={isReleasing}
                            className="bg-apple-accent2 hover:bg-apple-accent2/90 text-white rounded-full"
                          >
                            {isReleasing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Releasing...
                              </>
                            ) : (
                              <>Release Funds</>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-apple">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full rounded-full bg-apple-accent1 hover:bg-apple-accent1/90"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={handleCopyLink}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy Payment Link
                  </Button>
                  
                  {invoice.status === "draft" && (
                    <Button
                      variant="outline"
                      className="w-full rounded-full bg-apple-accent2 hover:bg-apple-accent2/90 text-white border-0"
                      onClick={() => updateInvoiceStatus.mutate({ id: invoice.id, status: "pending" })}
                    >
                      Send Invoice
                    </Button>
                  )}
                  
                  {invoice.status === "escrow_held" && (
                    <Button
                      className="w-full rounded-full bg-apple-accent2 hover:bg-apple-accent2/90 text-white"
                      onClick={handleReleaseEscrow}
                      disabled={isReleasing}
                    >
                      {isReleasing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Releasing...
                        </>
                      ) : (
                        <>Release Escrow</>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              <Card className="rounded-apple">
                <CardHeader>
                  <CardTitle>Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{invoice.client?.name || "Unnamed Client"}</p>
                    </div>
                    
                    {invoice.client?.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{invoice.client.email}</p>
                      </div>
                    )}
                    
                    {invoice.client?.wallet_address && (
                      <div>
                        <p className="text-sm text-muted-foreground">Wallet</p>
                        <p className="font-medium text-sm break-all">{invoice.client.wallet_address}</p>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline"
                      className="w-full rounded-full mt-2"
                    >
                      View Client History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InvoiceDetail;
