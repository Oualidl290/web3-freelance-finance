
import { Button } from "@/components/ui/button";
import { FileText, Plus, ArrowDownToLine, BarChart3, Settings } from "lucide-react";
import { WalletCard } from "../sidebar/WalletCard";
import { DashboardTab } from "../DashboardLayout";

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  handleCreateInvoiceClick: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, handleCreateInvoiceClick }: SidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Logo and User Profile */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-web3-purple to-web3-teal"></div>
          <span className="ml-2 text-xl font-bold text-web3-blue-dark">Web3Pay</span>
        </div>
      </div>

      {/* Wallet Balance */}
      <WalletCard setActiveTab={setActiveTab} />

      {/* Main Navigation */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-gradient-to-r from-web3-purple to-web3-blue text-white justify-start"
          onClick={handleCreateInvoiceClick}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
        
        <Button 
          variant={activeTab === "overview" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => setActiveTab("overview")}
        >
          <FileText className="mr-2 h-4 w-4" /> Invoices
        </Button>

        <Button 
          variant={activeTab === "wallet" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => setActiveTab("wallet")}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw
        </Button>

        <Button 
          variant={activeTab === "analytics" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 className="mr-2 h-4 w-4" /> Analytics
        </Button>

        <Button 
          variant={activeTab === "settings" ? "secondary" : "ghost"} 
          className="w-full justify-start"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
