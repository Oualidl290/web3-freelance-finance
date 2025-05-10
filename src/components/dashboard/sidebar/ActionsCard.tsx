
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, ArrowDownToLine, Plus, FileText } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { useNavigate } from "react-router-dom";

interface ActionsCardProps {
  setActiveTab: (tab: string) => void;
}

export const ActionsCard = ({ setActiveTab }: ActionsCardProps) => {
  const { pendingInvoices } = useInvoices();
  const navigate = useNavigate();

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          <Bell className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button 
            className="w-full bg-gradient-to-r from-web3-purple to-web3-blue text-white justify-start rounded-lg"
            onClick={handleCreateInvoice}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-lg"
            onClick={() => setActiveTab("overview")}
          >
            <FileText className="mr-2 h-4 w-4" /> View All Invoices
          </Button>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <p className="text-sm font-medium mb-2">Pending Actions</p>
          {pendingInvoices.length > 0 ? (
            pendingInvoices
              .filter(invoice => invoice.status === "escrow_held" || invoice.status === "pending")
              .slice(0, 2)
              .map(invoice => (
                <div key={invoice.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleViewInvoice(invoice.id)}>
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">#{invoice.invoice_number}</p>
                    <p className="text-xs text-gray-500">
                      {invoice.status === "escrow_held" 
                        ? `Escrow period ends in ${invoice.escrow_days} days` 
                        : `Due payment ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'soon'}`}
                    </p>
                    <p className="text-xs font-medium text-web3-purple mt-1">${invoice.amount}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-sm text-gray-500 py-4 bg-gray-50 rounded-lg">
              No pending actions
            </div>
          )}
        </div>

        {/* Convert action (simplified) */}
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setActiveTab("settings")}>
          <div className="bg-green-100 p-1.5 rounded-full">
            <ArrowDownToLine className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Convert Crypto to USD</p>
            <p className="text-xs text-gray-500">Auto-convert settings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionsCard;
