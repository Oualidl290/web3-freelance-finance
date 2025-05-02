
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowUpRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const pendingInvoices = [
  { id: "INV-001", client: "Alpha Design Co", amount: "540.00", currency: "USDC", dueDate: "2025-05-10" },
  { id: "INV-002", client: "Beta Marketing", amount: "1250.00", currency: "USDC", dueDate: "2025-05-15" },
];

const paidInvoices = [
  { id: "INV-003", client: "Gamma Tech Inc", amount: "890.00", currency: "USDC", paidDate: "2025-04-28" },
  { id: "INV-004", client: "Delta Agency", amount: "1750.00", currency: "ETH", paidDate: "2025-04-22" },
];

const recentActivity = [
  { type: "invoice_paid", id: "INV-004", client: "Delta Agency", date: "2025-04-22", amount: "1750.00" },
  { type: "invoice_sent", id: "INV-002", client: "Beta Marketing", date: "2025-04-15", amount: "1250.00" },
  { type: "invoice_created", id: "INV-001", client: "Alpha Design Co", date: "2025-04-10", amount: "540.00" },
];

const DashboardOverview = () => {
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
          <Button className="bg-gradient-to-r from-web3-purple to-web3-blue text-white">
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
            <div className="text-2xl font-bold">$4,430.00</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,790.00</div>
            <p className="text-xs text-muted-foreground">
              2 invoices awaiting payment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,640.00</div>
            <p className="text-xs text-muted-foreground">
              3 invoices paid this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-green-500 font-medium">
              No overdue invoices
            </p>
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
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-amber-500" />
                  Awaiting Payment
                </h4>
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
                            <td className="p-4 align-middle">{invoice.id}</td>
                            <td className="p-4 align-middle">{invoice.client}</td>
                            <td className="p-4 align-middle">{invoice.amount} {invoice.currency}</td>
                            <td className="p-4 align-middle">{invoice.dueDate}</td>
                            <td className="p-4 align-middle">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">Open</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Recently Paid
                </h4>
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
                        {paidInvoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{invoice.id}</td>
                            <td className="p-4 align-middle">{invoice.client}</td>
                            <td className="p-4 align-middle">{invoice.amount} {invoice.currency}</td>
                            <td className="p-4 align-middle">{invoice.paidDate}</td>
                            <td className="p-4 align-middle">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">Open</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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
              <div className="space-y-8">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex items-start">
                      <div className={`rounded-full p-1 ${
                        activity.type === 'invoice_paid' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.type === 'invoice_paid' 
                          ? <CheckCircle className="h-4 w-4" /> 
                          : <Clock className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.type === 'invoice_paid' 
                          ? `Invoice ${activity.id} paid by ${activity.client}` 
                          : activity.type === 'invoice_sent' 
                            ? `Invoice ${activity.id} sent to ${activity.client}`
                            : `Invoice ${activity.id} created for ${activity.client}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.date} • {activity.amount} USDC
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View your payment statistics and trends.
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
