
import { Button } from "@/components/ui/button";
import { FileText, Plus, ArrowDownToLine, BarChart3, Settings, Home, CreditCard } from "lucide-react";
import { WalletCard } from "../sidebar/WalletCard";
import { DashboardTab } from "../DashboardLayout";

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  handleCreateInvoiceClick: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, handleCreateInvoiceClick }: SidebarProps) => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Logo and User Profile */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-web3-purple to-web3-teal flex items-center justify-center text-white font-bold text-lg">
            W3
          </div>
          <span className="ml-2 text-xl font-bold text-web3-blue-dark">Web3Pay</span>
        </div>
      </div>

      {/* Wallet Balance */}
      <WalletCard setActiveTab={setActiveTab} />

      {/* Main Navigation */}
      <div className="space-y-1 mt-6">
        <Button 
          className="w-full bg-gradient-to-r from-web3-purple to-web3-blue text-white justify-start rounded-lg"
          onClick={handleCreateInvoiceClick}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
        
        <div className="pt-2">
          <p className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Dashboard
          </p>
        </div>
        
        <Button 
          variant={activeTab === "overview" ? "secondary" : "ghost"} 
          className={`w-full justify-start rounded-lg ${activeTab === "overview" ? "bg-gray-100" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Home className="mr-2 h-4 w-4" /> Overview
        </Button>
        
        <Button 
          variant={activeTab === "invoices" ? "secondary" : "ghost"} 
          className={`w-full justify-start rounded-lg ${activeTab === "invoices" ? "bg-gray-100" : ""}`}
          onClick={() => setActiveTab("invoices")}
        >
          <FileText className="mr-2 h-4 w-4" /> Invoices
        </Button>

        <Button 
          variant={activeTab === "wallet" ? "secondary" : "ghost"} 
          className={`w-full justify-start rounded-lg ${activeTab === "wallet" ? "bg-gray-100" : ""}`}
          onClick={() => setActiveTab("wallet")}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Wallet
        </Button>

        <Button 
          variant={activeTab === "payments" ? "secondary" : "ghost"}
          className={`w-full justify-start rounded-lg ${activeTab === "payments" ? "bg-gray-100" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          <CreditCard className="mr-2 h-4 w-4" /> Payments
        </Button>

        <div className="pt-2">
          <p className="px-2 text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Analysis
          </p>
        </div>

        <Button 
          variant={activeTab === "analytics" ? "secondary" : "ghost"} 
          className={`w-full justify-start rounded-lg ${activeTab === "analytics" ? "bg-gray-100" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 className="mr-2 h-4 w-4" /> Analytics
        </Button>

        <Button 
          variant={activeTab === "settings" ? "secondary" : "ghost"} 
          className={`w-full justify-start rounded-lg ${activeTab === "settings" ? "bg-gray-100" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
      </div>

      {/* Support Section */}
      <div className="mt-auto bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
        <p className="text-sm font-medium mb-1">Need Help?</p>
        <p className="text-xs text-gray-500 mb-2">Contact our support team for assistance</p>
        <Button variant="outline" size="sm" className="w-full text-xs justify-center rounded-lg border-web3-purple/30 text-web3-purple">
          Support Center
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
