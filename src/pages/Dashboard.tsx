
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/DashboardOverview";
import WalletConnect from "@/components/WalletConnect";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, LayoutDashboard, FileText, Wallet, CreditCard, BarChart3, Settings, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import ClientDialog from "@/components/ClientDialog";
import { useInvoices } from "@/hooks/useInvoices";

type DashboardTab = "overview" | "invoices" | "wallet" | "payments" | "analytics" | "settings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const { pendingInvoices } = useInvoices();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-purple-600" />
            <p className="mt-4 text-lg">Loading your dashboard...</p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="mb-6 text-muted-foreground">
              Please sign in to access your dashboard and manage your invoices.
            </p>
            <Link to="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  const handleCreateInvoiceClick = () => {
    setIsInvoiceDialogOpen(true);
  };
  
  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
      onClick: () => setActiveTab("overview")
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: <FileText className="h-5 w-5" />,
      badge: pendingInvoices.length > 0 ? pendingInvoices.length : null,
      onClick: () => setActiveTab("invoices")
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <Wallet className="h-5 w-5" />,
      onClick: () => setActiveTab("wallet")
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      onClick: () => setActiveTab("payments")
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: () => setActiveTab("analytics")
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      onClick: () => setActiveTab("settings")
    }
  ];

  // Content for different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "invoices":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Invoices</h2>
                <p className="text-muted-foreground">
                  Manage all your invoices and payments
                </p>
              </div>
              <Button 
                onClick={handleCreateInvoiceClick}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </div>
            {/* Invoice list would go here */}
          </div>
        );
      case "wallet":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Wallet Management</h2>
            <p className="text-muted-foreground mb-6">
              Connect and manage your crypto wallets for receiving payments
            </p>
            <WalletConnect />
          </div>
        );
      case "payments":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            <p className="text-muted-foreground mb-6">
              View all your payment transactions
            </p>
          </div>
        );
      case "analytics":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Track your business performance with detailed analytics
            </p>
            
            <div className="text-center py-8">
              <img 
                src="/placeholder.svg" 
                alt="Analytics" 
                className="mx-auto h-40 w-auto mb-4 opacity-50"
              />
              <h3 className="text-xl font-medium mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-500 mb-4">
                Detailed analytics will be available soon to help you track your business performance.
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <p className="text-muted-foreground mb-6">
              Manage your account preferences and notification settings
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Notifications
                    </label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option>All notifications</option>
                      <option>Important only</option>
                      <option>None</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Default Currency
                    </label>
                    <select className="w-full rounded-md border border-gray-300 p-2">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>ETH</option>
                      <option>USDC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  W3
                </div>
                <span className="ml-2 font-bold text-lg">Web3Pay</span>
              </div>
            </div>

            {/* Main Action Button */}
            <Button 
              className="w-full mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
              onClick={handleCreateInvoiceClick}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
            
            {/* Navigation Menu */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                DASHBOARD
              </p>
              
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start text-sm font-medium ${
                    activeTab === item.id ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={item.onClick}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="ml-2 bg-purple-100 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* Support Section - Bottom */}
            <div className="mt-auto pt-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 text-purple-600 mr-2">?</div>
                  <p className="text-sm font-medium">Need Help?</p>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Our support team is just a click away
                </p>
                <Button variant="outline" size="sm" className="w-full text-xs bg-white">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} className="mt-0">
              <TabsContent value={activeTab} className="mt-0 p-0 border-none">
                {renderTabContent()}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Create Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-lg p-0">
          <InvoiceDialog />
        </DialogContent>
      </Dialog>
      
      {/* Create Client Dialog */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent>
          <ClientDialog onClose={() => setIsClientDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
