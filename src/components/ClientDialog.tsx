
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useClients } from "@/hooks/useClients";
import { Loader2, Mail, Wallet } from "lucide-react";

const ClientDialog = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<"email" | "wallet">("email");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createClient } = useClients();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "email" && (!name || !email)) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "wallet" && (!name || !walletAddress)) {
      toast({
        title: "Missing information",
        description: "Please provide both name and wallet address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createClient.mutateAsync({
        name,
        email: activeTab === "email" ? email : null,
        wallet_address: activeTab === "wallet" ? walletAddress : null,
        client_type: activeTab,
      });
      
      toast({
        title: "Client added successfully",
        description: "Your client has been added to your account",
      });
      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add New Client</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="email" value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "wallet")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" /> Wallet
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input
              id="name"
              placeholder="Client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <TabsContent value="email" className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="email">Client Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={activeTab === "email"}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="wallet" className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required={activeTab === "wallet"}
              />
            </div>
          </TabsContent>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Client"
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </DialogContent>
  );
};

export default ClientDialog;
