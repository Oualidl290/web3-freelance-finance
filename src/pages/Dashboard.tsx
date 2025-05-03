
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/DashboardOverview";
import WalletConnect from "@/components/WalletConnect";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import { 
  FileText, 
  Plus, 
  Wallet, 
  Settings, 
  Activity, 
  ChevronRight,
  CreditCard,
  BarChart3,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-apple-secondary">
      <NavBar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-medium tracking-tight text-apple-text">Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Manage your invoices, payments, and financial activity
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border border-apple-accent2 text-apple-accent2 bg-white rounded-full h-9"
                >
                  <span className="flex h-2 w-2 absolute top-0 right-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apple-accent2 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-apple-accent2"></span>
                  </span>
                  <span className="ml-1">Test Mode</span>
                </Button>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full shadow-apple"
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] rounded-apple border-apple-secondary">
                  <InvoiceDialog onClose={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-9">
              <div className="apple-card p-apple-airy rounded-apple mb-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="bg-apple-secondary p-1 flex w-full overflow-x-auto no-scrollbar rounded-full">
                    <TabsTrigger 
                      value="overview" 
                      className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-apple-text data-[state=active]:shadow-apple"
                    >
                      <Activity className="h-4 w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="invoices" 
                      className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-apple-text data-[state=active]:shadow-apple"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Invoices</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="wallet" 
                      className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-apple-text data-[state=active]:shadow-apple"
                    >
                      <Wallet className="h-4 w-4" />
                      <span>Wallet</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payments" 
                      className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-apple-text data-[state=active]:shadow-apple"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Payments</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="analytics" 
                      className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-apple-text data-[state=active]:shadow-apple"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="settings" 
                      className="flex items-center gap-2 rounded-full data-[state=active]:bg-white data-[state=active]:text-apple-text data-[state=active]:shadow-apple"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <DashboardOverview />
                  </TabsContent>
                  
                  <TabsContent value="invoices" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-medium text-apple-text">All Invoices</h2>
                        <p className="text-gray-500 mt-1">
                          View and manage all your invoices in one place
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-apple shadow-apple border border-apple-secondary p-6">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex gap-4">
                            <Button variant="outline" className="rounded-full text-sm">All Invoices</Button>
                            <Button variant="outline" className="rounded-full text-sm">Pending</Button>
                            <Button variant="outline" className="rounded-full text-sm">Paid</Button>
                          </div>
                          <Button 
                            onClick={() => setIsDialogOpen(true)}
                            className="bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Create Invoice
                          </Button>
                        </div>
                        
                        <p className="text-center text-gray-500 py-8">
                          No invoices found. Create your first invoice to get started.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wallet">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-medium text-apple-text">Wallet Management</h2>
                        <p className="text-gray-500 mt-1">
                          Connect and manage your crypto wallets for receiving payments
                        </p>
                      </div>
                      
                      <WalletConnect />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payments">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-medium text-apple-text">Payment History</h2>
                        <p className="text-gray-500 mt-1">
                          Track all your incoming payments and transactions
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-apple shadow-apple border border-apple-secondary p-6">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex gap-4">
                            <Button variant="outline" className="rounded-full text-sm">All Payments</Button>
                            <Button variant="outline" className="rounded-full text-sm">Received</Button>
                            <Button variant="outline" className="rounded-full text-sm">Pending</Button>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" /> Last 30 days
                          </div>
                        </div>
                        
                        <p className="text-center text-gray-500 py-8">
                          No payment history found. Payments will appear here once you receive them.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-medium text-apple-text">Analytics Dashboard</h2>
                        <p className="text-gray-500 mt-1">
                          Track your business performance with detailed analytics
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-apple shadow-apple border border-apple-secondary p-6 text-center">
                        <img 
                          src="/placeholder.svg" 
                          alt="Analytics" 
                          className="mx-auto h-40 w-auto mb-4 opacity-50"
                        />
                        <h3 className="text-xl font-medium text-apple-text mb-2">Analytics Coming Soon</h3>
                        <p className="text-gray-500 mb-4">
                          Detailed analytics will be available soon to help you track your business performance.
                        </p>
                        <Button 
                          className="bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full"
                        >
                          Upgrade to Pro
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-medium text-apple-text">Account Settings</h2>
                        <p className="text-gray-500 mt-1">
                          Manage your account preferences and notification settings
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-apple shadow-apple border border-apple-secondary p-6">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-apple-text mb-4">General Settings</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-apple-text mb-1">
                                  Email Notifications
                                </label>
                                <select className="apple-input w-full">
                                  <option>All notifications</option>
                                  <option>Important only</option>
                                  <option>None</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-apple-text mb-1">
                                  Default Currency
                                </label>
                                <select className="apple-input w-full">
                                  <option>USD</option>
                                  <option>EUR</option>
                                  <option>ETH</option>
                                  <option>USDC</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-apple-secondary">
                            <h3 className="text-lg font-medium text-apple-text mb-4">Business Profile</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-apple-text mb-1">
                                  Business Name
                                </label>
                                <input type="text" placeholder="Enter business name" className="apple-input w-full" />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-apple-text mb-1">
                                  Business Address
                                </label>
                                <textarea placeholder="Enter business address" className="apple-input w-full"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-3">
              {/* Quick Actions */}
              <div className="apple-card p-6 rounded-apple mb-6">
                <h3 className="text-lg font-medium text-apple-text mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full justify-start text-left bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-left rounded-full border border-apple-secondary hover:bg-apple-secondary"
                    onClick={() => setActiveTab("invoices")}
                  >
                    <span className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      View Invoices
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-left rounded-full border border-apple-secondary hover:bg-apple-secondary"
                    onClick={() => setActiveTab("wallet")}
                  >
                    <span className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between text-left rounded-full border border-apple-secondary hover:bg-apple-secondary"
                    onClick={() => setActiveTab("payments")}
                  >
                    <span className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      View Payments
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Pro Plan */}
              <div className="apple-card rounded-apple p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-apple-accent1/5 to-apple-accent1/20 z-0"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium text-apple-text mb-3">Pro Plan</h3>
                  <p className="text-sm text-gray-600 mb-4">Upgrade for advanced features and higher limits</p>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-apple-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlimited invoices
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-apple-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-apple-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
