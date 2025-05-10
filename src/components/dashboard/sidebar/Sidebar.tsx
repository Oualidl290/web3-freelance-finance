
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, FileText, Plus, ArrowDownToLine, 
  CreditCard, BarChart3, Settings, HelpCircle, UserPlus 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardTab } from "../DashboardLayout";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInvoices } from "@/hooks/useInvoices";

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  handleCreateInvoiceClick: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, handleCreateInvoiceClick }: SidebarProps) => {
  const navigate = useNavigate();
  const { pendingInvoices } = useInvoices();
  const [expanded, setExpanded] = useState<string | null>(null);

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
      onClick: () => setActiveTab("overview")
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => setActiveTab("invoices"),
      badge: pendingInvoices.length > 0 ? pendingInvoices.length : undefined
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <ArrowDownToLine className="h-4 w-4" />,
      onClick: () => setActiveTab("wallet")
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" />,
      onClick: () => setActiveTab("payments")
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: () => setActiveTab("analytics")
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => setActiveTab("settings")
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo and Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-gradient-to-r from-web3-purple to-web3-teal flex items-center justify-center text-white font-semibold">
            W3
          </div>
          <span className="ml-2 font-bold text-lg">Web3Pay</span>
        </div>
      </div>
      
      {/* User Profile */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>UR</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">User Account</p>
          <p className="text-xs text-muted-foreground">Pro Plan</p>
        </div>
      </div>

      {/* Main Action Button */}
      <Button 
        className="mb-6 bg-gradient-to-r from-web3-purple to-web3-blue text-white"
        onClick={handleCreateInvoiceClick}
      >
        <Plus className="mr-2 h-4 w-4" /> Create Invoice
      </Button>

      {/* Client Button */}
      <Button 
        variant="outline" 
        className="mb-6 flex items-center justify-center gap-2"
        onClick={() => navigate("/clients")}
      >
        <UserPlus className="h-4 w-4" />
        Add Client
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
            className={cn(
              "w-full justify-start text-sm font-medium",
              activeTab === item.id && "bg-gray-100 font-medium"
            )}
            onClick={item.onClick}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 bg-web3-purple text-white">
                  {item.badge}
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </div>

      {/* Support Section - Bottom */}
      <div className="mt-auto pt-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center mb-2">
            <HelpCircle className="h-4 w-4 text-web3-purple mr-2" />
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
  );
};

export default Sidebar;
