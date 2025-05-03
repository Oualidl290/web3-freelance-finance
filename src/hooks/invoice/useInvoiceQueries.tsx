
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Invoice } from "@/types/invoice";

export function useInvoiceQueries() {
  const { user } = useAuth();
  
  const fetchInvoices = async () => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        client:client_id (
          id, name, email, wallet_address, client_type
        )
      `)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as Invoice[];
  };
  
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: fetchInvoices,
    enabled: !!user,
  });

  const getInvoiceById = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        client:client_id (
          id, name, email, wallet_address, client_type
        )
      `)
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data as Invoice;
  };
  
  // Filter invoices by status
  const pendingInvoices = invoices.filter(invoice => 
    invoice.status === "pending" || invoice.status === "escrow_held"
  );
  
  const paidInvoices = invoices.filter(invoice => 
    invoice.status === "paid" || invoice.status === "escrow_released"
  );
  
  const draftInvoices = invoices.filter(invoice => 
    invoice.status === "draft"
  );
  
  // Calculate totals
  const totalPendingAmount = pendingInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
  const totalPaidAmount = paidInvoices.reduce((acc, invoice) => acc + invoice.amount, 0);
  
  return {
    invoices,
    pendingInvoices,
    paidInvoices,
    draftInvoices,
    totalPendingAmount,
    totalPaidAmount,
    isLoading,
    error,
    getInvoiceById,
  };
}
