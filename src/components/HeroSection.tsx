
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, RefreshCw } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="wave-bg absolute inset-0 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-6">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
              <span className="block">Web3 Payments for</span>
              <span className="gradient-text block">Modern Freelancers</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Reduce fees, eliminate chargebacks, and send global payments instantly. The future of freelance finance is here.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <Link to="/dashboard">
                  <Button className="w-full px-8 py-6 text-base font-medium bg-gradient-to-r from-web3-purple to-web3-blue hover:from-web3-purple hover:to-web3-teal text-white">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Button variant="outline" className="w-full px-8 py-6 text-base">
                  How It Works
                </Button>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-5 w-5 mr-1 text-web3-purple" />
                <span>Self-custody payments</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Zap className="h-5 w-5 mr-1 text-web3-purple" />
                <span>Instant settlement</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <RefreshCw className="h-5 w-5 mr-1 text-web3-purple" />
                <span>Auto-convert to fiat</span>
              </div>
            </div>
          </div>
          <div className="mt-12 relative lg:mt-0 lg:col-span-5 xl:col-span-6">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white sm:rounded-lg overflow-hidden">
                <img className="w-full" src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" alt="Web3 Finance Dashboard" />
                <div className="absolute inset-0 bg-web3-blue-dark bg-opacity-30 flex items-center justify-center">
                  <Button className="text-white bg-gradient-to-r from-web3-purple to-web3-teal">
                    See Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
