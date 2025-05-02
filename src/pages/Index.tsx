
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeatureList from "@/components/FeatureList";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <FeatureList />
        
        {/* How It Works Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                How Web3Pay Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Simplifying crypto payments for freelancers in three easy steps
              </p>
            </div>
            
            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-gray-200 -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Step 1 */}
                <div className="relative bg-white p-8 rounded-lg shadow-md">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-web3-purple text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-center mt-4 mb-4">Create an Invoice</h3>
                  <p className="text-gray-600 text-center">
                    Generate professional invoices with your client's details and payment milestones.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="relative bg-white p-8 rounded-lg shadow-md">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-web3-purple text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-center mt-4 mb-4">Client Pays in Crypto</h3>
                  <p className="text-gray-600 text-center">
                    Client scans QR code or clicks link to pay with their preferred cryptocurrency.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="relative bg-white p-8 rounded-lg shadow-md">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-web3-purple text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-center mt-4 mb-4">Receive Payment</h3>
                  <p className="text-gray-600 text-center">
                    Funds are sent directly to your wallet or held in escrow until work is approved.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/dashboard">
                <Button className="px-8 py-6 text-base font-medium bg-gradient-to-r from-web3-purple to-web3-blue hover:from-web3-purple hover:to-web3-teal text-white">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Testimonials (could be added in the future) */}
        
        {/* CTA Section */}
        <div className="bg-web3-blue-dark py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to get paid in crypto?
                </h2>
                <p className="mt-3 text-lg text-gray-300">
                  Join thousands of freelancers who are eliminating payment fees,
                  avoiding chargebacks, and getting paid instantly from clients worldwide.
                </p>
                <div className="mt-8">
                  <Link to="/dashboard">
                    <Button className="px-8 py-6 text-base font-medium bg-gradient-to-r from-web3-purple to-web3-teal hover:from-web3-teal hover:to-web3-purple text-white">
                      Start Free Account
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="bg-white/10 backdrop-blur rounded-lg p-6 md:p-10">
                  <blockquote>
                    <div>
                      <svg className="h-12 w-12 text-white opacity-25" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="mt-4 text-xl font-medium text-white">
                        Thanks to Web3Pay, I've eliminated 5% payment fees and now receive payments
                        from international clients instantly. The escrow feature also gave my clients peace of mind.
                      </p>
                    </div>
                    <footer className="mt-6">
                      <p className="text-base font-medium text-white">Sarah Chen</p>
                      <p className="text-base text-indigo-100">UX Designer, Singapore</p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
