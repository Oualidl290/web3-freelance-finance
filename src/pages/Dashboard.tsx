
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/DashboardOverview";
import WalletConnect from "@/components/WalletConnect";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import { FileText, Plus, Wallet, Settings, Activity } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your invoices and payments
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button variant="outline" size="sm" className="border-2 border-green-400 text-green-700 bg-green-50">
                  <span className="flex h-2 w-2 absolute top-0 right-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="ml-1">Test Mode</span>
                </Button>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-200 transition-all"
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Invoice
                  </Button>
                </DialogTrigger>
                <InvoiceDialog />
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="bg-slate-100 p-1 flex w-full sm:w-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Activity className="h-4 w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="invoices" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4" />
                      <span>Invoices</span>
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Wallet className="h-4 w-4" />
                      <span>Wallet</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
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
                        <h2 className="text-2xl font-bold tracking-tight">All Invoices</h2>
                        <p className="text-muted-foreground">
                          View and manage all your invoices in one place
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg border p-4">
                        <p className="text-center text-muted-foreground py-8">
                          Invoice list will appear here. Create your first invoice to get started.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wallet">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Wallet Management</h2>
                        <p className="text-muted-foreground">
                          Connect and manage your crypto wallets for receiving payments.
                        </p>
                      </div>
                      
                      <WalletConnect />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
                        <p className="text-muted-foreground">
                          Manage your account preferences and notification settings
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg border p-4">
                        <p className="text-center text-muted-foreground py-8">
                          Settings panel coming soon
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab("invoices")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View All Invoices
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </DialogTrigger>
                    <InvoiceDialog />
                  </Dialog>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab("wallet")}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6 border border-indigo-100">
                <h3 className="text-lg font-medium mb-3 text-indigo-900">Pro Plan</h3>
                <p className="text-sm text-indigo-700 mb-4">Upgrade for advanced features and higher limits</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Upgrade Now</Button>
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
