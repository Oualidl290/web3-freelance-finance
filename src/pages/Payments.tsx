
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  ArrowDownLeft, 
  Filter, 
  Download,
  ChevronDown
} from "lucide-react";

// Mock data for demonstration
const paymentHistory = [
  { 
    id: "pmt-001", 
    amount: "540.00", 
    currency: "USDC", 
    date: "2025-05-02", 
    status: "completed",
    from: "Alpha Design Co",
    invoice: "INV-001"
  },
  { 
    id: "pmt-002", 
    amount: "1250.00", 
    currency: "USDC", 
    date: "2025-05-01", 
    status: "completed",
    from: "Beta Marketing",
    invoice: "INV-002"
  },
  { 
    id: "pmt-003", 
    amount: "890.00", 
    currency: "ETH", 
    date: "2025-04-28", 
    status: "pending",
    from: "Gamma Tech Inc",
    invoice: "INV-003"
  },
];

const Payments = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-apple-secondary">
      <NavBar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-apple-text">Payments</h1>
              <p className="text-gray-500 mt-1">
                View and manage all your received payments
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-full border border-apple-secondary hover:bg-apple-secondary"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              
              <Button 
                variant="outline" 
                className="rounded-full border border-apple-secondary hover:bg-apple-secondary"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="apple-card rounded-apple p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex gap-4 mb-4 md:mb-0 overflow-x-auto pb-2 md:pb-0">
                <Button 
                  variant={selectedFilter === "all" ? "default" : "outline"} 
                  onClick={() => setSelectedFilter("all")}
                  className={`rounded-full ${selectedFilter === "all" ? "bg-apple-accent1 text-white" : "border border-apple-secondary"}`}
                >
                  All Payments
                </Button>
                <Button 
                  variant={selectedFilter === "completed" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("completed")}
                  className={`rounded-full ${selectedFilter === "completed" ? "bg-apple-accent2 text-white" : "border border-apple-secondary"}`}
                >
                  Completed
                </Button>
                <Button 
                  variant={selectedFilter === "pending" ? "default" : "outline"}
                  onClick={() => setSelectedFilter("pending")}
                  className={`rounded-full ${selectedFilter === "pending" ? "bg-amber-500 text-white" : "border border-apple-secondary"}`}
                >
                  Pending
                </Button>
              </div>
              
              <Button variant="outline" className="rounded-full border border-apple-secondary hover:bg-apple-secondary">
                Last 30 days <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-apple-secondary">
                      <th className="text-left py-4 px-2 font-medium text-apple-text">Payment ID</th>
                      <th className="text-left py-4 px-2 font-medium text-apple-text">Date</th>
                      <th className="text-left py-4 px-2 font-medium text-apple-text">From</th>
                      <th className="text-left py-4 px-2 font-medium text-apple-text">Invoice</th>
                      <th className="text-left py-4 px-2 font-medium text-apple-text">Amount</th>
                      <th className="text-left py-4 px-2 font-medium text-apple-text">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory
                      .filter(payment => selectedFilter === "all" || payment.status === selectedFilter)
                      .map((payment) => (
                        <tr key={payment.id} className="border-b border-apple-secondary hover:bg-apple-secondary/20">
                          <td className="py-4 px-2">{payment.id}</td>
                          <td className="py-4 px-2">{payment.date}</td>
                          <td className="py-4 px-2">{payment.from}</td>
                          <td className="py-4 px-2">{payment.invoice}</td>
                          <td className="py-4 px-2 font-medium">{payment.amount} {payment.currency}</td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === 'completed' 
                                ? 'bg-apple-accent2/20 text-apple-accent2' 
                                : 'bg-amber-500/20 text-amber-600'
                            }`}>
                              {payment.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <ArrowDownLeft className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-apple-text mb-1">No payments found</h3>
                <p className="text-gray-500">
                  Payments will appear here once you receive them
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
                <CardDescription>All time earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium text-apple-text">$2,680.00</div>
                <p className="text-xs text-apple-accent2 mt-1">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-lg">Pending Payments</CardTitle>
                <CardDescription>Awaiting confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium text-apple-text">$890.00</div>
                <p className="text-xs text-amber-600 mt-1">
                  1 pending payment
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-lg">Average Payment</CardTitle>
                <CardDescription>Per transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-medium text-apple-text">$893.33</div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on 3 payments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payments;
