
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Copy, Check, ExternalLink } from "lucide-react";

const WalletConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  
  // This would be the user's wallet address in a real app
  const mockWalletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const shortenedAddress = `${mockWalletAddress.substring(0, 6)}...${mockWalletAddress.substring(mockWalletAddress.length - 4)}`;
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    }, 1500);
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockWalletAddress);
    setHasCopied(true);
    
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    });
    
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
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
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="h-5 w-5 mr-2" 
              />
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
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
                <code className="text-sm bg-muted p-1 rounded">{shortenedAddress}</code>
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
                      window.open(`https://etherscan.io/address/${mockWalletAddress}`, '_blank');
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
                <div className="text-muted-foreground">0.85 ETH</div>
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
