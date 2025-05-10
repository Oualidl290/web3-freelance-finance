
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import RightPanel from "./sidebar/RightPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceDialog from "@/components/InvoiceDialog";

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

  // Close mobile sidebar on route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [activeTab]);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md border-gray-200"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Navigation */}
        <div className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white lg:bg-transparent transform transition-transform duration-200 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:relative lg:w-64 lg:transform-none lg:translate-x-0 lg:min-h-screen lg:flex-shrink-0
        `}>
          <div className="h-full overflow-y-auto p-4">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              handleCreateInvoiceClick={setIsDialogOpen} 
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:flex-grow px-4 sm:px-6 lg:px-8 pt-16 pb-6 lg:pt-6 w-full max-w-full">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>

        {/* Right Panel - Contextual Content */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0 p-4">
          <div className="sticky top-4">
            <RightPanel setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-lg p-0">
          <InvoiceDialog />
        </DialogContent>
      </Dialog>
    </div>
  );
}
