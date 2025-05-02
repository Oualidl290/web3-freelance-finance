
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Mail } from "lucide-react";
import WalletAuthForm from "@/components/WalletAuthForm";
import { ethers } from "ethers";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Check your email for the confirmation link.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "You have been logged in successfully.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-web3-purple to-web3-teal"></div>
            <h1 className="mt-4 text-3xl font-bold">Welcome to Web3Pay</h1>
            <p className="mt-2 text-gray-600">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" /> Email
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" /> Wallet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isSignUp && (
                        <a 
                          href="#" 
                          className="text-sm text-web3-purple hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            toast({
                              title: "Password Reset",
                              description: "Coming soon!",
                            });
                          }}
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-web3-purple to-web3-blue text-white"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button
                        className="text-web3-purple hover:underline"
                        onClick={() => setIsSignUp(false)}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        className="text-web3-purple hover:underline"
                        onClick={() => setIsSignUp(true)}
                      >
                        Create one
                      </button>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="wallet">
                <WalletAuthForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
