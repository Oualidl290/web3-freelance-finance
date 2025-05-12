
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useInvoices } from "@/hooks/useInvoices";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  Loader2,
  FileText,
  UserIcon,
  Calendar,
  CreditCard,
  ClipboardCheck,
  LockIcon,
  Badge
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BlockchainOperations from "@/components/BlockchainOperations";
import { Invoice } from "@/types/invoice";

const InvoiceStatus = ({ status }: { status: Invoice["status"] }) => {
  switch (status) {
    case "draft":
      return <UIBadge variant="outline" className="bg-gray-100 text-gray-800">Draft</UIBadge>;
    case "pending":
      return <UIBadge variant="outline" className="bg-amber-100 text-amber-800">Pending</UIBadge>;
    case "paid":
      return <UIBadge variant="outline" className="bg-green-100 text-green-800">Paid</UIBadge>;
    case "escrow_held":
      return <UIBadge variant="outline" className="bg-blue-100 text-blue-800">In Escrow</UIBadge>;
    case "escrow_released":
      return <UIBadge variant="outline" className="bg-green-100 text-green-800">Escrow Released</UIBadge>;
    case "canceled":
      return <UIBadge variant="outline" className="bg-red-100 text-red-800">Canceled</UIBadge>;
    default:
      return <UIBadge variant="outline">{status}</UIBadge>;
  }
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { getInvoiceById } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) {
        setError("Invoice ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await getInvoiceById(id);
        setInvoice(data);
      } catch (err) {
        setError("Failed to load invoice details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, getInvoiceById]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Invoice Not Found</h3>
            <p className="text-gray-600 mb-6">{error || "The requested invoice could not be loaded"}</p>
            <Link to="/dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isClient = user?.id !== invoice.client?.id;
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main invoice details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="flex flex-row justify-between items-start border-b pb-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-purple-600" />
                    {invoice.title}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    Invoice #{invoice.invoice_number}
                  </CardDescription>
                </div>
                <InvoiceStatus status={invoice.status} />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500">Client</h3>
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">
                        {invoice.client?.name || invoice.client?.email || invoice.client?.wallet_address?.substring(0, 6) + '...' || 'No client'}
                      </span>
                    </div>
                    {invoice.client?.email && (
                      <p className="text-sm text-gray-500 pl-7">{invoice.client.email}</p>
                    )}
                    {invoice.client?.wallet_address && (
                      <p className="text-sm text-gray-500 pl-7 font-mono">
                        {invoice.client.wallet_address.substring(0, 6)}...{invoice.client.wallet_address.substring(invoice.client.wallet_address.length - 4)}
                      </p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        {format(parseISO(invoice.created_at), 'MMMM d, yyyy')}
                      </div>
                    </div>
                    
                    {invoice.due_date && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          {format(parseISO(invoice.due_date), 'MMMM d, yyyy')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="my-6" />

                {/* Description */}
                {invoice.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{invoice.description}</p>
                  </div>
                )}

                {/* Payment Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Payment Summary</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatAmount(invoice.amount)} {invoice.currency}</span>
                    </div>
                    
                    {invoice.crypto_amount !== null && (
                      <div className="flex justify-between py-2 border-t border-gray-200">
                        <span className="text-gray-600">Crypto Amount</span>
                        <span>{formatAmount(invoice.crypto_amount)} {invoice.crypto_currency?.toUpperCase()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-3 border-t border-gray-200 font-bold">
                      <span>Total Due</span>
                      <span>{formatAmount(invoice.amount)} {invoice.currency}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {invoice.updated_at && (
                    <span>Last updated: {format(parseISO(invoice.updated_at), 'MMM d, yyyy')}</span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div>
                  {invoice.status === "draft" && (
                    <Button variant="outline" className="ml-2">
                      <ClipboardCheck className="h-4 w-4 mr-1" /> Send Invoice
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Payment sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                  Payment
                </CardTitle>
                <CardDescription>
                  {invoice.escrow_enabled ? 'Escrow payment enabled' : 'Direct payment'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoice.escrow_enabled && (
                  <div className="mb-4 flex items-center bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-200">
                    <LockIcon className="h-5 w-5 mr-2 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium">Escrow Protection</p>
                      <p>Funds will be held for {invoice.escrow_days || 14} days after payment</p>
                    </div>
                  </div>
                )}

                {/* Blockchain Operations */}
                <BlockchainOperations invoice={invoice} isClient={isClient} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InvoiceDetail;
