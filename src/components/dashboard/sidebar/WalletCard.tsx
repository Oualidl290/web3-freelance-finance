
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import { useWallets } from "@/hooks/useWallets";
import { Separator } from "@/components/ui/separator";

interface WalletCardProps {
  setActiveTab: (tab: string) => void;
}

export const WalletCard = ({ setActiveTab }: WalletCardProps) => {
  const { wallets, defaultWallet, totalBalance, isLoading } = useWallets();

  // Format balance to 4 decimal places for display
  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  // Function to truncate ethereum addresses
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
  };

  return (
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
  );
};
