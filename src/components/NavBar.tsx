
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import ProfileDropdown from "@/components/ProfileDropdown";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-web3-purple to-web3-teal"></div>
              <span className="ml-2 text-xl font-bold text-web3-blue-dark">Web3Pay</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-web3-purple px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-web3-purple px-3 py-2 rounded-md text-sm font-medium">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-web3-purple px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-web3-purple px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                Resources
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/docs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Documentation</Link>
                <Link to="/faqs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">FAQs</Link>
                <Link to="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support</Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-web3-purple to-web3-blue text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-web3-purple hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-web3-purple hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-web3-purple hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-web3-purple hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/docs" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-web3-purple hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Documentation
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              {user ? (
                <div className="flex-shrink-0 w-full space-y-2">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="ghost">Dashboard</Button>
                  </Link>
                  <Link to="/settings/profile" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="ghost">Profile Settings</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex-shrink-0 w-full space-y-2">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="ghost">Login</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-web3-purple to-web3-blue text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
