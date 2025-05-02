
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      if (!address) {
        throw new Error("No accounts found");
      }

      // Get a nonce from the server for the user to sign
      // This would typically involve a serverless function / edge function
      const nonce = generateNonce();
      
      // Request signature from user
      const message = `Sign this message to authenticate with Web3Pay: ${nonce}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // Verify the signature on the server (would be done in an edge function)
      // For now, we'll just simulate successful authentication
      
      // Store wallet address in database
      const { error } = await supabase.from('wallet_addresses').upsert({
        user_id: "placeholder_user_id", // This would be the actual user ID after auth
        address,
        blockchain: 'ethereum',
      });

      if (error) throw error;

      toast({
        title: "Wallet Connected",
        description: `Connected with address ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
      
      // In a real implementation, you would authenticate with Supabase using JWT
      // For now, we're just redirecting to show the flow
      navigate("/dashboard");
      
    } catch (error: any) {
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
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
          alt="MetaMask" 
          className="h-5 w-5 mr-2" 
        />
        {loading ? "Connecting..." : "Connect MetaMask"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Coming Soon</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" disabled className="text-gray-400 flex items-center justify-center">
          <span className="w-5 h-5 mr-2 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">C</span>
          Coinbase
        </Button>
        <Button variant="outline" disabled className="text-gray-400 flex items-center justify-center">
          <span className="w-5 h-5 mr-2 bg-purple-600 rounded-full"></span>
          WalletConnect
        </Button>
      </div>
    </div>
  );
};

export default WalletAuthForm;
