
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar,
  CreditCard,
  ChevronDown,
  Filter,
  Download,
  Check
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const PaymentsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  
  const { 
    transactions, 
    totalPayments,
    totalWithdrawals,
    isLoading 
  } = useTransactions();
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by type
    if (activeFilter === "payments") {
      filtered = filtered.filter(tx => tx.transaction_type === "payment");
    } else if (activeFilter === "withdrawals") {
      filtered = filtered.filter(tx => tx.transaction_type === "withdrawal");
    } else if (activeFilter === "escrow") {
      filtered = filtered.filter(tx => tx.transaction_type === "escrow_release");
    }
    
    // Filter by date range
    if (dateRange.from) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.created_at || "");
        return txDate >= dateRange.from!;
      });
    }
    
    if (dateRange.to) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.created_at || "");
        return txDate <= dateRange.to!;
      });
    }
    
    return filtered;
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  const getTransactionIcon = (type: string) => {
    if (type === "payment") {
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    } else if (type === "withdrawal") {
      return <ArrowUpRight className="h-5 w-5 text-amber-500" />;
    } else if (type === "escrow_release") {
      return <Check className="h-5 w-5 text-purple-500" />;
    } else {
      return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getTransactionLabel = (type: string) => {
    if (type === "payment") {
      return "Payment Received";
    } else if (type === "withdrawal") {
      return "Withdrawal";
    } else if (type === "escrow_release") {
      return "Escrow Released";
    } else if (type === "fee") {
      return "Fee";
    } else {
      return "Unknown";
    }
  };
  
  // Calculate total for a specific period (you can expand this)
  const calculatePeriodTotal = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const recentPayments = transactions.filter(tx => {
      const txDate = new Date(tx.created_at || "");
      return tx.transaction_type === "payment" && txDate >= thirtyDaysAgo;
    });
    
    return recentPayments.reduce((sum, tx) => sum + tx.amount, 0);
  };
  
  const periodTotal = calculatePeriodTotal();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track your incoming and outgoing payments</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
            <p className="text-xs text-green-500 mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${periodTotal.toFixed(2)}</div>
            <p className="text-xs text-purple-500 mt-1">Recent activity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalWithdrawals.toFixed(2)}</div>
            <p className="text-xs text-amber-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => handleFilterChange("all")}
            className={activeFilter === "all" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}
          >
            All Transactions
          </Button>
          <Button
            variant={activeFilter === "payments" ? "default" : "outline"}
            onClick={() => handleFilterChange("payments")}
            className={activeFilter === "payments" ? "bg-gradient-to-r from-green-600 to-emerald-600" : ""}
          >
            Payments
          </Button>
          <Button
            variant={activeFilter === "withdrawals" ? "default" : "outline"}
            onClick={() => handleFilterChange("withdrawals")}
            className={activeFilter === "withdrawals" ? "bg-gradient-to-r from-amber-600 to-yellow-600" : ""}
          >
            Withdrawals
          </Button>
          <Button
            variant={activeFilter === "escrow" ? "default" : "outline"}
            onClick={() => handleFilterChange("escrow")}
            className={activeFilter === "escrow" ? "bg-gradient-to-r from-blue-600 to-cyan-600" : ""}
          >
            Escrow
          </Button>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>{dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL d")} - {format(dateRange.to, "LLL d, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL d, y")
                )
              ) : (
                "Date Range"
              )}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={(range) => {
                setDateRange({
                  from: range?.from,
                  to: range?.to,
                });
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10">
              <CreditCard className="mx-auto h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground mt-1">
                {activeFilter !== "all" ? "Try a different filter" : "Transactions will appear here once you have some activity"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Transaction</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {getTransactionIcon(tx.transaction_type)}
                          </div>
                          <div>
                            <div className="font-medium">{getTransactionLabel(tx.transaction_type)}</div>
                            <div className="text-sm text-gray-500">
                              {tx.tx_hash ? 
                                `${tx.tx_hash.substring(0, 6)}...${tx.tx_hash.substring(tx.tx_hash.length - 4)}` :
                                "No hash"
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {tx.created_at ? format(new Date(tx.created_at), 'MMM d, yyyy') : '-'}
                        <div className="text-xs text-gray-500">
                          {tx.created_at ? format(new Date(tx.created_at), 'h:mm a') : ''}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {tx.invoice ? (
                          <a href={`/invoices/${tx.invoice_id}`} className="text-purple-600 hover:underline">
                            {tx.invoice.invoice_number}
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-medium">
                        <span className={cn(
                          tx.transaction_type === 'payment' || tx.transaction_type === 'escrow_release'
                            ? 'text-green-600'
                            : 'text-amber-600'
                        )}>
                          {tx.transaction_type === 'payment' || tx.transaction_type === 'escrow_release' ? '+' : '-'}
                          {tx.amount} {tx.currency.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          className={cn(
                            "font-medium",
                            tx.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          )}
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
