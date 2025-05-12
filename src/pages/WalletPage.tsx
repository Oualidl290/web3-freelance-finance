
import { useState } from "react";
import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Wallet, 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ethers } from "ethers";

const WalletPage = () => {
  const [isAddWalletDialogOpen, setIsAddWalletDialogOpen] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletType, setNewWalletType] = useState<"eth" | "usdc">("eth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("wallets");
  
  const { toast } = useToast();
  
  const { 
    wallets, 
    defaultWallet, 
    totalBalance, 
    isLoading: walletsLoading, 
    addWallet, 
    setDefaultWallet 
  } = useWallets();
  
  const { 
    transactions, 
    recentTransactions, 
    isLoading: transactionsLoading 
  } = useTransactions();
  
  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ethers.utils.isAddress(newWalletAddress)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addWallet.mutateAsync({
        wallet_address: newWalletAddress,
        wallet_type: newWalletType,
        balance: 0,
        is_default: wallets.length === 0, // Make default if it's the first wallet
      });
      
      toast({
        title: "Wallet added",
        description: "Your wallet has been added successfully",
      });
      
      setNewWalletAddress("");
      setIsAddWalletDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wallet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMakeDefault = async (id: string) => {
    try {
      await setDefaultWallet.mutateAsync(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default wallet",
        variant: "destructive",
      });
    }
  };
  
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    
    setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const getTransactionTypeIcon = (type: string) => {
    if (type === "payment") {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    } else if (type === "withdrawal") {
      return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
    } else if (type === "escrow_release") {
      return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
    } else {
      return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTransactionTypeLabel = (type: string) => {
    if (type === "payment") {
      return "Payment Received";
    } else if (type === "withdrawal") {
      return "Withdrawal";
    } else if (type === "escrow_release") {
      return "Escrow Released";
    } else if (type === "fee") {
      return "Fee";
    } else {
      return "Transaction";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your crypto wallets and transactions</p>
        </div>
        
        <Button 
          onClick={() => setIsAddWalletDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Wallet
        </Button>
      </div>
      
      <Tabs defaultValue="wallets" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets" className="space-y-6">
          {walletsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading wallets...</p>
            </div>
          ) : (
            <>
              {/* Wallet Balance Overview */}
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl">Total Balance</CardTitle>
                  <CardDescription>Combined balance across all wallets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">${totalBalance.toFixed(2)}</span>
                    <span className="ml-2 text-green-500 text-sm">+2.4%</span>
                  </div>
                </CardContent>
              </Card>
            
              {/* Wallet List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallets.map(wallet => (
                  <Card key={wallet.id} className={`border ${wallet.is_default ? 'border-purple-300 shadow-sm' : 'border-gray-200'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center">
                            <Wallet className="h-5 w-5 mr-2 text-purple-500" />
                            {wallet.wallet_type.toUpperCase()}
                            {wallet.is_default && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-600 rounded-full px-2 py-0.5">
                                Default
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <div className="flex items-center">
                              <span>{truncateAddress(wallet.wallet_address)}</span>
                              <button 
                                onClick={() => handleCopyAddress(wallet.wallet_address)}
                                className="ml-1.5 text-gray-400 hover:text-gray-600"
                              >
                                {copiedAddress === wallet.wallet_address ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">${wallet.balance?.toFixed(2) || '0.00'}</div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      {!wallet.is_default && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMakeDefault(wallet.id)}
                        >
                          Make Default
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-auto"
                        onClick={() => {
                          window.open(`https://etherscan.io/address/${wallet.wallet_address}`, '_blank');
                        }}
                      >
                        View on Etherscan
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {wallets.length === 0 && (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <Wallet className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No wallets found</h3>
                  <p className="text-muted-foreground mt-1">
                    Add a wallet to receive payments in crypto
                  </p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    onClick={() => setIsAddWalletDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Wallet
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          {transactionsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="ml-2 text-lg">Loading transactions...</p>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest crypto transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                              {getTransactionTypeIcon(tx.transaction_type)}
                            </div>
                            <div>
                              <div className="font-medium">{getTransactionTypeLabel(tx.transaction_type)}</div>
                              <div className="text-sm text-gray-500">
                                {tx.created_at ? format(new Date(tx.created_at), 'MMM d, yyyy • h:mm a') : '-'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              tx.transaction_type === 'payment' || tx.transaction_type === 'escrow_release' 
                                ? 'text-green-600' 
                                : 'text-amber-600'
                            }`}>
                              {tx.transaction_type === 'payment' || tx.transaction_type === 'escrow_release' ? '+' : '-'}
                              {tx.amount} {tx.currency.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tx.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Wallet Dialog */}
      <Dialog open={isAddWalletDialogOpen} onOpenChange={setIsAddWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet</DialogTitle>
            <DialogDescription>
              Connect your crypto wallet to receive payments
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddWallet}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="0x..."
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="wallet-type">Wallet Type</Label>
                <Select
                  value={newWalletType}
                  onValueChange={(value: "eth" | "usdc") => setNewWalletType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wallet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Wallet
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletPage;
