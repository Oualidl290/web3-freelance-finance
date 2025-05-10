
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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

      // Generate a random nonce for the user to sign
      const nonce = generateNonce();
      
      // Request signature from user
      const message = `Sign this message to authenticate with Web3Pay: ${nonce}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      // In a real implementation, we would verify the signature on the server
      // For now, we'll attempt to sign in with the wallet address as the email
      
      // Create a custom email based on the wallet address
      const walletEmail = `${address.toLowerCase()}@wallet.auth`;
      
      // Check if the user exists, if not sign them up
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: walletEmail,
        password: signature.substring(0, 20), // Using part of signature as password (demo only)
      });
      
      if (!existingUser.user) {
        // User doesn't exist, create them
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: walletEmail,
          password: signature.substring(0, 20), // Using part of signature as password (demo only)
          options: {
            data: {
              wallet_address: address,
              wallet_type: 'ethereum',
            }
          }
        });
        
        if (signUpError) throw signUpError;
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
