
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
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

const InvoiceDialog = () => {
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [enableEscrow, setEnableEscrow] = useState(true);
  const [escrowDays, setEscrowDays] = useState(7);
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const { toast } = useToast();
  const { clients, isLoading: clientsLoading } = useClients();
  const { createInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const resetForm = () => {
    setTitle("");
    setClientId("");
    setCurrency("USDC");
    setDueDate(undefined);
    setDescription("");
    setEnableEscrow(true);
    setEscrowDays(7);
    setItems([{ description: "", amount: "" }]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      setIsSubmitting(true);
      
      // Calculate total amount from items
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      
      // Format the invoice data
      const invoiceData = {
        title,
        description,
        amount: totalAmount,
        currency: currency,
        crypto_currency: currency.toLowerCase() as "eth" | "usdc" | null,
        status: "pending",
        escrow_enabled: enableEscrow,
        escrow_days: enableEscrow ? escrowDays : null,
        due_date: dueDate ? dueDate.toISOString() : null,
        client_id: clientId
      };
      
      // Submit the invoice
      await createInvoice.mutateAsync(invoiceData);
      
      // Reset form
      resetForm();
      
      // Close dialog (this will be handled by the parent component)
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogDescription>
          Create and send an invoice to your client for payment in crypto.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="escrow">Enable Escrow</Label>
              <Switch 
                id="escrow" 
                checked={enableEscrow} 
                onCheckedChange={setEnableEscrow} 
              />
            </div>
            {enableEscrow && (
              <div className="mt-2">
                <Label htmlFor="escrowDays">Escrow Period (Days)</Label>
                <Input
                  id="escrowDays"
                  type="number"
                  min={1}
                  max={30}
                  value={escrowDays}
                  onChange={(e) => setEscrowDays(parseInt(e.target.value) || 7)}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {enableEscrow 
                ? `Client funds held in escrow for ${escrowDays} days`
                : "Funds will be available immediately upon payment"
              }
            </p>
          </div>
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Line Items</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addItem}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItemDescription(index, e.target.value)}
                  required
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => updateItemAmount(index, e.target.value)}
                  required
                />
              </div>
              {items.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex justify-end text-lg font-semibold">
            <span className="mr-2">Total:</span>
            <span>{calculateTotal()} {currency}</span>
          </div>
        </div>
        
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
