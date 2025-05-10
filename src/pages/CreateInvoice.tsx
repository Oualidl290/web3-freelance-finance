
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const CreateInvoice = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since we're handling invoice creation in a dialog now
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-web3-purple" />
      <p className="mt-4 text-lg">Redirecting to dashboard...</p>
    </div>
  );
};

export default CreateInvoice;
