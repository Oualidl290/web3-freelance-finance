
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, CheckCircle, AlertCircle } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatDistanceToNow } from "date-fns";

const ActivityCard = () => {
  const { recentTransactions } = useTransactions();

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-start space-x-3">
              <div className={`p-1.5 rounded-full ${
                transaction.transaction_type === 'payment' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {transaction.transaction_type === 'payment' 
                  ? <CheckCircle className="h-4 w-4" /> 
                  : transaction.transaction_type === 'withdrawal'
                    ? <ArrowDownToLine className="h-4 w-4" />
                    : <AlertCircle className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {transaction.transaction_type === 'payment' 
                    ? `Payment received for invoice ${transaction.invoice?.invoice_number || 'Unknown'}` 
                    : transaction.transaction_type === 'withdrawal'
                      ? 'Funds withdrawn'
                      : transaction.transaction_type === 'escrow_release'
                        ? `Escrow released for invoice ${transaction.invoice?.invoice_number || 'Unknown'}`
                        : 'Fee paid'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })} • 
                  {transaction.amount} {transaction.currency.toUpperCase()}
                </p>
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

export default ActivityCard;
