
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowUpRight, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useInvoices } from "@/hooks/useInvoices";
import { useTransactions } from "@/hooks/useTransactions";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";

const DashboardOverview = () => {
  const { invoices, pendingInvoices, paidInvoices, totalPendingAmount, totalPaidAmount, isLoading: invoicesLoading } = useInvoices();
  const { recentTransactions, isLoading: transactionsLoading } = useTransactions();
  
  // Format currency with 2 decimal places
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get currency symbol for transactions
  const getCurrencySymbol = (currency: string) => {
    return currency.toUpperCase() === 'USDC' ? 'USDC' : 'ETH';
  };
  
  // Calculate overdue invoices
  const overdueInvoices = pendingInvoices.filter(invoice => 
    invoice.due_date && new Date(invoice.due_date) < new Date()
  );
  
  // Calculate average payment time (days) for paid invoices
  const calculateAvgPaymentTime = () => {
    const invoicesWithPayment = paidInvoices.filter(inv => 
      inv.payment_date && inv.created_at
    );
    
    if (invoicesWithPayment.length === 0) return 0;
    
    const totalDays = invoicesWithPayment.reduce((sum, inv) => {
      const created = new Date(inv.created_at);
      const paid = new Date(inv.payment_date!);
      const diffTime = Math.abs(paid.getTime() - created.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return (totalDays / invoicesWithPayment.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your invoices.
          </p>
        </div>
        <Link to="/create-invoice">
          <Button className="bg-gradient-to-r from-apple-accent1 to-apple-accent1/80 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(totalPaidAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {paidInvoices.length} paid invoice{paidInvoices.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(totalPendingAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingInvoices.length} invoice{pendingInvoices.length !== 1 ? 's' : ''} awaiting payment
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{paidInvoices.length}</div>
                <p className="text-xs text-green-500 font-medium">
                  Avg. payment time: {calculateAvgPaymentTime()} days
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {invoicesLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{overdueInvoices.length}</div>
                <p className={`text-xs ${overdueInvoices.length > 0 ? 'text-red-500' : 'text-green-500'} font-medium`}>
                  {overdueInvoices.length > 0 ? (
                    `${formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))} overdue`
                  ) : (
                    'No overdue invoices'
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Invoices</CardTitle>
              <CardDescription>
                Manage your pending and recently paid invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {invoicesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-apple-accent1" />
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      Awaiting Payment
                    </h4>
                    {pendingInvoices.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                          <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium">Invoice</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Client</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Due Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium"></th>
                              </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                              {pendingInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">{invoice.invoice_number}</td>
                                  <td className="p-4 align-middle">
                                    {invoice.client?.name || invoice.client?.email || invoice.client?.wallet_address?.substring(0, 8) + '...' || 'No client'}
                                  </td>
                                  <td className="p-4 align-middle">{formatCurrency(invoice.amount)} {invoice.crypto_currency?.toUpperCase()}</td>
                                  <td className="p-4 align-middle">
                                    {invoice.due_date ? format(new Date(invoice.due_date), 'MMM d, yyyy') : 'No due date'}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Link to={`/invoices/${invoice.id}`}>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="sr-only">Open</span>
                                      </Button>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4 border rounded-md">
                        No pending invoices found.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Recently Paid
                    </h4>
                    {paidInvoices.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                          <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium">Invoice</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Client</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Paid Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium"></th>
                              </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                              {paidInvoices.slice(0, 5).map((invoice) => (
                                <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">{invoice.invoice_number}</td>
                                  <td className="p-4 align-middle">
                                    {invoice.client?.name || invoice.client?.email || invoice.client?.wallet_address?.substring(0, 8) + '...' || 'No client'}
                                  </td>
                                  <td className="p-4 align-middle">{formatCurrency(invoice.amount)} {invoice.crypto_currency?.toUpperCase()}</td>
                                  <td className="p-4 align-middle">
                                    {invoice.payment_date ? format(new Date(invoice.payment_date), 'MMM d, yyyy') : 'Unknown'}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Link to={`/invoices/${invoice.id}`}>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="sr-only">Open</span>
                                      </Button>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4 border rounded-md">
                        No paid invoices found.
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-apple-accent1" />
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-8">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex">
                      <div className="mr-4 flex items-start">
                        <div className={`rounded-full p-1 ${
                          transaction.transaction_type === 'payment' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {transaction.transaction_type === 'payment' 
                            ? <CheckCircle className="h-4 w-4" /> 
                            : <Clock className="h-4 w-4" />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.transaction_type === 'payment' 
                            ? `Payment received for invoice ${transaction.invoice?.invoice_number || 'Unknown'}` 
                            : transaction.transaction_type === 'withdrawal'
                              ? 'Funds withdrawn'
                              : transaction.transaction_type === 'escrow_release'
                                ? `Escrow released for invoice ${transaction.invoice?.invoice_number || 'Unknown'}`
                                : 'Fee paid'
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })} • {transaction.amount} {getCurrencySymbol(transaction.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No recent activity found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track your business performance with detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Analytics will be available soon!</p>
              <Button variant="outline" className="mt-4">Explore Pro Features</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;
