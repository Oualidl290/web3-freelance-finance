
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Wallet } from "lucide-react";

const AuthForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
      onSuccess();
    }, 1500);
  };

  const handleConnectWallet = () => {
    // In a real app, this would connect to MetaMask or other wallets
    toast({
      title: "Wallet Connection",
      description: "MetaMask connection would open here",
      action: (
        <Button variant="outline" className="bg-amber-50 border-amber-200">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
            alt="MetaMask" 
            className="h-5 w-5 mr-2" 
          />
          Connect
        </Button>
      ),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-web3-purple hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-web3-purple to-web3-blue text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a href="#" className="text-web3-purple hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="wallet">
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Wallet className="mx-auto h-12 w-12 text-web3-purple opacity-80" />
              <h3 className="text-xl font-medium">Connect Your Wallet</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Connect with your favorite Web3 wallet to access your account securely.
              </p>
            </div>
            
            <Button 
              onClick={handleConnectWallet}
              className="w-full flex items-center justify-center space-x-2 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="h-5 w-5" 
              />
              <span>Connect MetaMask</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
