
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export type Invoice = {
  id: string;
  invoice_number: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  crypto_amount: number | null;
  crypto_currency: "eth" | "usdc" | null;
  status: "draft" | "pending" | "paid" | "escrow_held" | "escrow_released" | "canceled";
  escrow_enabled: boolean;
  escrow_days: number | null;
  escrow_release_date: string | null;
  payment_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string | null;
  client: {
    id: string;
    name: string | null;
    email: string | null;
    wallet_address: string | null;
    client_type: "wallet" | "email";
  } | null;
}

// Define a type for creating a new invoice that matches Supabase table structure
export type CreateInvoiceInput = {
  title: string;
  description?: string | null;
  amount: number;
  currency?: string;
  crypto_amount?: number | null;
  crypto_currency?: "eth" | "usdc" | null;
  status?: "draft" | "pending" | "paid" | "escrow_held" | "escrow_released" | "canceled";
  escrow_enabled?: boolean;
  escrow_days?: number | null;
  due_date?: string | null;
  client_id?: string;
}

export function useInvoices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
  
  const createInvoice = useMutation({
    mutationFn: async (newInvoice: CreateInvoiceInput) => {
      if (!user) throw new Error("User not authenticated");
      
      // Transform our input data to match what Supabase expects
      const invoiceData = {
        user_id: user.id,
        title: newInvoice.title,
        description: newInvoice.description || null,
        amount: newInvoice.amount,
        currency: newInvoice.currency || "USD",
        crypto_amount: newInvoice.crypto_amount || null,
        crypto_currency: newInvoice.crypto_currency || null,
        status: newInvoice.status || "draft",
        escrow_enabled: newInvoice.escrow_enabled || false,
        escrow_days: newInvoice.escrow_days || null,
        due_date: newInvoice.due_date || null,
        client_id: newInvoice.client_id
      };
      
      // Note: invoice_number is generated automatically by a database trigger
      const { data, error } = await supabase
        .from("invoices")
        .insert(invoiceData)
        .select(`
          *,
          client:client_id (
            id, name, email, wallet_address, client_type
          )
        `);
        
      if (error) throw error;
      return data[0] as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
      toast({
        title: "Success!",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    },
  });
  
  const updateInvoiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Invoice["status"] }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("invoices")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(`
          *,
          client:client_id (
            id, name, email, wallet_address, client_type
          )
        `);
        
      if (error) throw error;
      return data[0] as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
      toast({
        title: "Status Updated",
        description: `Invoice #${data.invoice_number} is now ${data.status}`,
      });
    },
    onError: (error) => {
      console.error("Error updating invoice status:", error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    },
  });
  
  const releaseEscrow = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("invoices")
        .update({ 
          status: "escrow_released", 
          escrow_release_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select(`
          *,
          client:client_id (
            id, name, email, wallet_address, client_type
          )
        `);
        
      if (error) throw error;
      return data[0] as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices", user?.id] });
      toast({
        title: "Escrow Released",
        description: `Funds from Invoice #${data.invoice_number} have been released`,
      });
    },
    onError: (error) => {
      console.error("Error releasing escrow:", error);
      toast({
        title: "Error",
        description: "Failed to release escrow",
        variant: "destructive",
      });
    },
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
  
  const pendingInvoices = invoices.filter(invoice => 
    invoice.status === "pending" || invoice.status === "escrow_held"
  );
  
  const paidInvoices = invoices.filter(invoice => 
    invoice.status === "paid" || invoice.status === "escrow_released"
  );
  
  const draftInvoices = invoices.filter(invoice => 
    invoice.status === "draft"
  );
  
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
    createInvoice,
    updateInvoiceStatus,
    releaseEscrow,
    getInvoiceById,
  };
}
