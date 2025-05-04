
import { paymentTiers } from "./PaymentTierSelector";

interface InvoiceSummaryProps {
  total: string;
  fee: string;
  finalAmount: string;
  selectedTierId: string;
  currency: string;
}

const InvoiceSummary = ({ total, fee, finalAmount, selectedTierId, currency }: InvoiceSummaryProps) => {
  const selectedTier = paymentTiers.find(t => t.id === selectedTierId);
  
  return (
    <div className="rounded-md border border-muted p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Subtotal:</span>
        <span>{total} {currency}</span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Fee ({selectedTier?.fee}%):</span>
        <span>-{fee} {currency}</span>
      </div>
      <div className="border-t pt-2 flex justify-between font-semibold">
        <span>You receive:</span>
        <span>{finalAmount} {currency}</span>
      </div>
    </div>
  );
};

export default InvoiceSummary;
