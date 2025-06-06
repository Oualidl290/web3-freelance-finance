
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import WalletAuthForm from "@/components/WalletAuthForm";
import { Link } from "react-router-dom";

type Plan = "free" | "pro" | "enterprise";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("free");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a plan selection in location state
    if (location.state && location.state.selectedPlan) {
      setSelectedPlan(location.state.selectedPlan as Plan);
      setIsSignUp(true); // If coming from pricing page, default to signup
    }
  }, [location]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              plan: selectedPlan,
            },
          },
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

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "For individual freelancers",
      features: ["10 invoices/month", "Basic analytics", "Email support"],
    },
    {
      id: "pro",
      name: "Pro",
      description: "For growing businesses",
      features: ["Unlimited invoices", "Advanced analytics", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations",
      features: ["Custom features", "Dedicated account manager", "API access"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
              W3
            </div>
            <h1 className="mt-4 text-3xl font-bold">Welcome to Web3Pay</h1>
            <p className="mt-2 text-gray-600">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-lg">
            <Tabs defaultValue={isSignUp && !location.state?.selectedPlan ? "plan" : "email"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center rounded-tl-lg">
                  <Mail className="mr-2 h-4 w-4" /> Email
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center rounded-tr-lg">
                  <Wallet className="mr-2 h-4 w-4" /> Wallet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="p-6 space-y-6">
                {isSignUp && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Select a Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {plans.map((plan) => (
                        <div 
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id as Plan)}
                          className={`cursor-pointer p-3 rounded-md border ${
                            selectedPlan === plan.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{plan.name}</h4>
                            {selectedPlan === plan.id && (
                              <CheckCircle className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="border-gray-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isSignUp && (
                        <a 
                          href="#" 
                          className="text-sm text-purple-600 hover:underline"
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
                      className="border-gray-200"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <button
                        className="text-purple-600 hover:underline"
                        onClick={() => setIsSignUp(false)}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        className="text-purple-600 hover:underline"
                        onClick={() => setIsSignUp(true)}
                      >
                        Create one
                      </button>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="p-6">
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
