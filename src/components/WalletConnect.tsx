
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { ethers } from "ethers";

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const { toast } = useToast();
  
  // Check if MetaMask is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            fetchBalance(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        setIsConnected(false);
        setWalletAddress("");
        setBalance("0");
      } else {
        // Account changed
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        fetchBalance(accounts[0]);
      }
    };
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  
  const fetchBalance = async (address) => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };
  
  const handleConnect = async () => {
    setIsConnecting(true);
    
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask browser extension to continue",
        variant: "destructive",
      });
      setIsConnecting(false);
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      
      // Fetch balance
      fetchBalance(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: "Your MetaMask wallet has been successfully connected.",
      });
    } catch (error) {
      console.error("Error connecting:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    // Note: MetaMask doesn't support programmatic disconnection
    // We can only reset our app's state
    setIsConnected(false);
    setWalletAddress("");
    setBalance("0");
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from this application.",
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setHasCopied(true);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    });
    
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your Web3 wallet to receive payments directly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-center">
                Connect your wallet to receive cryptocurrency payments directly without intermediaries.
              </p>
            </div>
            
            <Button 
              onClick={handleConnect} 
              className="w-full bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 flex items-center justify-center"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              disabled={isConnecting}
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Support for additional wallets will be added soon!",
                });
              }}
            >
              Connect Other Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-md flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm text-green-700">Connected to MetaMask</p>
            </div>
            
            <div className="border rounded-md p-3">
              <p className="text-sm text-muted-foreground mb-1">Your Address</p>
              <div className="flex items-center justify-between">
                <code className="text-sm bg-muted p-1 rounded">{shortenAddress(walletAddress)}</code>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={copyToClipboard}
                  >
                    {hasCopied ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <Copy className="h-4 w-4" />
                    }
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      window.open(`https://etherscan.io/address/${walletAddress}`, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex-1 text-sm">
                <div className="font-medium">Network</div>
                <div className="text-muted-foreground">Ethereum Mainnet</div>
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium">Balance</div>
                <div className="text-muted-foreground">{parseFloat(balance).toFixed(4)} ETH</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
            onClick={handleDisconnect}
          >
            Disconnect Wallet
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WalletConnect;
