
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, LockIcon, UnlockIcon, AlertCircle } from "lucide-react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@/types/invoice";
import { useEscrow } from "@/hooks/useEscrow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format, addDays } from "date-fns";

interface BlockchainOperationsProps {
  invoice: Invoice;
  isClient?: boolean;
}

const BlockchainOperations = ({ invoice, isClient = false }: BlockchainOperationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { toast } = useToast();
  const { depositToEscrow, releaseFromEscrow, isDepositing, isReleasing } = useEscrow();
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);

  // Function to pay an invoice directly (non-escrow)
  const handleDirectPayment = async () => {
    if (!window.ethereum || !invoice.client?.wallet_address) {
      toast({
        title: "Error",
        description: "MetaMask not detected or recipient address missing",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(invoice.amount.toString());

      // Send transaction
      const tx = await signer.sendTransaction({
        to: invoice.client.wallet_address,
        value: amountInWei,
      });

      toast({
        title: "Payment initiated",
        description: "Transaction is being processed...",
      });

      setTxHash(tx.hash);
      await tx.wait();

      toast({
        title: "Payment successful",
        description: `You've successfully paid invoice #${invoice.invoice_number}`,
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: error.message || "Failed to send payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to pay to escrow
  const handleEscrowPayment = async () => {
    if (!invoice.client?.wallet_address) {
      toast({
        title: "Error",
        description: "Recipient wallet address missing",
        variant: "destructive",
      });
      return;
    }

    const hash = await depositToEscrow(invoice, invoice.client.wallet_address);
    if (hash) {
      setTxHash(hash);
    }
  };

  // Function to release funds from escrow
  const handleEscrowRelease = async () => {
    const hash = await releaseFromEscrow(invoice);
    if (hash) {
      setTxHash(hash);
      setShowReleaseDialog(false);
    }
  };

  // Calculate estimated release date
  const getReleaseDate = () => {
    if (invoice.escrow_release_date) {
      return new Date(invoice.escrow_release_date);
    }
    
    if (invoice.created_at && invoice.escrow_days) {
      return addDays(new Date(invoice.created_at), invoice.escrow_days);
    }
    
    return addDays(new Date(), 14); // Default 14 days
  };

  const getEscrowStatusText = () => {
    if (invoice.status === "escrow_held") {
      return `Funds in escrow until ${format(getReleaseDate(), "MMM d, yyyy")}`;
    }
    if (invoice.status === "escrow_released") {
      return "Escrow funds released";
    }
    return "";
  };

  const getExplorerUrl = (hash: string) => {
    // Default to Ethereum mainnet, but in production check the chain ID
    return `https://etherscan.io/tx/${hash}`;
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-lg font-semibold">Payment Options</h3>
      
      {invoice.escrow_enabled ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded border border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Escrow Payment</h4>
              <p className="text-sm text-amber-700">
                Funds will be held in escrow for {invoice.escrow_days || 14} days after payment before being released to the seller.
              </p>
            </div>
          </div>

          {/* Show different buttons based on invoice status */}
          {invoice.status === "pending" && (
            <Button
              onClick={handleEscrowPayment}
              disabled={isDepositing || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isDepositing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <LockIcon className="mr-2 h-4 w-4" /> Pay to Escrow
                </>
              )}
            </Button>
          )}

          {invoice.status === "escrow_held" && (
            <div className="space-y-2">
              <div className="border border-green-200 bg-green-50 rounded p-3 text-sm text-green-800">
                <p className="flex items-center">
                  <LockIcon className="h-4 w-4 mr-2" />
                  {getEscrowStatusText()}
                </p>
              </div>
              
              {/* Only show release button if user is the client */}
              {isClient && (
                <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <UnlockIcon className="mr-2 h-4 w-4" /> Release Funds Early
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Release Escrow Funds</DialogTitle>
                      <DialogDescription>
                        You're about to release funds held in escrow for invoice #{invoice.invoice_number} before the automatic release date. This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Scheduled release date: {format(getReleaseDate(), "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm font-medium">
                        Amount to release: {invoice.amount} {invoice.crypto_currency?.toUpperCase()}
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowReleaseDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleEscrowRelease}
                        disabled={isReleasing}
                        className="bg-gradient-to-r from-green-600 to-green-500"
                      >
                        {isReleasing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <UnlockIcon className="mr-2 h-4 w-4" /> Confirm Release
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}

          {invoice.status === "escrow_released" && (
            <div className="border border-green-200 bg-green-50 rounded p-3 text-sm text-green-800">
              <p className="flex items-center">
                <UnlockIcon className="h-4 w-4 mr-2" />
                Escrow funds have been released
              </p>
            </div>
          )}
        </div>
      ) : (
        // Non-escrow direct payment option
        <div>
          {invoice.status === "pending" && (
            <Button
              onClick={handleDirectPayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>Pay Now</>
              )}
            </Button>
          )}

          {invoice.status === "paid" && (
            <div className="border border-green-200 bg-green-50 rounded p-3 text-sm text-green-800">
              <p className="flex items-center">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Payment completed on {invoice.payment_date ? format(new Date(invoice.payment_date), "MMMM d, yyyy") : ""}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transaction hash display */}
      {txHash && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
          <div className="flex items-center justify-between">
            <code className="text-xs bg-gray-100 p-1 rounded">{txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}</code>
            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
            >
              View <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainOperations;
