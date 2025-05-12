
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Transaction = {
  id: string;
  transaction_type: "payment" | "withdrawal" | "escrow_release" | "fee";
  amount: number;
  currency: "eth" | "usdc";
  fee: number | null;
  network_fee: number | null;
  destination_address: string | null;
  transaction_hash: string | null;
  tx_hash: string | null;
  from_address: string | null;
  to_address: string | null;
  status: string;
  created_at: string;
  confirmed_at: string | null;
  updated_at: string | null;
  invoice_id: string | null;
  invoice?: {
    invoice_number: string;
    title: string;
  };
};

export function useTransactions() {
  const { user } = useAuth();
  
  const fetchTransactions = async () => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        invoice:invoice_id (
          invoice_number, title
        )
      `)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as Transaction[];
  };
  
  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: fetchTransactions,
    enabled: !!user,
  });
  
  const recentTransactions = transactions.slice(0, 5);
  
  const totalPayments = transactions
    .filter(tx => tx.transaction_type === "payment")
    .reduce((acc, tx) => acc + tx.amount, 0);
    
  const totalWithdrawals = transactions
    .filter(tx => tx.transaction_type === "withdrawal")
    .reduce((acc, tx) => acc + tx.amount, 0);
  
  return {
    transactions,
    recentTransactions,
    totalPayments,
    totalWithdrawals,
    isLoading,
    error,
  };
}
