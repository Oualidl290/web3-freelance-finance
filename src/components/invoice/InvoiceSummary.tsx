
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceSummaryProps {
  total: string;
  fee: string;
  finalAmount: string;
  selectedTierId: string;
  currency: string;
}

const InvoiceSummary = ({
  total,
  fee,
  finalAmount,
  selectedTierId,
  currency
}: InvoiceSummaryProps) => {
  const tierNames = {
    basic: "Basic (2%)",
    standard: "Standard (1%)",
    premium: "Premium (0.5%)"
  };
  
  const displayedTier = tierNames[selectedTierId as keyof typeof tierNames] || tierNames.standard;
  
  const formatAmount = (amount: string) => {
    return parseFloat(amount).toFixed(6);
  };
  
  return (
    <Card className="border-gray-200">
      <CardContent className="pt-4">
        <h3 className="font-semibold mb-3">Invoice Summary</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatAmount(total)} {currency}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee ({displayedTier})</span>
            <span>-{formatAmount(fee)} {currency}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-medium">
            <span>You'll Receive</span>
            <span className="text-green-600">{formatAmount(finalAmount)} {currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSummary;
