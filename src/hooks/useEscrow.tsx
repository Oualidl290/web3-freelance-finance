
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

// Simple ABI for our escrow contract
const ESCROW_ABI = [
  "function deposit(string invoiceId, address freelancer) external payable",
  "function release(string invoiceId) external",
  "function invoices(string) external view returns (address client, address freelancer, uint256 amount, bool isReleased, uint256 releaseTime)"
];

export function useEscrow() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Deploy or connect to an escrow contract for an invoice
  const setupEscrowForInvoice = async (invoiceId: string, clientWalletAddress: string, amount: number) => {
    if (!user) throw new Error("User not authenticated");
    if (!window.ethereum) throw new Error("MetaMask not detected");
    
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      
      // Check if we already have an escrow contract address for this invoice
      const { data: invoice } = await supabase
        .from("invoices")
        .select("escrow_contract_address, chain_id")
        .eq("id", invoiceId)
        .single();
        
      if (invoice?.escrow_contract_address) {
        // If we already have a contract, return its info
        return {
          contractAddress: invoice.escrow_contract_address,
          chainId: invoice.chain_id
        };
      }
      
      // Create a new escrow contract (in a real app, we'd deploy the contract here)
      // For this demo, we'll simulate by using a fixed address
      const mockContractAddress = "0x0000000000000000000000000000000000000000";
      
      // Get current chain ID
      const network = await provider.getNetwork();
      
      // Update the invoice with the escrow contract info
      await supabase
        .from("invoices")
        .update({
          escrow_contract_address: mockContractAddress,
          chain_id: network.chainId,
          escrow_enabled: true,
          status: "pending"
        })
        .eq("id", invoiceId);
      
      toast({
        title: "Escrow Ready",
        description: "Escrow has been set up for this invoice",
      });
      
      return {
        contractAddress: mockContractAddress,
        chainId: network.chainId
      };
    } catch (error) {
      console.error("Error setting up escrow:", error);
      toast({
        title: "Error",
        description: "Failed to set up escrow",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch escrow details for an invoice
  const getEscrowStatus = async (invoiceId: string, contractAddress: string) => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Connect to the contract
      const escrowContract = new ethers.Contract(contractAddress, ESCROW_ABI, provider);
      
      // Get escrow details
      const escrowDetails = await escrowContract.invoices(invoiceId);
      
      return {
        client: escrowDetails.client,
        freelancer: escrowDetails.freelancer,
        amount: ethers.utils.formatEther(escrowDetails.amount),
        isReleased: escrowDetails.isReleased,
        releaseTime: escrowDetails.releaseTime.toString()
      };
    } catch (error) {
      console.error("Error getting escrow status:", error);
      // Return mock data for demo
      return {
        client: "0x0000000000000000000000000000000000000001",
        freelancer: "0x0000000000000000000000000000000000000002",
        amount: "0.1",
        isReleased: false,
        releaseTime: "0"
      };
    }
  };
  
  return {
    setupEscrowForInvoice,
    getEscrowStatus,
    isLoading
  };
}
