
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvoices } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";

// Import our existing components
import PaymentTierSelector from "./invoice/PaymentTierSelector";
import LineItems, { LineItem } from "./invoice/LineItems";
import InvoiceSummary from "./invoice/InvoiceSummary";
import { Switch } from "./ui/switch";

const InvoiceDialog = () => {
  const { toast } = useToast();
  const { clients, isLoading: clientsLoading } = useClients();
  const { createInvoice } = useInvoices();
  
  // Form state
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [selectedTier, setSelectedTier] = useState("standard");
  const [escrowEnabled, setEscrowEnabled] = useState(false);
  const [escrowDays, setEscrowDays] = useState<number | null>(14);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<LineItem[]>([
    { description: "", amount: "0" }
  ]);
  
  // Fee rates based on tier
  const feeRates: { [key: string]: number } = {
    basic: 0.02,
    standard: 0.01,
    premium: 0.005,
  };
  
  // Add line item
  const addItem = () => {
    setItems([...items, { description: "", amount: "0" }]);
  };
  
  // Remove line item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };
  
  // Update item description
  const updateItemDescription = (index: number, value: string) => {
    setItems(items.map((item, i) => (i === index ? { ...item, description: value } : item)));
  };
  
  // Update item amount
  const updateItemAmount = (index: number, value: string) => {
    setItems(items.map((item, i) => (i === index ? { ...item, amount: value } : item)));
  };
  
  // Calculate total amount
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.amount || "0"), 0);
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

  // Form validation
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !clientId || !dueDate || items.some(item => !item.description || !item.amount)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate final amount after fees
      const finalAmount = calculateFinalAmount();
      
      // Due date formatting
      const formattedDueDate = dueDate ? dueDate.toISOString() : undefined;
      
      // Create invoice data
      const invoiceData = {
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
      
      // Submit the form
      await createInvoice.mutateAsync(invoiceData);
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      // Close dialog (this will be handled by parent component)
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

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
      <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-t-lg">
        <DialogTitle className="text-2xl font-bold">Create New Invoice</DialogTitle>
        <DialogDescription>
          Create and send an invoice to your client for payment in crypto.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleFormSubmit} className="space-y-5 p-6">
        <div>
          <Label htmlFor="title" className="text-sm font-semibold mb-1.5 block">Invoice Title</Label>
          <Input
            id="title"
            placeholder="Project work - May 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="client" className="text-sm font-semibold mb-1.5 block">Client</Label>
            {clientsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading clients...</span>
              </div>
            ) : (
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name || client.email || client.wallet_address?.substring(0, 8) + '...'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-clients" disabled>
                      No clients available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div>
            <Label htmlFor="currency" className="text-sm font-semibold mb-1.5 block">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full border-gray-200">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="dueDate" className="text-sm font-semibold mb-1.5 block">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal border-gray-200",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Select due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Escrow Payment</Label>
            <Switch
              checked={escrowEnabled}
              onCheckedChange={setEscrowEnabled}
            />
          </div>
          
          {escrowEnabled && (
            <div className="pl-4 border-l-2 border-purple-200">
              <p className="text-sm text-muted-foreground mb-2">
                Escrow holds the payment until you complete the work and the client releases the funds
              </p>
              <div className="flex items-center">
                <Label htmlFor="escrowDays" className="mr-2">Hold for</Label>
                <Input
                  id="escrowDays"
                  type="number"
                  min="1"
                  max="90"
                  value={escrowDays || "14"}
                  onChange={(e) => setEscrowDays(parseInt(e.target.value))}
                  className="w-20 border-gray-200"
                />
                <span className="ml-2">days</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold block">Payment Tier</Label>
          <PaymentTierSelector 
            selectedTier={selectedTier} 
            onTierChange={setSelectedTier} 
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-sm font-semibold mb-1.5 block">Description</Label>
          <Textarea
            id="description"
            placeholder="Description of work completed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-gray-200 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
          />
        </div>
        
        <LineItems
          items={items}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateItemDescription={updateItemDescription}
          onUpdateItemAmount={updateItemAmount}
        />
        
        <InvoiceSummary
          total={calculateTotal().toString()}
          fee={calculateFee().toString()}
          finalAmount={calculateFinalAmount().toString()}
          selectedTierId={selectedTier}
          currency={currency}
        />
        
        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto border-gray-200">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Invoice"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default InvoiceDialog;
