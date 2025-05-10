
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Wallet, PlusCircle, Loader2 } from "lucide-react";
import { useWallets } from "@/hooks/useWallets";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WalletCardProps {
  setActiveTab: (tab: string) => void;
}

export const WalletCard = ({ setActiveTab }: WalletCardProps) => {
  const { wallets, defaultWallet, totalBalance, isLoading, addWallet, setDefaultWallet } = useWallets();
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletType, setNewWalletType] = useState<"eth" | "usdc">("eth");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!newWalletAddress) return;
    
    setIsSubmitting(true);
    try {
      await addWallet.mutateAsync({
        wallet_address: newWalletAddress,
        wallet_type: newWalletType,
        balance: 0,
        is_default: wallets.length === 0
      });
      
      setNewWalletAddress("");
      setIsAddWalletOpen(false);
    } catch (error) {
      console.error("Error adding wallet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefaultWallet = async (id: string) => {
    try {
      await setDefaultWallet.mutateAsync(id);
    } catch (error) {
      console.error("Error setting default wallet:", error);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Your Wallet</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            onClick={() => setIsAddWalletOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-web3-purple" />
          </div>
        ) : defaultWallet ? (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br from-web3-purple/10 to-web3-blue/5 border border-web3-purple/20`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${defaultWallet.wallet_type === 'eth' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <Wallet className={`h-4 w-4 ${defaultWallet.wallet_type === 'eth' ? 'text-blue-600' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{defaultWallet.wallet_type.toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{truncateAddress(defaultWallet.wallet_address)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatBalance(defaultWallet.balance || 0)}</p>
                </div>
              </div>
            </div>
            
            {wallets.length > 1 && (
              <>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Total Balance:</p>
                  <p className="text-sm font-bold">{formatBalance(totalBalance)}</p>
                </div>
              </>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full rounded-lg border-web3-purple/30 hover:bg-web3-purple/5 text-web3-purple"
                onClick={() => setActiveTab("wallet")}
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" /> 
                Manage Wallets
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 space-y-2">
            <p className="text-sm text-gray-500">No wallet connected</p>
            <Button 
              size="sm" 
              onClick={() => setIsAddWalletOpen(true)}
              className="bg-web3-purple hover:bg-web3-purple/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Wallet
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Add Wallet Dialog */}
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Wallet</DialogTitle>
            <DialogDescription>
              Enter your wallet address and select the currency type.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
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
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddWalletOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddWallet} 
              disabled={isSubmitting || !newWalletAddress}
              className="bg-web3-purple hover:bg-web3-purple/90"
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WalletCard;
