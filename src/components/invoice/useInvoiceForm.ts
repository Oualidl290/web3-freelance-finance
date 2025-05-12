
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CreateInvoiceInput } from "@/types/invoice";
import { UseMutationResult } from "@tanstack/react-query";

type LineItem = {
  id: string;
  description: string;
  amount: number;
};

export function useInvoiceForm(createInvoice: UseMutationResult<any, Error, CreateInvoiceInput, unknown>) {
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [selectedTier, setSelectedTier] = useState("standard");
  const [escrowEnabled, setEscrowEnabled] = useState(false);
  const [escrowDays, setEscrowDays] = useState<number | null>(14);
  const [items, setItems] = useState<LineItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fee rates based on tier
  const feeRates: { [key: string]: number } = {
    basic: 0.02,
    standard: 0.01,
    premium: 0.005,
  };

  // Add line item
  const addItem = () => {
    setItems([
      ...items,
      { id: generateRandomId(), description: "", amount: 0 },
    ]);
  };

  // Remove line item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Update item description
  const updateItemDescription = (id: string, description: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, description } : item
      )
    );
  };

  // Update item amount
  const updateItemAmount = (id: string, amount: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, amount: parseFloat(amount) || 0 } : item
      )
    );
  };

  // Calculate total amount
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  // Calculate fee amount
  const calculateFee = () => {
    const total = calculateTotal();
    const feeRate = feeRates[selectedTier] || 0.01;
    return total * feeRate;
  };

  // Calculate final amount
  const calculateFinalAmount = () => {
    return calculateTotal() - calculateFee();
  };

  // Generate random ID for line items
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !clientId) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total from line items
      const total = calculateTotal();
      
      // Calculate final amount after fees
      const finalAmount = calculateFinalAmount();

      // Due date formatting
      const formattedDueDate = dueDate ? dueDate.toISOString() : undefined;

      // Create invoice data
      const invoiceData: CreateInvoiceInput = {
        title,
        description: description || null,
        amount: finalAmount,
        currency,
        crypto_currency: currency.toLowerCase() === "usdc" ? "usdc" : "eth",
        status: "draft",
        due_date: formattedDueDate,
        client_id: clientId,
        escrow_enabled: escrowEnabled,
        escrow_days: escrowEnabled ? escrowDays : null
      };

      // Call create invoice function
      await createInvoice.mutateAsync(invoiceData);
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      // Navigate to the invoices list
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return state and functions
  return {
    title,
    setTitle,
    clientId,
    setClientId,
    currency,
    setCurrency,
    dueDate,
    setDueDate,
    description,
    setDescription,
    items,
    addItem,
    removeItem,
    updateItemDescription,
    updateItemAmount,
    selectedTier,
    setSelectedTier,
    escrowEnabled,
    setEscrowEnabled,
    escrowDays,
    setEscrowDays,
    isSubmitting,
    calculateTotal,
    calculateFee,
    calculateFinalAmount,
    handleSubmit
  };
}
