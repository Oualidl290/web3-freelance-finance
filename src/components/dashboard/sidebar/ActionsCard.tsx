
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, ArrowDownToLine } from "lucide-react";
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

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Upcoming Actions</CardTitle>
          <Bell className="h-4 w-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingInvoices.length > 0 ? (
          pendingInvoices
            .filter(invoice => invoice.status === "escrow_held")
            .slice(0, 2)
            .map(invoice => (
              <div key={invoice.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-amber-100 p-1.5 rounded-full">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Approve release for #{invoice.invoice_number}</p>
                  <p className="text-xs text-gray-500">Escrow period ends in {invoice.escrow_days} days</p>
                  <Button 
                    size="sm" 
                    variant="link" 
                    className="h-auto p-0 text-xs"
                    onClick={() => handleViewInvoice(invoice.id)}
                  >
                    View details
                  </Button>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center text-sm text-gray-500 py-4">
            No pending actions
          </div>
        )}

        {/* Auto-convert action (demo) */}
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-green-100 p-1.5 rounded-full">
            <ArrowDownToLine className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Convert $500 USDC to USD</p>
            <p className="text-xs text-gray-500">Auto-convert enabled</p>
            <Button 
              size="sm" 
              variant="link" 
              className="h-auto p-0 text-xs"
              onClick={() => setActiveTab("settings")}
            >
              Configure settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionsCard;
