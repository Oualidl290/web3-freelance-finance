import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Wallet, CreditCard, BarChart3, ChevronRight, ArrowDownToLine, Loader2, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useWallets } from "@/hooks/useWallets";
import { useInvoices } from "@/hooks/useInvoices";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function DashboardSidebar({ setIsDialogOpen, setActiveTab }: { 
  setIsDialogOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}) {
  const { totalPendingAmount, pendingInvoices } = useInvoices();
  const { wallets, defaultWallet, totalBalance, isLoading, addWallet, setDefaultWallet } = useWallets();
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletType, setNewWalletType] = useState<"eth" | "usdc">("eth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Format balance to 4 decimal places for display
  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  // Function to truncate ethereum addresses
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  };

  const handleAddWallet = async () => {
    if (!newWalletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addWallet.mutateAsync({
        wallet_address: newWalletAddress,
        wallet_type: newWalletType,
        balance: 0,
        is_default: wallets.length === 0 // Make default if this is the first wallet
      });
      
      setNewWalletAddress("");
      setIsAddWalletOpen(false);
      toast({
        title: "Success",
        description: "Wallet added successfully"
      });
    } catch (error) {
      console.error("Error adding wallet:", error);
      toast({
        title: "Error",
        description: "Failed to add wallet",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefaultWallet = async (id: string) => {
    try {
      await setDefaultWallet.mutateAsync(id);
    } catch (error) {
      console.error("Error setting default wallet:", error);
      toast({
        title: "Error",
        description: "Failed to set default wallet",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* Quick Actions */}
      <div className="apple-card p-6 rounded-apple mb-6">
        <h3 className="text-lg font-medium text-apple-text mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="w-full justify-start text-left bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between text-left rounded-full border border-apple-secondary hover:bg-apple-secondary"
            onClick={() => setActiveTab("invoices")}
          >
            <span className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              View Invoices
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between text-left rounded-full border border-apple-secondary hover:bg-apple-secondary"
            onClick={() => setActiveTab("wallet")}
          >
            <span className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-between text-left rounded-full border border-apple-secondary hover:bg-apple-secondary"
            onClick={() => setActiveTab("payments")}
          >
            <span className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              View Payments
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Wallet Overview */}
      <Card className="rounded-apple mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Your Wallets</CardTitle>
            <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 rounded-full">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <div className="space-y-4 py-2 pb-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight">Add Wallet</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter your wallet address and select the currency type.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Wallet Address</Label>
                      <Input
                        id="walletAddress"
                        placeholder="0x..."
                        value={newWalletAddress}
                        onChange={(e) => setNewWalletAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="walletType">Wallet Type</Label>
                      <Select
                        value={newWalletType}
                        onValueChange={(value) => setNewWalletType(value as "eth" | "usdc")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select wallet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddWalletOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddWallet} 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Wallet"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Manage your crypto wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-apple-accent1" />
            </div>
          ) : wallets.length > 0 ? (
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div 
                  key={wallet.id} 
                  className={`p-3 rounded-lg transition-colors ${
                    wallet.is_default ? 'bg-apple-accent1/10 border border-apple-accent1/30' : 'bg-apple-secondary hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {wallet.wallet_type === 'eth' ? (
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg width="16" height="16" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                            <path fill="#343434" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                            <path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                            <path fill="#3C3C3B" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
                            <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"/>
                            <path fill="#141414" d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
                            <path fill="#393939" d="M0 212.32l127.96 75.638v-133.8z"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.22 19.953c-4.35 0-7.877-3.527-7.877-7.877 0-4.349 3.527-7.877 7.877-7.877 4.349 0 7.877 3.528 7.877 7.877 0 4.35-3.528 7.877-7.877 7.877zm1.782-6.91c.269.22.537.418.811.616.455.328.865.418.97.275.104-.143.059-.616-.29-1.055-.276-.347-.642-.689-1.045-.982.194-.473.351-.959.47-1.456h1.244v-.85h-1.007c.044-.35.044-.701.015-1.051h-.865c.03.35.03.7-.015 1.05H12.8v.851h-.97c-.12.512-.284 1.009-.493 1.494-.239-.157-.478-.3-.731-.417-.455-.22-.85-.238-.939-.06-.09.18.029.596.418.954.269.238.567.447.896.626-.03.014-.044.03-.073.045-.388.186-.762.395-1.12.633-.47.328-.836.7-.747.969.09.277.657.277 1.337 0 .455-.186.91-.456 1.35-.743.03.016.045.03.074.045.344.238.673.486.97.745.433.37.73.714.611.939-.119.224-.522.179-.984-.09-.35-.209-.687-.456-1.008-.714-.418.37-.791.75-1.127 1.156-.351.417-.462.775-.284.894.179.12.671-.09 1.142-.52.38-.351.747-.76 1.083-1.193.149.105.284.194.418.284.302.194.603.357.889.505.455.224.836.328.94.164.103-.165-.015-.522-.345-.85-.179-.18-.373-.343-.581-.508.24-.27.463-.553.671-.85.134.06.254.119.373.165.455.194.865.284.955.104.089-.179-.044-.566-.403-.895-.254-.224-.537-.418-.835-.597.194-.373.373-.76.522-1.156h1.156v-.85h-.925c.045-.35.059-.701.045-1.051h-.865c.014.35 0 .7-.046 1.05h-1.082v.851h.94c-.134.41-.299.81-.478 1.2-.433-.18-.88-.329-1.35-.433-.55-.12-.969-.075-1.008.134-.045.209.418.462 1.083.642.403.104.821.18 1.248.224-.253.39-.537.765-.836 1.111-.456.537-.792.954-.597 1.126.194.179.761-.09 1.337-.67.321-.314.614-.658.88-1.023.343.09.672.194.97.328zm-5.281-2.05c.194-.283.09-.642-.225-.805-.313-.164-.72-.06-.91.224-.193.283-.089.641.226.805.313.165.72.06.91-.225zm.567-2.05c.194-.284.09-.642-.226-.805-.313-.164-.72-.06-.91.225-.194.284-.09.642.225.805.313.164.72.06.91-.225zm0-2.05c.194-.284.09-.642-.226-.805-.313-.165-.72-.06-.91.224-.194.284-.09.642.225.806.313.164.72.06.91-.225zm1.143-1.76c.194-.285.089-.643-.226-.806-.313-.164-.72-.06-.91.225-.194.284-.09.642.226.805.313.165.72.06.91-.224zm1.143-.672c.273-.179.343-.596.15-.939-.194-.34-.567-.477-.84-.298-.271.18-.34.597-.147.939.194.34.567.477.837.298zm1.366-.343c.272-.179.343-.596.15-.939-.195-.34-.567-.477-.84-.298-.273.18-.343.597-.15.939.195.341.567.478.84.299zm1.36 0c.274-.179.344-.596.15-.939-.194-.34-.566-.477-.838-.298-.273.18-.344.597-.15.939.194.341.567.478.838.299zm1.366.343c.273-.179.344-.596.15-.939-.194-.34-.567-.477-.84-.298-.272.18-.343.597-.15.939.194.34.567.477.84.298zm.597 1.016c.314-.165.417-.523.225-.806-.195-.284-.597-.389-.91-.224-.315.164-.418.523-.225.805.194.284.595.388.91.225zm.388 1.805c.314-.165.418-.524.226-.806-.195-.284-.597-.389-.91-.224-.314.164-.418.523-.226.805.195.284.597.389.91.225zm-.75 1.61c.315-.164.418-.522.226-.805-.194-.284-.596-.389-.91-.225-.313.165-.417.523-.224.806.194.284.596.388.909.224z" fill="#2775CA"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{wallet.wallet_type.toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{truncateAddress(wallet.wallet_address)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatBalance(wallet.balance || 0)}</p>
                      {!wallet.is_default && (
                        <button 
                          className="text-xs text-apple-accent1 hover:underline"
                          onClick={() => handleSetDefaultWallet(wallet.id)}
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-muted-foreground text-sm">
              No wallets connected yet
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-xl font-semibold">{formatBalance(totalBalance)}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => setActiveTab("wallet")}
            >
              <ArrowDownToLine className="h-3.5 w-3.5 mr-1" /> Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Pending Actions */}
      {pendingInvoices.length > 0 && (
        <Card className="rounded-apple mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInvoices.slice(0, 3).map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between bg-apple-secondary p-3 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{invoice.invoice_number}</p>
                    <p className="text-xs text-muted-foreground">Due {invoice.due_date ? format(new Date(invoice.due_date), 'MMM d') : 'soon'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">${invoice.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {pendingInvoices.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full text-apple-accent1"
                onClick={() => setActiveTab("invoices")}
              >
                View {pendingInvoices.length - 3} more
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Pro Plan */}
      <div className="apple-card rounded-apple p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-apple-accent1/5 to-apple-accent1/20 z-0"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-medium text-apple-text mb-3">Pro Plan</h3>
          <p className="text-sm text-gray-600 mb-4">Upgrade for advanced features and higher limits</p>
          <ul className="text-sm text-gray-600 mb-4 space-y-2">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-apple-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Unlimited invoices
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-apple-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Advanced analytics
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-apple-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Priority support
            </li>
          </ul>
          <Button className="w-full bg-apple-accent1 hover:bg-apple-accent1/90 text-white rounded-full">
            Upgrade Now
          </Button>
        </div>
      </div>
    </>
  );
}
