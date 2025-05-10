
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import Sidebar from "./navigation/Sidebar";
import RightSidebar from "./RightSidebar";

export type DashboardTab = "overview" | "invoices" | "wallet" | "payments" | "analytics" | "settings";

export default function DashboardLayout({ 
  activeTab,
  setActiveTab,
  setIsDialogOpen,
  children 
}: { 
  activeTab: DashboardTab; 
  setActiveTab: (tab: DashboardTab) => void;
  setIsDialogOpen: () => void;
  children: React.ReactNode;
}) {
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateInvoiceClick = () => {
    setIsDialogOpen();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Left Sidebar - Navigation */}
      <div className="lg:col-span-2">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleCreateInvoiceClick={handleCreateInvoiceClick} 
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-7">
        {children}
      </div>

      {/* Right Sidebar - Contextual Actions */}
      <div className="lg:col-span-3">
        <RightSidebar setActiveTab={setActiveTab} />
      </div>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogTrigger className="hidden">Open Invoice Dialog</DialogTrigger>
      </Dialog>
    </div>
  );
}
