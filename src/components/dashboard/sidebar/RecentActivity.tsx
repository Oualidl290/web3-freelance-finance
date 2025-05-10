
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const RecentActivity = () => {
  const { recentTransactions } = useTransactions();
  const navigate = useNavigate();

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'payment':
        return <CheckCircle className="h-4 w-4" />;
      case 'withdrawal':
        return <ArrowDownToLine className="h-4 w-4" />;
      case 'escrow_release':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch(type) {
      case 'payment':
        return 'bg-green-100 text-green-600';
      case 'withdrawal':
        return 'bg-blue-100 text-blue-600';
      case 'escrow_release':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-web3-purple/10 to-web3-blue/5 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-web3-purple p-0 h-auto hover:bg-transparent"
            onClick={() => navigate('/payments')}
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.slice(0, 4).map((transaction) => (
            <div key={transaction.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div className={`p-1.5 rounded-full ${getTransactionColor(transaction.transaction_type)}`}>
                {getTransactionIcon(transaction.transaction_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {transaction.transaction_type === 'payment' 
                    ? `Payment received for #${transaction.invoice?.invoice_number || 'Unknown'}` 
                    : transaction.transaction_type === 'withdrawal'
                      ? 'Funds withdrawn'
                      : transaction.transaction_type === 'escrow_release'
                        ? `Escrow released for #${transaction.invoice?.invoice_number || 'Unknown'}`
                        : 'Fee paid'
                  }
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                  </p>
                  <p className="text-xs font-semibold">
                    {transaction.amount} {transaction.currency.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 py-4">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
