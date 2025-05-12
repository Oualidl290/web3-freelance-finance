
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DashboardOverview from "@/components/DashboardOverview";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Plus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import ClientDialog from "@/components/ClientDialog";
import { useInvoices } from "@/hooks/useInvoices";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import InvoicesPage from "./InvoicesPage";
import WalletPage from "./WalletPage";
import PaymentsPage from "./PaymentsPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";

type DashboardTab = "overview" | "invoices" | "wallet" | "payments" | "analytics" | "settings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active tab based on URL path
    const path = location.pathname;
    if (path.includes("/invoices")) {
      setActiveTab("invoices");
    } else if (path.includes("/wallet")) {
      setActiveTab("wallet");
    } else if (path.includes("/payments")) {
      setActiveTab("payments");
    } else if (path.includes("/analytics")) {
      setActiveTab("analytics");
    } else if (path.includes("/settings")) {
      setActiveTab("settings");
    } else {
      setActiveTab("overview");
    }
  }, [location]);

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

  // Content for different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "invoices":
        return <InvoicesPage />;
      case "wallet":
        return <WalletPage />;
      case "payments":
        return <PaymentsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="flex-1 px-0 md:p-6">
        <DashboardLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsDialogOpen={handleCreateInvoiceClick}
        >
          {renderTabContent()}
        </DashboardLayout>
      </div>
      
      <Footer />
      
      {/* Create Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
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
