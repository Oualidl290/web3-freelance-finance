export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attachments: {
        Row: {
          content_type: string
          created_at: string | null
          file_name: string
          file_size: number
          id: string
          invoice_id: string | null
          storage_path: string
        }
        Insert: {
          content_type: string
          created_at?: string | null
          file_name: string
          file_size: number
          id?: string
          invoice_id?: string | null
          storage_path: string
        }
        Update: {
          content_type?: string
          created_at?: string | null
          file_name?: string
          file_size?: number
          id?: string
          invoice_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_type: Database["public"]["Enums"]["client_type"]
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          updated_at: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          client_type: Database["public"]["Enums"]["client_type"]
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          client_type?: Database["public"]["Enums"]["client_type"]
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          business_type: string
          created_at: string
          id: string
          location: string
          logo: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type: string
          created_at?: string
          id?: string
          location: string
          logo?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string
          created_at?: string
          id?: string
          location?: string
          logo?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_views: {
        Row: {
          id: string
          invoice_id: string | null
          ip_address: string | null
          location: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          invoice_id?: string | null
          ip_address?: string | null
          location?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          invoice_id?: string | null
          ip_address?: string | null
          location?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_views_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          crypto_amount: number | null
          crypto_currency: Database["public"]["Enums"]["wallet_type"] | null
          currency: string | null
          description: string | null
          due_date: string | null
          escrow_days: number | null
          escrow_enabled: boolean | null
          escrow_release_date: string | null
          id: string
          invoice_number: string
          payment_date: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          crypto_amount?: number | null
          crypto_currency?: Database["public"]["Enums"]["wallet_type"] | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          escrow_days?: number | null
          escrow_enabled?: boolean | null
          escrow_release_date?: string | null
          id?: string
          invoice_number: string
          payment_date?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          crypto_amount?: number | null
          crypto_currency?: Database["public"]["Enums"]["wallet_type"] | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          escrow_days?: number | null
          escrow_enabled?: boolean | null
          escrow_release_date?: string | null
          id?: string
          invoice_number?: string
          payment_date?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      link_views: {
        Row: {
          id: string
          ip_address: string | null
          link_id: string
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          link_id: string
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          link_id?: string
          user_agent?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_views_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "secure_links"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          links_limit: number | null
          links_used: number | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          links_limit?: number | null
          links_used?: number | null
          tier?: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          links_limit?: number | null
          links_used?: number | null
          tier?: Database["public"]["Enums"]["subscription_tier"] | null
          updated_at?: string
        }
        Relationships: []
      }
      secure_links: {
        Row: {
          created_at: string
          expire_at: string | null
          id: string
          max_views: number | null
          password_hash: string | null
          title: string
          updated_at: string
          url: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          expire_at?: string | null
          id?: string
          max_views?: number | null
          password_hash?: string | null
          title: string
          updated_at?: string
          url: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          expire_at?: string | null
          id?: string
          max_views?: number | null
          password_hash?: string | null
          title?: string
          updated_at?: string
          url?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: Database["public"]["Enums"]["wallet_type"]
          destination_address: string | null
          fee: number | null
          id: string
          invoice_id: string | null
          status: string | null
          transaction_hash: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency: Database["public"]["Enums"]["wallet_type"]
          destination_address?: string | null
          fee?: number | null
          id?: string
          invoice_id?: string | null
          status?: string | null
          transaction_hash?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: Database["public"]["Enums"]["wallet_type"]
          destination_address?: string | null
          fee?: number | null
          id?: string
          invoice_id?: string | null
          status?: string | null
          transaction_hash?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          is_default: boolean | null
          updated_at: string | null
          user_id: string
          wallet_address: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          user_id: string
          wallet_address: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
          wallet_type?: Database["public"]["Enums"]["wallet_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_company_by_user_id: {
        Args: { user_id_param: string }
        Returns: Json
      }
    }
    Enums: {
      client_type: "wallet" | "email"
      invoice_status:
        | "draft"
        | "pending"
        | "paid"
        | "escrow_held"
        | "escrow_released"
        | "canceled"
      subscription_tier: "free" | "pro" | "business"
      transaction_type: "payment" | "withdrawal" | "escrow_release" | "fee"
      wallet_type: "eth" | "usdc"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      client_type: ["wallet", "email"],
      invoice_status: [
        "draft",
        "pending",
        "paid",
        "escrow_held",
        "escrow_released",
        "canceled",
      ],
      subscription_tier: ["free", "pro", "business"],
      transaction_type: ["payment", "withdrawal", "escrow_release", "fee"],
      wallet_type: ["eth", "usdc"],
    },
  },
} as const
