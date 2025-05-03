
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { CreateInvoiceInput, Invoice } from "@/types/invoice";

export function useInvoiceMutations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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

  return {
    createInvoice,
    updateInvoiceStatus,
    releaseEscrow,
  };
}
