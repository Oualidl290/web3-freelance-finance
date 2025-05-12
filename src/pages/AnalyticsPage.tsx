
import { useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { useTransactions } from "@/hooks/useTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, Download, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const COLORS = ["#7c3aed", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 3),
    to: new Date()
  });
  const [timeframeFilter, setTimeframeFilter] = useState("3months");
  
  const { invoices, totalPendingAmount, totalPaidAmount, isLoading: invoicesLoading } = useInvoices();
  const { transactions, totalPayments, isLoading: transactionsLoading } = useTransactions();
  
  const isLoading = invoicesLoading || transactionsLoading;
  
  // Prepare data for charts
  const prepareRevenueData = () => {
    if (invoices.length === 0) return [];
    
    // Get date range
    const start = dateRange.from || subMonths(new Date(), 3);
    const end = dateRange.to || new Date();
    
    // Create a map for each month in range
    const monthlyData: Record<string, { name: string; paid: number; pending: number; total: number }> = {};
    
    // Initialize each month with zero values
    const months = eachDayOfInterval({
      start: startOfMonth(start),
      end: endOfMonth(end),
    }).filter(date => date.getDate() === 1); // Get first day of each month
    
    months.forEach(date => {
      const monthName = format(date, 'MMM yyyy');
      monthlyData[monthName] = {
        name: monthName,
        paid: 0,
        pending: 0,
        total: 0,
      };
    });
    
    // Fill with actual data
    invoices.forEach(invoice => {
      if (!invoice.created_at) return;
      
      const invoiceDate = new Date(invoice.created_at);
      if (invoiceDate >= start && invoiceDate <= end) {
        const monthName = format(invoiceDate, 'MMM yyyy');
        if (!monthlyData[monthName]) {
          monthlyData[monthName] = {
            name: monthName,
            paid: 0,
            pending: 0,
            total: 0,
          };
        }
        
        monthlyData[monthName].total += invoice.amount;
        
        if (invoice.status === 'paid' || invoice.status === 'escrow_released') {
          monthlyData[monthName].paid += invoice.amount;
        } else if (invoice.status === 'pending' || invoice.status === 'escrow_held') {
          monthlyData[monthName].pending += invoice.amount;
        }
      }
    });
    
    return Object.values(monthlyData);
  };
  
  const prepareStatusData = () => {
    if (invoices.length === 0) return [];
    
    const statusCounts: Record<string, { name: string; value: number }> = {
      draft: { name: 'Draft', value: 0 },
      pending: { name: 'Pending', value: 0 },
      paid: { name: 'Paid', value: 0 },
      escrow_held: { name: 'In Escrow', value: 0 },
      escrow_released: { name: 'Escrow Released', value: 0 },
      canceled: { name: 'Canceled', value: 0 },
    };
    
    invoices.forEach(invoice => {
      const status = invoice.status || 'draft';
      if (statusCounts[status]) {
        statusCounts[status].value++;
      }
    });
    
    return Object.values(statusCounts).filter(item => item.value > 0);
  };
  
  const prepareDailyTransactionsData = () => {
    if (transactions.length === 0) return [];
    
    // Get date range - use last 30 days if no range is selected
    const end = dateRange.to || new Date();
    const start = dateRange.from || subMonths(end, 1);
    
    // Group transactions by date
    const dailyData: Record<string, { date: string; amount: number; count: number }> = {};
    
    // Initialize each day with zero values
    const days = eachDayOfInterval({ start, end });
    
    days.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      dailyData[dateStr] = {
        date: format(date, 'MMM dd'),
        amount: 0,
        count: 0,
      };
    });
    
    // Fill with actual data
    transactions.forEach(tx => {
      if (!tx.created_at) return;
      
      const txDate = new Date(tx.created_at);
      if (txDate >= start && txDate <= end) {
        const dateStr = format(txDate, 'yyyy-MM-dd');
        if (dailyData[dateStr]) {
          dailyData[dateStr].amount += tx.amount;
          dailyData[dateStr].count += 1;
        }
      }
    });
    
    return Object.values(dailyData);
  };
  
  // Data arrays
  const revenueData = prepareRevenueData();
  const statusData = prepareStatusData();
  const dailyTransactionsData = prepareDailyTransactionsData();
  
  // Helper for timeframe selection
  const handleTimeframeChange = (value: string) => {
    setTimeframeFilter(value);
    
    const now = new Date();
    let from: Date;
    
    if (value === "30days") {
      from = subMonths(now, 1);
    } else if (value === "3months") {
      from = subMonths(now, 3);
    } else if (value === "6months") {
      from = subMonths(now, 6);
    } else { // "12months"
      from = subMonths(now, 12);
    }
    
    setDateRange({ from, to: now });
  };
  
  // Calculate some stats
  const getAverageInvoiceAmount = () => {
    if (invoices.length === 0) return 0;
    const total = invoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    return total / invoices.length;
  };
  
  const getTotalEscrowHeld = () => {
    return invoices
      .filter(invoice => invoice.status === 'escrow_held')
      .reduce((acc, invoice) => acc + invoice.amount, 0);
  };
  
  // Monthly revenue calculation
  const calculateMonthlyRevenue = () => {
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const currentMonthRevenue = transactions
      .filter(tx => {
        if (!tx.created_at) return false;
        const txDate = new Date(tx.created_at);
        return isSameDay(txDate, currentMonth) || txDate < currentMonth && txDate >= startOfMonth(currentMonth);
      })
      .reduce((acc, tx) => tx.transaction_type === 'payment' ? acc + tx.amount : acc, 0);
    
    const lastMonthRevenue = transactions
      .filter(tx => {
        if (!tx.created_at) return false;
        const txDate = new Date(tx.created_at);
        return txDate < startOfMonth(currentMonth) && txDate >= startOfMonth(lastMonth);
      })
      .reduce((acc, tx) => tx.transaction_type === 'payment' ? acc + tx.amount : acc, 0);
    
    const percentChange = lastMonthRevenue === 0 
      ? 100 
      : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    
    return {
      current: currentMonthRevenue,
      last: lastMonthRevenue,
      percentChange
    };
  };
  
  const monthlyRevenue = calculateMonthlyRevenue();
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {item.name}: ${item.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance with detailed analytics</p>
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
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
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
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
          
          <Select value={timeframeFilter} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading analytics...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${monthlyRevenue.current.toFixed(2)}</div>
                    <p className={cn(
                      "text-xs mt-1",
                      monthlyRevenue.percentChange >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {monthlyRevenue.percentChange >= 0 ? "+" : ""}
                      {monthlyRevenue.percentChange.toFixed(1)}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(totalPaidAmount + totalPendingAmount).toFixed(2)}</div>
                    <p className="text-xs text-purple-500 mt-1">{invoices.length} invoices</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalPendingAmount.toFixed(2)}</div>
                    <p className="text-xs text-amber-500 mt-1">
                      {invoices.filter(i => i.status === 'pending' || i.status === 'escrow_held').length} unpaid invoices
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Invoice Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${getAverageInvoiceAmount().toFixed(2)}</div>
                    <p className="text-xs text-gray-500 mt-1">Per invoice</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                    <CardDescription>Monthly breakdown of your revenue</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={revenueData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                          <Bar dataKey="paid" name="Paid" stackId="a" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Status</CardTitle>
                    <CardDescription>Distribution of invoice statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading revenue data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalPayments.toFixed(2)}</div>
                    <p className="text-xs text-green-500 mt-1">All time</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Funds in Escrow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${getTotalEscrowHeld().toFixed(2)}</div>
                    <p className="text-xs text-purple-500 mt-1">
                      {invoices.filter(i => i.status === 'escrow_held').length} invoices held
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Current Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${monthlyRevenue.current.toFixed(2)}</div>
                    <p className={cn(
                      "text-xs mt-1",
                      monthlyRevenue.percentChange >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {monthlyRevenue.percentChange >= 0 ? "+" : ""}
                      {monthlyRevenue.percentChange.toFixed(1)}% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue breakdown over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="total" name="Total" stroke="#7c3aed" activeDot={{ r: 8 }} strokeWidth={2} />
                        <Line type="monotone" dataKey="paid" name="Paid" stroke="#10b981" />
                        <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Daily Transaction Volume</CardTitle>
                  <CardDescription>Transaction amounts by day</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyTransactionsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="amount" name="Amount" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading invoice data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{invoices.length}</div>
                    <p className="text-xs text-purple-500 mt-1">All time</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {invoices.filter(i => i.status === 'pending' || i.status === 'escrow_held').length}
                    </div>
                    <p className="text-xs text-amber-500 mt-1">Awaiting payment</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {invoices.filter(i => i.status === 'paid' || i.status === 'escrow_released').length}
                    </div>
                    <p className="text-xs text-green-500 mt-1">Successfully paid</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Status Distribution</CardTitle>
                  <CardDescription>Breakdown by invoice status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, value, percent}) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading transaction data...</p>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Activity</CardTitle>
                  <CardDescription>Daily transaction activity over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailyTransactionsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="amount" name="Amount" stroke="#7c3aed" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="count" name="# of Transactions" stroke="#10b981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
