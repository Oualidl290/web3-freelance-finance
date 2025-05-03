
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvoices, CreateInvoiceInput } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const InvoiceCreationForm = () => {
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientWallet, setClientWallet] = useState("");
  const [clientType, setClientType] = useState<"email" | "wallet">("email");
  const [title, setTitle] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [dueDate, setDueDate] = useState<Date | undefined>(addDays(new Date(), 7));
  const [description, setDescription] = useState("");
  const [enableEscrow, setEnableEscrow] = useState(true);
  const [escrowDays, setEscrowDays] = useState("7");
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createInvoice } = useInvoices();
  const { clients, createClient } = useClients();
  
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

  // Update form based on selected client
  useEffect(() => {
    if (selectedClientId && clients) {
      const selectedClient = clients.find(client => client.id === selectedClientId);
      if (selectedClient) {
        if (selectedClient.email) {
          setClientEmail(selectedClient.email);
          setClientType("email");
        }
        if (selectedClient.wallet_address) {
          setClientWallet(selectedClient.wallet_address);
          setClientType("wallet");
        }
        if (selectedClient.name) {
          setClientName(selectedClient.name);
        }
      }
    }
  }, [selectedClientId, clients]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!dueDate || items.some(item => !item.description || !item.amount)) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      let clientId = selectedClientId;
      
      // If no client is selected, create a new one
      if (!clientId) {
        if (clientType === "email" && !clientEmail) {
          toast({
            title: "Error",
            description: "Please enter client email",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        if (clientType === "wallet" && !clientWallet) {
          toast({
            title: "Error",
            description: "Please enter client wallet address",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        // Create new client
        const newClient = await createClient.mutateAsync({
          name: clientName,
          email: clientType === "email" ? clientEmail : null,
          wallet_address: clientType === "wallet" ? clientWallet : null,
          client_type: clientType
        });
        
        clientId = newClient.id;
      }
      
      // Create invoice
      const totalAmount = parseFloat(calculateTotal());
      
      // Use our new CreateInvoiceInput type
      const invoiceData: CreateInvoiceInput = {
        title: title || `Invoice for ${clientName || clientEmail || clientWallet}`,
        description,
        amount: totalAmount,
        currency: "USD",
        crypto_currency: currency === "USDC" ? "usdc" : "eth",
        status: "draft",
        client_id: clientId,
        due_date: dueDate?.toISOString(),
        escrow_enabled: enableEscrow,
        escrow_days: enableEscrow ? parseInt(escrowDays) : null,
        crypto_amount: null // Add this missing field
      };
      
      await createInvoice.mutateAsync(invoiceData);
      
      // Show success notification
      toast({
        title: "Invoice Created",
        description: "Your invoice has been created successfully",
      });
      
      // Redirect to invoices list
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
        <CardDescription>
          Generate a Web3 invoice to send to your client for payment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Client Type</Label>
              <RadioGroup defaultValue={clientType} onValueChange={(value) => setClientType(value as "email" | "wallet")} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet">Wallet Address</Label>
                </div>
              </RadioGroup>
            </div>
            
            {clients.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="existingClient">Select Existing Client (Optional)</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clients</SelectLabel>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name || client.email || client.wallet_address || "Unnamed Client"}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientType === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    placeholder="client@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    disabled={!!selectedClientId}
                  />
                </div>
              )}
              
              {clientType === "wallet" && (
                <div className="space-y-2">
                  <Label htmlFor="clientWallet">Client Wallet Address</Label>
                  <Input
                    id="clientWallet"
                    placeholder="0x..."
                    value={clientWallet}
                    onChange={(e) => setClientWallet(e.target.value)}
                    disabled={!!selectedClientId}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name (Optional)</Label>
                <Input
                  id="clientName"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={!!selectedClientId}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Invoice Title</Label>
              <Input
                id="title"
                placeholder="Project work"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
                    min="1"
                    value={escrowDays}
                    onChange={(e) => setEscrowDays(e.target.value)}
                    className="w-full mt-1"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {enableEscrow ? "Client funds will be held in escrow until you mark the work as complete." : "Funds will be available for withdrawal immediately after payment."}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Invoice Description</Label>
              <Textarea
                id="description"
                placeholder="Description of the work completed"
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
                <span>{calculateTotal()} USD ({currency})</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-apple-accent1 to-apple-accent1/80 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Invoice</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceCreationForm;
