
import { Invoice, CreateInvoiceInput } from "@/types/invoice";
import { useInvoiceQueries } from "@/hooks/invoice/useInvoiceQueries";
import { useInvoiceMutations } from "@/hooks/invoice/useInvoiceMutations";

export type { Invoice, CreateInvoiceInput };

export function useInvoices() {
  const {
    invoices,
    pendingInvoices,
    paidInvoices,
    draftInvoices,
    totalPendingAmount,
    totalPaidAmount,
    isLoading,
    error,
    getInvoiceById,
  } = useInvoiceQueries();

  const {
    createInvoice,
    updateInvoiceStatus,
    releaseEscrow,
  } = useInvoiceMutations();
  
  return {
    // Queries
    invoices,
    pendingInvoices,
    paidInvoices,
    draftInvoices,
    totalPendingAmount,
    totalPaidAmount,
    isLoading,
    error,
    getInvoiceById,
    
    // Mutations
    createInvoice,
    updateInvoiceStatus,
    releaseEscrow,
  };
}
