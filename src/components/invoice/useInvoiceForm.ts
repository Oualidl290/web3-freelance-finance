
import { useState, useEffect } from "react";
import { LineItem } from "./LineItems";
import { paymentTiers } from "./PaymentTierSelector";

export const useInvoiceForm = (createInvoiceCallback: any) => {
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [enableEscrow, setEnableEscrow] = useState(true);
  const [escrowDays, setEscrowDays] = useState(7);
  const [items, setItems] = useState<LineItem[]>([{ description: "", amount: "" }]);
  const [selectedTier, setSelectedTier] = useState<string>("hodl");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update escrow days when tier changes
  useEffect(() => {
    const tier = paymentTiers.find(t => t.id === selectedTier);
    if (tier) {
      setEnableEscrow(tier.escrowDays !== null);
      if (tier.escrowDays !== null) {
        setEscrowDays(tier.escrowDays);
      }
    }
  }, [selectedTier]);
  
  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };
  
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const updateItemDescription = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].description = value;
    setItems(newItems);
  };
  
  const updateItemAmount = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].amount = value;
    setItems(newItems);
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.amount) || 0);
    }, 0).toFixed(2);
  };
  
  // Calculate fee based on selected tier
  const calculateFee = () => {
    const tier = paymentTiers.find(t => t.id === selectedTier);
    const total = parseFloat(calculateTotal());
    if (tier && !isNaN(total)) {
      return ((total * tier.fee) / 100).toFixed(2);
    }
    return "0.00";
  };
  
  // Calculate final amount after fee
  const calculateFinalAmount = () => {
    const total = parseFloat(calculateTotal());
    const fee = parseFloat(calculateFee());
    if (!isNaN(total) && !isNaN(fee)) {
      return (total - fee).toFixed(2);
    }
    return total.toFixed(2);
  };
  
  const resetForm = () => {
    setTitle("");
    setClientId("");
    setCurrency("USDC");
    setDueDate(undefined);
    setDescription("");
    setEnableEscrow(true);
    setEscrowDays(7);
    setItems([{ description: "", amount: "" }]);
    setSelectedTier("hodl");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation happens in the InvoiceDialog component
    
    try {
      setIsSubmitting(true);
      
      // Calculate total amount from items
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      
      // Get selected tier details
      const tier = paymentTiers.find(t => t.id === selectedTier);
      
      // Format the invoice data with explicit typing for status
      const invoiceData = {
        title,
        description,
        amount: totalAmount,
        currency: currency,
        crypto_currency: currency.toLowerCase() as "eth" | "usdc" | null,
        status: "pending" as "draft" | "pending" | "paid" | "escrow_held" | "escrow_released" | "canceled",
        escrow_enabled: tier?.escrowDays !== null,
        escrow_days: tier?.escrowDays || null,
        due_date: dueDate ? dueDate.toISOString() : null,
        client_id: clientId
      };
      
      // Submit the invoice
      await createInvoiceCallback.mutateAsync(invoiceData);
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    enableEscrow,
    setEnableEscrow,
    escrowDays,
    setEscrowDays,
    items,
    addItem,
    removeItem,
    updateItemDescription,
    updateItemAmount,
    selectedTier,
    setSelectedTier,
    isSubmitting,
    calculateTotal,
    calculateFee,
    calculateFinalAmount,
    handleSubmit
  };
};
