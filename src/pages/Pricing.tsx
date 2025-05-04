
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const PricingTier = ({
  name,
  price,
  description,
  features,
  buttonText,
  onSelect,
  recommended = false,
  buttonVariant = "default"
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  onSelect: () => void;
  recommended?: boolean;
  buttonVariant?: "default" | "outline" | "secondary";
}) => {
  return (
    <div className={`relative rounded-xl border ${recommended ? 'border-web3-purple shadow-lg' : 'border-gray-200'} p-6 flex flex-col justify-between`}>
      {recommended && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="px-3 py-1 text-xs font-medium text-white bg-web3-purple rounded-full">
            Recommended
          </span>
        </div>
      )}
      <div>
        <h3 className="text-xl font-semibold">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="ml-1 text-gray-500">/month</span>}
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button 
        onClick={onSelect} 
        className="mt-8 w-full" 
        variant={buttonVariant}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan: string) => {
    // For now, just navigate to the dashboard
    // In a real implementation, you would save the selected plan to the user's profile
    if (user) {
      navigate("/dashboard");
    } else {
      // If user is not logged in, redirect to auth page
      navigate("/auth", { state: { selectedPlan: plan } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-1 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect plan for your business needs with flexible payment options and powerful features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <PricingTier
              name="Free"
              price="Free"
              description="Perfect for individuals and small businesses just getting started."
              features={[
                "Up to 10 invoices per month",
                "Basic invoice templates",
                "Accept crypto payments",
                "Dashboard analytics"
              ]}
              buttonText={user ? "Current Plan" : "Get Started"}
              onSelect={() => handleSelectPlan("free")}
              buttonVariant="outline"
            />
            
            <PricingTier
              name="Pro"
              price="$19"
              description="Everything you need for a growing business."
              features={[
                "Unlimited invoices",
                "Advanced invoice templates",
                "Priority support",
                "Custom branding",
                "Scheduled invoices",
                "5 team members"
              ]}
              buttonText="Choose Pro"
              onSelect={() => handleSelectPlan("pro")}
              recommended={true}
            />
            
            <PricingTier
              name="Enterprise"
              price="$49"
              description="Advanced features for larger businesses with complex needs."
              features={[
                "Everything in Pro",
                "Unlimited team members",
                "API access",
                "White-label option",
                "Dedicated account manager",
                "Custom integrations"
              ]}
              buttonText="Choose Enterprise"
              onSelect={() => handleSelectPlan("enterprise")}
              buttonVariant="outline"
            />
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="mt-8 max-w-3xl mx-auto grid gap-6">
              <div className="text-left">
                <h3 className="font-semibold text-lg">How do crypto payments work?</h3>
                <p className="mt-2 text-gray-600">We support Ethereum (ETH) and USDC payments directly to your wallet. Funds are transferred directly with minimal fees compared to traditional payment processors.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Can I change plans later?</h3>
                <p className="mt-2 text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Is there a free trial?</h3>
                <p className="mt-2 text-gray-600">We offer a 14-day free trial on all paid plans. No credit card required to start.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
