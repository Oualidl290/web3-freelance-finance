
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";

const WalletAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const connectMetaMask = async () => {
    setLoading(true);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast({
          title: "MetaMask not detected",
          description: "Please install MetaMask browser extension to continue",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      if (!address) {
        throw new Error("No accounts found");
      }

      // Get the network information
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkId = parseInt(chainId, 16);
      
      // Generate a random nonce for the user to sign
      const nonce = generateNonce();
      
      // Request signature from user
      const message = `Sign this message to authenticate with Web3Pay: ${nonce}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Create a custom email based on the wallet address
      const walletEmail = `${address.toLowerCase()}@wallet.auth`;
      
      // Check if the user exists, if not sign them up
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: walletEmail,
        password: signature.substring(0, 20), // Using part of signature as password (demo only)
      });
      
      if (!authData.user) {
        // User doesn't exist, create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: walletEmail,
          password: signature.substring(0, 20), // Using part of signature as password (demo only)
          options: {
            data: {
              wallet_address: address,
              wallet_type: 'ethereum',
              chain_id: networkId
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Use the user ID from the signup response
        const userId = signUpData?.user?.id;
        
        // Check if the wallet exists in the wallets table
        const { data: existingWallet } = await supabase
          .from("wallets")
          .select("*")
          .eq("wallet_address", address)
          .maybeSingle();

        // If wallet doesn't exist, create it
        if (!existingWallet && userId) {
          // Get the balance using ethers.js
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const balance = await provider.getBalance(address);
          const etherBalance = parseFloat(ethers.utils.formatEther(balance));

          // Create a wallet record
          await supabase.from("wallets").insert({
            user_id: userId,
            wallet_address: address,
            wallet_type: "eth",
            balance: etherBalance,
            is_default: true
          });
        }
      } else {
        // User exists, check if the wallet exists in the wallets table
        const { data: existingWallet } = await supabase
          .from("wallets")
          .select("*")
          .eq("wallet_address", address)
          .maybeSingle();

        // If wallet doesn't exist, create it
        if (!existingWallet) {
          // Get the balance using ethers.js
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const balance = await provider.getBalance(address);
          const etherBalance = parseFloat(ethers.utils.formatEther(balance));

          // Create a wallet record
          await supabase.from("wallets").insert({
            user_id: authData.user.id,
            wallet_address: address,
            wallet_type: "eth",
            balance: etherBalance,
            is_default: true
          });
        }
      }

      toast({
        title: "Wallet Connected",
        description: `Connected with address ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
      
      navigate("/dashboard");
      
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate a random nonce
  const generateNonce = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Connect your Web3 wallet to sign in securely without a password
        </p>
      </div>

      <Button 
        onClick={connectMetaMask}
        disabled={loading}
        className="w-full bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
              alt="MetaMask" 
              className="h-5 w-5 mr-2" 
            />
            Connect MetaMask
          </>
        )}
      </Button>
    </div>
  );
};

export default WalletAuthForm;
