
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

// Import our new components
import PaymentTierSelector from "./invoice/PaymentTierSelector";
import LineItems from "./invoice/LineItems";
import InvoiceSummary from "./invoice/InvoiceSummary";
import { useInvoiceForm } from "./invoice/useInvoiceForm";

const InvoiceDialog = () => {
  const { toast } = useToast();
  const { clients, isLoading: clientsLoading } = useClients();
  const { createInvoice } = useInvoices();
  
  // Use our custom hook for form state and handlers
  const {
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
    isSubmitting,
    calculateTotal,
    calculateFee,
    calculateFinalAmount,
    handleSubmit
  } = useInvoiceForm(createInvoice);

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
    
    // Submit the form
    await handleSubmit(e);
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogDescription>
          Create and send an invoice to your client for payment in crypto.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="title">Invoice Title</Label>
          <Input
            id="title"
            placeholder="Project work - May 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            {clientsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading clients...</span>
              </div>
            ) : (
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
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
          
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
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

        <div className="space-y-4">
          <Label>Payment Tier</Label>
          <PaymentTierSelector 
            selectedTier={selectedTier} 
            onTierChange={setSelectedTier} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description of work completed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          total={calculateTotal()}
          fee={calculateFee()}
          finalAmount={calculateFinalAmount()}
          selectedTierId={selectedTier}
          currency={currency}
        />
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
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
