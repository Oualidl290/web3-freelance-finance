
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
  chain_id: number | null;
  escrow_contract_address: string | null;
  client: {
    id: string;
    name: string | null;
    email: string | null;
    wallet_address: string | null;
    client_type: "wallet" | "email";
  } | null;
}

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
  chain_id?: number | null;
  escrow_contract_address?: string | null;
}
