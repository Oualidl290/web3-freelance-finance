
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types/invoice";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

// ABI for a simple Escrow contract
const ESCROW_ABI = [
  "function deposit(string memory invoiceId, address freelancer) external payable",
  "function release(string memory invoiceId) external",
  "event Deposited(string indexed invoiceId, address indexed client, uint256 amount)",
  "event Released(string indexed invoiceId, address indexed freelancer, uint256 amount)"
];

export function useEscrow() {
  const [isDepositing, setIsDepositing] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get the current user

  // Function to deploy escrow contract (would normally be done once by the platform)
  const deployEscrowContract = async () => {
    // This would normally be deployed once and stored, but for demo we're using a hardcoded address
    return "0x1234567890123456789012345678901234567890"; // Replace with actual deployed contract
  };

  // Function to deposit funds into escrow
  const depositToEscrow = async (
    invoice: Invoice,
    freelancerAddress: string
  ) => {
    if (!window.ethereum || !user) {
      toast({
        title: "Error",
        description: !user ? "You must be logged in" : "MetaMask not detected",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDepositing(true);
      
      // Get contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // In a real app, get this from the database or environment
      const escrowAddress = await deployEscrowContract();
      
      const escrowContract = new ethers.Contract(
        escrowAddress,
        ESCROW_ABI,
        signer
      );
      
      // Ensure we're connected to the right network
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(invoice.amount.toString());
      
      // Deposit funds
      const tx = await escrowContract.deposit(
        invoice.id,
        freelancerAddress,
        { value: amountInWei }
      );
      
      toast({
        title: "Transaction submitted",
        description: "Please wait for confirmation...",
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Update invoice status in database
      await supabase
        .from("invoices")
        .update({
          status: "escrow_held",
          escrow_contract_address: escrowAddress,
        })
        .eq("id", invoice.id);
      
      // Record transaction
      const fromAddress = await signer.getAddress();
      await supabase.from("transactions").insert({
        invoice_id: invoice.id,
        transaction_type: "payment",
        amount: invoice.amount,
        currency: invoice.crypto_currency || "eth",
        from_address: fromAddress,
        to_address: escrowAddress,
        tx_hash: receipt.transactionHash,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        user_id: user.id // Add user_id from auth context
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      
      toast({
        title: "Funds deposited successfully",
        description: `Your payment for invoice ${invoice.invoice_number} is now in escrow.`,
      });

      return receipt.transactionHash;
    } catch (error: any) {
      console.error("Escrow deposit error:", error);
      toast({
        title: "Escrow deposit failed",
        description: error.message || "Failed to deposit funds to escrow",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsDepositing(false);
    }
  };

  // Function to release funds from escrow
  const releaseFromEscrow = async (invoice: Invoice) => {
    if (!window.ethereum || !invoice.escrow_contract_address || !user) {
      toast({
        title: "Error",
        description: !user ? "You must be logged in" : "MetaMask not detected or invalid escrow contract",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsReleasing(true);
      
      // Get contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const escrowContract = new ethers.Contract(
        invoice.escrow_contract_address,
        ESCROW_ABI,
        signer
      );
      
      // Ensure we're connected
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Release funds
      const tx = await escrowContract.release(invoice.id);
      
      toast({
        title: "Release transaction submitted",
        description: "Please wait for confirmation...",
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Update invoice status
      await supabase
        .from("invoices")
        .update({
          status: "escrow_released",
          payment_date: new Date().toISOString(),
        })
        .eq("id", invoice.id);
      
      // Record escrow release
      await supabase.from("escrow_releases").insert({
        invoice_id: invoice.id,
        release_tx_hash: receipt.transactionHash,
        released_by: (await supabase.auth.getUser()).data.user?.id,
      });
      
      // Record transaction
      const fromAddress = invoice.escrow_contract_address;
      await supabase.from("transactions").insert({
        invoice_id: invoice.id,
        transaction_type: "escrow_release",
        amount: invoice.amount,
        currency: invoice.crypto_currency || "eth",
        from_address: fromAddress,
        to_address: invoice.client?.wallet_address || "",
        tx_hash: receipt.transactionHash,
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        user_id: user.id // Add user_id from auth context
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      
      toast({
        title: "Funds released successfully",
        description: `Payment for invoice ${invoice.invoice_number} has been released.`,
      });

      return receipt.transactionHash;
    } catch (error: any) {
      console.error("Escrow release error:", error);
      toast({
        title: "Escrow release failed",
        description: error.message || "Failed to release funds from escrow",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsReleasing(false);
    }
  };

  return {
    isDepositing,
    isReleasing,
    depositToEscrow,
    releaseFromEscrow
  };
}
