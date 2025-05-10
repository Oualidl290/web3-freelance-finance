
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowDownToLine, Plus, FileText } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { DashboardTab } from "../DashboardLayout";

interface QuickActionsProps {
  setActiveTab: (tab: DashboardTab) => void;
}

const QuickActions = ({ setActiveTab }: QuickActionsProps) => {
  const { pendingInvoices } = useInvoices();
  const navigate = useNavigate();

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-web3-purple/10 to-web3-blue/5 px-4 py-3 border-b border-gray-100">
        <CardTitle className="text-base font-medium flex items-center">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Button 
            className="w-full bg-web3-purple hover:bg-web3-purple/90 text-white justify-start rounded-md"
            onClick={handleCreateInvoice}
          >
            <Plus className="mr-2 h-4 w-4" /> 
            <span>Create Invoice</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start rounded-md border-gray-200"
            onClick={() => setActiveTab("overview")}
          >
            <FileText className="mr-2 h-4 w-4" /> 
            <span>View All Invoices</span>
          </Button>
        </div>

        {pendingInvoices.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Pending Actions</p>
              {pendingInvoices.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  {pendingInvoices.length} items
                </Badge>
              )}
            </div>
            
            {pendingInvoices
              .slice(0, 2)
              .map(invoice => (
                <div 
                  key={invoice.id} 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md mb-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleViewInvoice(invoice.id)}
                >
                  <div className="bg-amber-100 p-1.5 rounded-full">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      Invoice #{invoice.invoice_number}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Due {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'soon'}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-web3-purple">
                    ${invoice.amount}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Convert action */}
        <div 
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setActiveTab("wallet")}
        >
          <div className="bg-green-100 p-1.5 rounded-full">
            <ArrowDownToLine className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Withdraw Funds</p>
            <p className="text-xs text-gray-500">Transfer to your bank</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
