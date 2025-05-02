
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, DollarSign, Lock, Globe, RefreshCcw, FileText } from "lucide-react";

const features = [
  {
    title: "Self-Custody Invoicing",
    description: "Send invoices in USDC, ETH, or BTC directly to your wallet, with no third-party holding your funds.",
    icon: <Wallet className="h-8 w-8 text-web3-purple" />
  },
  {
    title: "Lower Transaction Fees",
    description: "Save up to 80% on fees compared to traditional payment processors like PayPal and Stripe.",
    icon: <DollarSign className="h-8 w-8 text-web3-purple" />
  },
  {
    title: "Escrow Protection",
    description: "Secure payments in smart contract escrow until work is completed and approved by both parties.",
    icon: <Lock className="h-8 w-8 text-web3-purple" />
  },
  {
    title: "Global Payments",
    description: "Send and receive payments from anywhere in the world without currency conversion fees or delays.",
    icon: <Globe className="h-8 w-8 text-web3-purple" />
  },
  {
    title: "Fiat On/Off Ramps",
    description: "Easily convert your crypto payments to traditional currency and withdraw to your bank account.",
    icon: <RefreshCcw className="h-8 w-8 text-web3-purple" />
  },
  {
    title: "Professional Invoices",
    description: "Create beautiful, professional invoices with your branding that clients can pay with crypto or credit card.",
    icon: <FileText className="h-8 w-8 text-web3-purple" />
  }
];

const FeatureList = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How Web3Pay Solves Freelancer Payment Problems
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Get paid faster, more securely, and with lower fees than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border border-gray-200">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureList;
