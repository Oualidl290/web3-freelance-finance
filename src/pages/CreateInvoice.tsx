
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import InvoiceCreationForm from "@/components/InvoiceCreationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateInvoice = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" className="flex items-center text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
            <p className="text-muted-foreground">
              Fill out the form below to generate a new crypto invoice.
            </p>
          </div>
          
          <InvoiceCreationForm />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateInvoice;
