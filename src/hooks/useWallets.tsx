
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export type Wallet = {
  id: string;
  wallet_address: string;
  wallet_type: "eth" | "usdc";
  balance: number;
  is_default: boolean;
  created_at: string;
  updated_at: string | null;
};

export function useWallets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const fetchWallets = async () => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .order("is_default", { ascending: false });
      
    if (error) throw error;
    return data as Wallet[];
  };
  
  const { data: wallets = [], isLoading, error } = useQuery({
    queryKey: ["wallets", user?.id],
    queryFn: fetchWallets,
    enabled: !!user,
  });
  
  const addWallet = useMutation({
    mutationFn: async (newWallet: Omit<Wallet, "id" | "created_at" | "updated_at">) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("wallets")
        .insert({
          ...newWallet,
          user_id: user.id,
        })
        .select();
        
      if (error) throw error;
      return data[0] as Wallet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets", user?.id] });
      toast({
        title: "Success!",
        description: "Wallet added successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding wallet:", error);
      toast({
        title: "Error",
        description: "Failed to add wallet",
        variant: "destructive",
      });
    },
  });
  
  const setDefaultWallet = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      
      // First, set all wallets to non-default
      await supabase
        .from("wallets")
        .update({ is_default: false })
        .eq("user_id", user.id);
      
      // Then set the selected wallet as default
      const { data, error } = await supabase
        .from("wallets")
        .update({ is_default: true })
        .eq("id", id)
        .select();
        
      if (error) throw error;
      return data[0] as Wallet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets", user?.id] });
      toast({
        title: "Default Wallet Updated",
        description: "Your default wallet has been updated",
      });
    },
    onError: (error) => {
      console.error("Error setting default wallet:", error);
      toast({
        title: "Error",
        description: "Failed to set default wallet",
        variant: "destructive",
      });
    },
  });
  
  const defaultWallet = wallets.find(wallet => wallet.is_default) || wallets[0];
  const totalBalance = wallets.reduce((acc, wallet) => acc + (wallet.balance || 0), 0);
  
  return {
    wallets,
    defaultWallet,
    totalBalance,
    isLoading,
    error,
    addWallet,
    setDefaultWallet,
  };
}
