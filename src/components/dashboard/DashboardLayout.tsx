
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  FileText,
  ArrowDownToLine,
  BarChart3,
  Settings,
  Plus,
  Bell,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallets } from "@/hooks/useWallets";
import { useInvoices } from "@/hooks/useInvoices";
import { useTransactions } from "@/hooks/useTransactions";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
  const { totalPendingAmount, pendingInvoices } = useInvoices();
  const { wallets, defaultWallet, totalBalance } = useWallets();
  const { recentTransactions } = useTransactions();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  };

  // Format balance to 4 decimal places for display
  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  const handleCreateInvoiceClick = () => {
    setIsDialogOpen();
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Left Sidebar - Navigation */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          {/* Logo and User Profile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-web3-purple to-web3-teal"></div>
              <span className="ml-2 text-xl font-bold text-web3-blue-dark">Web3Pay</span>
            </div>
          </div>

          {/* Wallet Balance */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              {defaultWallet ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-lg">{formatBalance(defaultWallet.balance || 0)}</div>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {defaultWallet.wallet_type.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {truncateAddress(defaultWallet.wallet_address)}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">No wallet connected</div>
              )}
              
              {wallets.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span>Total Balance:</span>
                    <span className="font-semibold">{formatBalance(totalBalance)}</span>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs p-0 h-auto mt-1"
                    onClick={() => setActiveTab("wallet")}
                  >
                    Switch wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-7">
        {children}
      </div>

      {/* Right Sidebar - Contextual Actions */}
      <div className="lg:col-span-3">
        <div className="space-y-6">
          {/* Upcoming Actions */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Upcoming Actions</CardTitle>
                <Bell className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingInvoices.length > 0 ? (
                pendingInvoices
                  .filter(invoice => invoice.status === "escrow_held")
                  .slice(0, 2)
                  .map(invoice => (
                    <div key={invoice.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-amber-100 p-1.5 rounded-full">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Approve release for #{invoice.invoice_number}</p>
                        <p className="text-xs text-gray-500">Escrow period ends in {invoice.escrow_days} days</p>
                        <Button 
                          size="sm" 
                          variant="link" 
                          className="h-auto p-0 text-xs"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  No pending actions
                </div>
              )}

              {/* Auto-convert action (demo) */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <ArrowDownToLine className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Convert $500 USDC to USD</p>
                  <p className="text-xs text-gray-500">Auto-convert enabled</p>
                  <Button 
                    size="sm" 
                    variant="link" 
                    className="h-auto p-0 text-xs"
                    onClick={() => setActiveTab("settings")}
                  >
                    Configure settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Chat */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Support</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Need help with your account or have questions about crypto payments?
              </div>
              <div className="space-y-2">
                <Button className="w-full bg-web3-purple text-white">
                  Chat with AI Assistant
                </Button>
                <Button variant="outline" className="w-full">
                  Talk to Human
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded-full ${
                      transaction.transaction_type === 'payment' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.transaction_type === 'payment' 
                        ? <CheckCircle className="h-4 w-4" /> 
                        : transaction.transaction_type === 'withdrawal'
                          ? <ArrowDownToLine className="h-4 w-4" />
                          : <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.transaction_type === 'payment' 
                          ? `Payment received for invoice ${transaction.invoice?.invoice_number || 'Unknown'}` 
                          : transaction.transaction_type === 'withdrawal'
                            ? 'Funds withdrawn'
                            : transaction.transaction_type === 'escrow_release'
                              ? `Escrow released for invoice ${transaction.invoice?.invoice_number || 'Unknown'}`
                              : 'Fee paid'
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })} • 
                        {transaction.amount} {transaction.currency.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogTrigger className="hidden">Open Invoice Dialog</DialogTrigger>
      </Dialog>
    </div>
  );
}
