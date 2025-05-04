
import { Clock, DollarSign, Shield, Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// Define the payment tier type
export type PaymentTier = {
  id: string;
  name: string;
  description: string;
  fee: number;
  settlementTime: string;
  escrowDays: number | null;
  icon: React.ReactNode;
};

// Define the payment tiers
export const paymentTiers: PaymentTier[] = [
  {
    id: "hodl",
    name: "HODL Mode",
    description: "0% fee, 7-day escrow (auto-release)",
    fee: 0,
    settlementTime: "7 days",
    escrowDays: 7,
    icon: <Clock className="h-5 w-5 text-emerald-500" />
  },
  {
    id: "instant",
    name: "Instant Crypto",
    description: "0.5% fee, instant settlement",
    fee: 0.5,
    settlementTime: "Instant",
    escrowDays: null,
    icon: <Zap className="h-5 w-5 text-amber-500" />
  },
  {
    id: "escrow",
    name: "Escrow Plus",
    description: "1% fee, 24-hour release after approval",
    fee: 1,
    settlementTime: "24 hours after approval",
    escrowDays: 1,
    icon: <Shield className="h-5 w-5 text-indigo-500" />
  },
  {
    id: "fiat",
    name: "Cash Out Easy",
    description: "1.5% fee, 1-3 days via Coinbase → Bank",
    fee: 1.5,
    settlementTime: "1-3 days",
    escrowDays: 3,
    icon: <DollarSign className="h-5 w-5 text-blue-500" />
  }
];

interface PaymentTierSelectorProps {
  selectedTier: string;
  onTierChange: (tierId: string) => void;
}

const PaymentTierSelector = ({ selectedTier, onTierChange }: PaymentTierSelectorProps) => {
  return (
    <div className="space-y-4">
      <RadioGroup value={selectedTier} onValueChange={onTierChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentTiers.map((tier) => (
          <div key={tier.id} className={cn(
            "flex flex-col rounded-md border border-muted p-4 cursor-pointer transition-all",
            selectedTier === tier.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
          )}
          onClick={() => onTierChange(tier.id)}
          >
            <RadioGroupItem value={tier.id} id={tier.id} className="sr-only" />
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {tier.icon}
                <span className="font-semibold">{tier.name}</span>
              </div>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                {tier.fee}% fee
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Settlement time: {tier.settlementTime}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentTierSelector;
