
import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  Search,
  Filter,
  ArrowDownUp,
  Download,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusIcons = {
  draft: <Clock className="h-4 w-4 text-gray-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  paid: <CheckCircle className="h-4 w-4 text-green-500" />,
  escrow_held: <AlertTriangle className="h-4 w-4 text-purple-500" />,
  escrow_released: <CheckCircle className="h-4 w-4 text-green-500" />,
  canceled: <Trash2 className="h-4 w-4 text-red-500" />
};

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  escrow_held: "In Escrow",
  escrow_released: "Escrow Released",
  canceled: "Canceled"
};

const statusColors = {
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-600",
  paid: "bg-green-100 text-green-600",
  escrow_held: "bg-purple-100 text-purple-600",
  escrow_released: "bg-green-100 text-green-600",
  canceled: "bg-red-100 text-red-600"
};

const InvoicesPage = () => {
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { 
    invoices, 
    pendingInvoices, 
    paidInvoices, 
    draftInvoices,
    totalPendingAmount,
    totalPaidAmount,
    isLoading, 
    error, 
    deleteInvoice 
  } = useInvoices();
  
  const navigate = useNavigate();
  
  const handleCreateInvoice = () => {
    setIsInvoiceDialogOpen(true);
  };
  
  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
  };
  
  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice.mutateAsync(id);
    }
  };

  const getFilteredInvoices = () => {
    let filtered = [...invoices];
    
    // Filter by tab
    if (activeTab === "draft") {
      filtered = draftInvoices;
    } else if (activeTab === "pending") {
      filtered = pendingInvoices;
    } else if (activeTab === "paid") {
      filtered = paidInvoices;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.title.toLowerCase().includes(query) ||
        invoice.invoice_number.toLowerCase().includes(query) ||
        invoice.client?.name?.toLowerCase().includes(query) ||
        invoice.client?.email?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredInvoices = getFilteredInvoices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="ml-2 text-lg">Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-lg font-medium text-red-700">Error loading invoices</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage your invoices and payments</p>
        </div>
        
        <Button 
          onClick={handleCreateInvoice}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPendingAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaidAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full sm:max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          
          <Button variant="outline" className="gap-2">
            <ArrowDownUp className="h-4 w-4" />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </div>
        
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All <Badge className="ml-2 bg-gray-100 text-gray-600">{invoices.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft <Badge className="ml-2 bg-gray-100 text-gray-600">{draftInvoices.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge className="ml-2 bg-amber-100 text-amber-600">{pendingInvoices.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid <Badge className="ml-2 bg-green-100 text-green-600">{paidInvoices.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <FileText className="mx-auto h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No invoices found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Create your first invoice to get started"}
              </p>
              {!searchQuery && (
                <Button
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  onClick={handleCreateInvoice}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Invoice</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Client</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Amount</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr 
                        key={invoice.id} 
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewInvoice(invoice.id)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{invoice.invoice_number}</div>
                          <div className="text-sm text-gray-500">{invoice.title}</div>
                        </td>
                        <td className="py-3 px-4">
                          {invoice.client ? (
                            <div>
                              <div className="font-medium">{invoice.client.name || 'No name'}</div>
                              <div className="text-sm text-gray-500">{invoice.client.email || invoice.client.wallet_address?.substring(0, 8) + '...'}</div>
                            </div>
                          ) : (
                            <div className="text-gray-500">No client specified</div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {invoice.amount.toFixed(2)} {invoice.currency}
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[invoice.status || 'draft']}`}>
                            <span className="mr-1">{statusIcons[invoice.status || 'draft']}</span>
                            {statusLabels[invoice.status || 'draft']}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          <div>{invoice.created_at ? format(new Date(invoice.created_at), 'MMM d, yyyy') : '-'}</div>
                          <div className="text-xs">
                            {invoice.due_date && `Due: ${format(new Date(invoice.due_date), 'MMM d, yyyy')}`}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                ⋯
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewInvoice(invoice.id);
                              }}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteInvoice(invoice.id);
                              }} className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <InvoiceDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesPage;
