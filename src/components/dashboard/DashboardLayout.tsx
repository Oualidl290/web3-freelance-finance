
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";
import Sidebar from "./navigation/Sidebar";
import RightSidebar from "./RightSidebar";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateInvoiceClick = () => {
    setIsDialogOpen();
  };

  // Close mobile sidebar on route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeTab]);

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-30 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md border-gray-200"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Left Sidebar - Navigation */}
        <div className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white lg:bg-transparent p-4 lg:p-0 transform transition-transform duration-200 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:relative lg:col-span-2 lg:transform-none lg:translate-x-0
        `}>
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
        <div className="lg:col-span-3 mt-6 lg:mt-0">
          <RightSidebar setActiveTab={setActiveTab} />
        </div>

        {/* Invoice Dialog */}
        <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
          <DialogTrigger className="hidden">Open Invoice Dialog</DialogTrigger>
        </Dialog>
      </div>
    </>
  );
}
