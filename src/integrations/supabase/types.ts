export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          lang: string | null
          listing_slug: string | null
          path: string | null
          query: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          lang?: string | null
          listing_slug?: string | null
          path?: string | null
          query?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          lang?: string | null
          listing_slug?: string | null
          path?: string | null
          query?: string | null
        }
        Relationships: []
      }
      business_claims: {
        Row: {
          admin_note: string | null
          client_key: string | null
          contact: string
          created_at: string
          id: string
          listing_id: string | null
          listing_slug: string
          name: string
          note: string | null
          proof_url: string
          role: string
          status: string
          wants: string[]
        }
        Insert: {
          admin_note?: string | null
          client_key?: string | null
          contact: string
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_slug: string
          name: string
          note?: string | null
          proof_url: string
          role: string
          status?: string
          wants?: string[]
        }
        Update: {
          admin_note?: string | null
          client_key?: string | null
          contact?: string
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_slug?: string
          name?: string
          note?: string | null
          proof_url?: string
          role?: string
          status?: string
          wants?: string[]
        }
        Relationships: []
      }
      business_submissions: {
        Row: {
          address: string | null
          admin_note: string | null
          area: string
          business_name: string
          category: string
          client_key: string | null
          contact: string
          created_at: string
          id: string
          is_owner: boolean
          name: string | null
          note: string | null
          opening_hours: string | null
          phone: string | null
          status: string
          website: string | null
        }
        Insert: {
          address?: string | null
          admin_note?: string | null
          area: string
          business_name: string
          category: string
          client_key?: string | null
          contact: string
          created_at?: string
          id?: string
          is_owner?: boolean
          name?: string | null
          note?: string | null
          opening_hours?: string | null
          phone?: string | null
          status?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          admin_note?: string | null
          area?: string
          business_name?: string
          category?: string
          client_key?: string | null
          contact?: string
          created_at?: string
          id?: string
          is_owner?: boolean
          name?: string | null
          note?: string | null
          opening_hours?: string | null
          phone?: string | null
          status?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_note: string | null
          budget_band: string | null
          business_name: string | null
          client_key: string | null
          created_at: string
          id: string
          message: string
          name: string
          page: string
          paid_amount_npr: number
          payment_status: string
          phone: string | null
          quote_amount_npr: number | null
          service_package: string | null
          source_listing_slug: string | null
          status: string
          status_changed_at: string | null
          topic: string | null
        }
        Insert: {
          admin_note?: string | null
          budget_band?: string | null
          business_name?: string | null
          client_key?: string | null
          created_at?: string
          id?: string
          message: string
          name: string
          page?: string
          paid_amount_npr?: number
          payment_status?: string
          phone?: string | null
          quote_amount_npr?: number | null
          service_package?: string | null
          source_listing_slug?: string | null
          status?: string
          status_changed_at?: string | null
          topic?: string | null
        }
        Update: {
          admin_note?: string | null
          budget_band?: string | null
          business_name?: string | null
          client_key?: string | null
          created_at?: string
          id?: string
          message?: string
          name?: string
          page?: string
          paid_amount_npr?: number
          payment_status?: string
          phone?: string | null
          quote_amount_npr?: number | null
          service_package?: string | null
          source_listing_slug?: string | null
          status?: string
          status_changed_at?: string | null
          topic?: string | null
        }
        Relationships: []
      }
      correction_reports: {
        Row: {
          client_key: string | null
          contact: string | null
          correction_type: string | null
          created_at: string
          id: string
          listing_slug: string
          whats_wrong: string
        }
        Insert: {
          client_key?: string | null
          contact?: string | null
          correction_type?: string | null
          created_at?: string
          id?: string
          listing_slug: string
          whats_wrong: string
        }
        Update: {
          client_key?: string | null
          contact?: string | null
          correction_type?: string | null
          created_at?: string
          id?: string
          listing_slug?: string
          whats_wrong?: string
        }
        Relationships: []
      }
      form_rate_log: {
        Row: {
          created_at: string
          id: number
          key_hash: string
        }
        Insert: {
          created_at?: string
          id?: number
          key_hash: string
        }
        Update: {
          created_at?: string
          id?: number
          key_hash?: string
        }
        Relationships: []
      }
      listing_promotions: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          listing_id: string
          paid_amount_npr: number
          placement: string
          quote_amount_npr: number | null
          refunded_amount_npr: number
          starts_at: string
          status: string
          target_area: string | null
          target_category: string | null
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          listing_id: string
          paid_amount_npr?: number
          placement: string
          quote_amount_npr?: number | null
          refunded_amount_npr?: number
          starts_at: string
          status?: string
          target_area?: string | null
          target_category?: string | null
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          listing_id?: string
          paid_amount_npr?: number
          placement?: string
          quote_amount_npr?: number | null
          refunded_amount_npr?: number
          starts_at?: string
          status?: string
          target_area?: string | null
          target_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_promotions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          area: string
          category: string
          city: string
          created_at: string
          data: Json
          id: string
          name: string
          slug: string
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          area: string
          category: string
          city?: string
          created_at?: string
          data?: Json
          id: string
          name: string
          slug: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          area?: string
          category?: string
          city?: string
          created_at?: string
          data?: Json
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_sales_activities: {
        Row: {
          activity_type: string
          amount_npr: number | null
          created_at: string
          created_by: string
          happened_at: string
          id: string
          prospect_id: string
          summary: string
        }
        Insert: {
          activity_type: string
          amount_npr?: number | null
          created_at?: string
          created_by?: string
          happened_at?: string
          id?: string
          prospect_id: string
          summary: string
        }
        Update: {
          activity_type?: string
          amount_npr?: number | null
          created_at?: string
          created_by?: string
          happened_at?: string
          id?: string
          prospect_id?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_sales_activities_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "business_sales_prospects"
            referencedColumns: ["id"]
          }
        ]
      }
      business_sales_prospects: {
        Row: {
          contact_channel: string
          contact_message_id: string | null
          created_at: string
          created_by: string
          id: string
          last_contacted_at: string | null
          listing_id: string | null
          next_follow_up_at: string | null
          notes: string | null
          paid_amount_npr: number
          quote_amount_npr: number | null
          service_interest: string
          stage: string
          updated_at: string
        }
        Insert: {
          contact_channel?: string
          contact_message_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          last_contacted_at?: string | null
          listing_id?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          paid_amount_npr?: number
          quote_amount_npr?: number | null
          service_interest?: string
          stage?: string
          updated_at?: string
        }
        Update: {
          contact_channel?: string
          contact_message_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          last_contacted_at?: string | null
          listing_id?: string | null
          next_follow_up_at?: string | null
          notes?: string | null
          paid_amount_npr?: number
          quote_amount_npr?: number | null
          service_interest?: string
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_sales_prospects_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_sales_prospects_contact_message_id_fkey"
            columns: ["contact_message_id"]
            isOneToOne: true
            referencedRelation: "contact_messages"
            referencedColumns: ["id"]
          }
        ]
      }
      slug_redirects: {
        Row: {
          created_at: string
          new_slug: string
          old_slug: string
        }
        Insert: {
          created_at?: string
          new_slug: string
          old_slug: string
        }
        Update: {
          created_at?: string
          new_slug?: string
          old_slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
