
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { ChevronDown, Download, Calendar } from "lucide-react";

// Mock data for demonstration
const monthlyRevenue = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 890 },
  { name: 'May', value: 1790 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

const paymentMethodData = [
  { name: 'USDC', value: 1790 },
  { name: 'ETH', value: 890 },
];

const COLORS = ['#0071E3', '#34C759', '#FF9500', '#FF2D55'];

const Analytics = () => {
  const [dateRange, setDateRange] = useState("This Year");
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-apple-secondary">
      <NavBar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-apple-text">Analytics</h1>
              <p className="text-gray-500 mt-1">
                Track your business performance with detailed metrics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="rounded-full border border-apple-secondary hover:bg-apple-secondary"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange}
                <ChevronDown className="ml-2 h-4 w-4" />
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

          {/* Top metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="apple-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium text-apple-text">$2,680.00</div>
                <p className="text-xs text-apple-accent2 mt-1">
                  +12.5% from last year
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Invoices Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium text-apple-text">3</div>
                <p className="text-xs text-apple-accent2 mt-1">
                  +3 from last year
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payments Received</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium text-apple-text">2</div>
                <p className="text-xs text-apple-accent2 mt-1">
                  66.7% completion rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-medium text-apple-text">$893.33</div>
                <p className="text-xs text-gray-500 mt-1">
                  Per invoice
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="apple-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyRevenue}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F7" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0071E3" 
                      fill="#0071E3" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="apple-card">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by currency</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip formatter={(value) => `$${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Pro features promo */}
          <Card className="apple-card relative overflow-hidden border border-apple-accent1/20">
            <div className="absolute inset-0 bg-gradient-to-br from-apple-accent1/5 to-apple-accent1/20 z-0"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-medium text-apple-text mb-2">Upgrade to Analytics Pro</h3>
                  <p className="text-gray-600 mb-4 max-w-lg">
                    Get access to advanced analytics features, including customer behavior tracking, 
                    financial forecasting, and custom reporting tools.
                  </p>
                  <Button className="bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full">
                    Upgrade Now
                  </Button>
                </div>
                <img 
                  src="/placeholder.svg" 
                  alt="Analytics Pro" 
                  className="h-32 w-32 opacity-75"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Analytics;
