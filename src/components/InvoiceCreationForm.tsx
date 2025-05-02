
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InvoiceCreationForm = () => {
  const [clientEmail, setClientEmail] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [enableEscrow, setEnableEscrow] = useState(true);
  const [items, setItems] = useState([{ description: "", amount: "" }]);
  const { toast } = useToast();
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!clientEmail || !dueDate || items.some(item => !item.description || !item.amount)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Show success notification
    toast({
      title: "Invoice Created",
      description: "Your invoice has been created and sent to the client",
    });
    
    // Reset form
    setClientEmail("");
    setInvoiceAmount("");
    setDueDate(undefined);
    setDescription("");
    setItems([{ description: "", amount: "" }]);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  placeholder="client@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
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
                <p className="text-sm text-muted-foreground">
                  Client funds will be held in escrow until you mark the work as complete.
                </p>
              </div>
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
                <span>{calculateTotal()} {currency}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline">Save Draft</Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-web3-purple to-web3-blue text-white"
            >
              Create and Send Invoice
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceCreationForm;
