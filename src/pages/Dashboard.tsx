
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/DashboardOverview";
import WalletConnect from "@/components/WalletConnect";
import InvoiceCreationForm from "@/components/InvoiceCreationForm";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="invoices">Create Invoice</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Button variant="outline" size="sm">
                    <span className="flex h-2 w-2 absolute top-0 right-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="ml-1">Test Mode</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="invoices">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
                  <p className="text-muted-foreground">
                    Generate a new invoice to send to your clients.
                  </p>
                </div>
                
                <InvoiceCreationForm />
              </div>
            </TabsContent>
            
            <TabsContent value="wallet">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Wallet Management</h2>
                  <p className="text-muted-foreground">
                    Connect and manage your crypto wallets for receiving payments.
                  </p>
                </div>
                
                <WalletConnect />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
