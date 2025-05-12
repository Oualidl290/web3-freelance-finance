
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEscrow } from "@/hooks/useEscrow";
import { Invoice } from "@/types/invoice";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { Loader2, Lock, Unlock } from "lucide-react";

interface BlockchainOperationsProps {
  invoice: Invoice;
  onSuccess?: () => void;
}

export function BlockchainOperations({ invoice, onSuccess }: BlockchainOperationsProps) {
  const { setupEscrowForInvoice, isLoading } = useEscrow();
  const { toast } = useToast();
  const [isDepositing, setIsDepositing] = useState(false);

  const handleSetupEscrow = async () => {
    if (!invoice.client?.wallet_address) {
      toast({
        title: "Client Wallet Required",
        description: "This client doesn't have a wallet address set",
        variant: "destructive"
      });
      return;
    }

    try {
      await setupEscrowForInvoice(
        invoice.id,
        invoice.client.wallet_address,
        invoice.crypto_amount || invoice.amount
      );
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error setting up escrow:", error);
    }
  };

  const handleDepositFunds = async () => {
    if (!invoice.escrow_contract_address || !window.ethereum) {
      toast({
        title: "Setup Required",
        description: "Escrow contract must be set up first",
        variant: "destructive"
      });
      return;
    }

    setIsDepositing(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Simple escrow contract ABI for deposit function
      const escrowABI = ["function deposit(string invoiceId, address freelancer) external payable"];
      const escrowContract = new ethers.Contract(invoice.escrow_contract_address, escrowABI, signer);
      
      // Get the freelancer address (in a real app this would be pulled from the invoice/client data)
      // For demo, we'll use a dummy address
      const freelancerAddress = "0x0000000000000000000000000000000000000000";
      
      // Call the deposit function with the invoice ID and amount
      const ethAmount = ethers.utils.parseEther((invoice.crypto_amount?.toString() || "0.1"));
      const tx = await escrowContract.deposit(invoice.id, freelancerAddress, {
        value: ethAmount
      });
      
      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted to the blockchain",
      });
      
      // Wait for transaction to be mined
      await tx.wait();
      
      toast({
        title: "Funds Deposited",
        description: "Your funds have been successfully deposited to escrow",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error depositing funds:", error);
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to deposit funds to escrow",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  if (!invoice.escrow_enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Add escrow protection to this invoice by setting up a blockchain-based escrow contract.
          </p>
          <Button 
            onClick={handleSetupEscrow} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Up...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Setup Escrow
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoice.escrow_contract_address && (
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Escrow Contract:</span>
              <p className="text-sm font-mono break-all">{invoice.escrow_contract_address}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Network:</span>
              <p className="text-sm">{getNetworkName(invoice.chain_id)}</p>
            </div>
          </div>
        )}

        {invoice.status === "pending" && (
          <Button 
            onClick={handleDepositFunds} 
            disabled={isDepositing}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isDepositing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Deposit Funds to Escrow
              </>
            )}
          </Button>
        )}

        {invoice.status === "escrow_held" && (
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <p className="text-amber-800 text-sm">
              Funds are currently held in escrow. They will be released automatically after the escrow period ends.
            </p>
          </div>
        )}

        {invoice.status === "escrow_released" && (
          <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-center">
            <Unlock className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 text-sm">
              Escrow has been released. Funds have been transferred to the recipient.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get network name from chain ID
function getNetworkName(chainId: number | null): string {
  switch (chainId) {
    case 1: return "Ethereum Mainnet";
    case 5: return "Goerli Testnet";
    case 11155111: return "Sepolia Testnet";
    case 137: return "Polygon Mainnet";
    case 80001: return "Mumbai Testnet";
    case 42161: return "Arbitrum One";
    case 10: return "Optimism";
    case 56: return "BNB Smart Chain";
    default: return chainId ? `Chain ID: ${chainId}` : "Unknown Network";
  }
}
