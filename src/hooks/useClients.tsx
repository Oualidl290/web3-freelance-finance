
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export type Client = {
  id: string;
  name: string | null;
  email: string | null;
  wallet_address: string | null;
  client_type: "wallet" | "email";
  created_at: string;
  updated_at: string | null;
};

export function useClients() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const fetchClients = async () => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    return data as Client[];
  };
  
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients", user?.id],
    queryFn: fetchClients,
    enabled: !!user,
  });
  
  const createClient = useMutation({
    mutationFn: async (newClient: Omit<Client, "id" | "created_at" | "updated_at">) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("clients")
        .insert({
          ...newClient,
          user_id: user.id,
        })
        .select();
        
      if (error) throw error;
      return data[0] as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", user?.id] });
      toast({
        title: "Success!",
        description: "Client added successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    },
  });
  
  return {
    clients,
    isLoading,
    error,
    createClient,
  };
}
