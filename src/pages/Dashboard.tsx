
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/DashboardOverview";
import WalletConnect from "@/components/WalletConnect";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout, { DashboardTab } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-apple-secondary">
        <NavBar />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-apple-accent1" />
            <p className="mt-4 text-lg">Loading your dashboard...</p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-apple-secondary">
        <NavBar />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="mb-6 text-muted-foreground">
              Please sign in to access your dashboard and manage your invoices.
            </p>
            <Link to="/auth">
              <Button className="bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full">
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
    setIsDialogOpen(true);
  };

  const handleTabChange = (tab: DashboardTab) => {
    if (tab === "invoices") {
      // Use the CreateInvoice page instead for now
      navigate("/create-invoice");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1 py-6">
        <DashboardLayout 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          setIsDialogOpen={handleCreateInvoiceClick}
        >
          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Test Mode Badge */}
            <div className="flex justify-end">
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
            </div>
            
            {/* Tab Content */}
            <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as DashboardTab)}>
              <TabsContent value="overview" className="m-0">
                <DashboardOverview />
              </TabsContent>
              
              <TabsContent value="wallet" className="m-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Wallet Management</h2>
                  <p className="text-muted-foreground mb-6">
                    Connect and manage your crypto wallets for receiving payments
                  </p>
                  <WalletConnect />
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="m-0">
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
              </TabsContent>
              
              <TabsContent value="settings" className="m-0">
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
              </TabsContent>
            </Tabs>
          </div>
        </DashboardLayout>
      </div>
      
      <Footer />
      
      {/* Create Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-lg p-0">
          <InvoiceDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
