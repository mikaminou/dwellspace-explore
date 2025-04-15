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
      profiles: {
        Row: {
          agency: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          license_number: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          agency?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          license_number?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          agency?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          license_number?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          additional_details: string | null
          amenities: Json | null
          baths: number | null
          beds: number
          city: string
          created_at: string
          currency: string | null
          description: string
          features: Json | null
          floor: number | null
          furnished: boolean | null
          id: number
          image: string | null
          images: Json | null
          latitude: number | null
          listing_type: string
          living_area: number
          location: string
          longitude: number | null
          owner_id: string
          parking: boolean | null
          plot_area: number | null
          postal_code: number | null
          price: string
          status: string | null
          street_name: string
          title: string
          total_floors: number | null
          type: string
          updated_at: string
          year_built: number | null
        }
        Insert: {
          additional_details?: string | null
          amenities?: Json | null
          baths?: number | null
          beds: number
          city: string
          created_at?: string
          currency?: string | null
          description: string
          features?: Json | null
          floor?: number | null
          furnished?: boolean | null
          id?: number
          image?: string | null
          images?: Json | null
          latitude?: number | null
          listing_type?: string
          living_area?: number
          location: string
          longitude?: number | null
          owner_id: string
          parking?: boolean | null
          plot_area?: number | null
          postal_code?: number | null
          price: string
          status?: string | null
          street_name?: string
          title: string
          total_floors?: number | null
          type: string
          updated_at?: string
          year_built?: number | null
        }
        Update: {
          additional_details?: string | null
          amenities?: Json | null
          baths?: number | null
          beds?: number
          city?: string
          created_at?: string
          currency?: string | null
          description?: string
          features?: Json | null
          floor?: number | null
          furnished?: boolean | null
          id?: number
          image?: string | null
          images?: Json | null
          latitude?: number | null
          listing_type?: string
          living_area?: number
          location?: string
          longitude?: number | null
          owner_id?: string
          parking?: boolean | null
          plot_area?: number | null
          postal_code?: number | null
          price?: string
          status?: string | null
          street_name?: string
          title?: string
          total_floors?: number | null
          type?: string
          updated_at?: string
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties_backup: {
        Row: {
          additional_details: string | null
          baths: number | null
          beds: number | null
          city: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: number | null
          image: string | null
          images: Json | null
          listing_type: string | null
          living_area: number | null
          location: string | null
          owner_id: string | null
          plot_area: number | null
          postal_code: number | null
          price: string | null
          street_name: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          year_built: number | null
        }
        Insert: {
          additional_details?: string | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: number | null
          image?: string | null
          images?: Json | null
          listing_type?: string | null
          living_area?: number | null
          location?: string | null
          owner_id?: string | null
          plot_area?: number | null
          postal_code?: number | null
          price?: string | null
          street_name?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          year_built?: number | null
        }
        Update: {
          additional_details?: string | null
          baths?: number | null
          beds?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: number | null
          image?: string | null
          images?: Json | null
          listing_type?: string | null
          living_area?: number | null
          location?: string | null
          owner_id?: string | null
          plot_area?: number | null
          postal_code?: number | null
          price?: string | null
          street_name?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          year_built?: number | null
        }
        Relationships: []
      }
      property_favorites: {
        Row: {
          property_id: number
          saved_at: string | null
          user_id: string
        }
        Insert: {
          property_id: number
          saved_at?: string | null
          user_id: string
        }
        Update: {
          property_id?: number
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_locations: {
        Row: {
          address: string
          country: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          property_id: number
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          country?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          property_id: number
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          country?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          property_id?: number
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_locations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_media: {
        Row: {
          id: string
          is_featured: boolean | null
          media_type: string
          media_url: string
          property_id: number
          uploaded_at: string | null
        }
        Insert: {
          id?: string
          is_featured?: boolean | null
          media_type: string
          media_url: string
          property_id: number
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          is_featured?: boolean | null
          media_type?: string
          media_url?: string
          property_id?: number
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          id: string
          property_id: number
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          property_id: number
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          property_id?: number
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_details: {
        Row: {
          available_from: string
          created_at: string | null
          id: string
          property_id: number
          rental_period: string
          security_deposit: number | null
          updated_at: string | null
        }
        Insert: {
          available_from: string
          created_at?: string | null
          id?: string
          property_id: number
          rental_period: string
          security_deposit?: number | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string
          created_at?: string | null
          id?: string
          property_id?: number
          rental_period?: string
          security_deposit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_details_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_city_with_lowest_property_count: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "individual" | "agent" | "admin"
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
      user_role: ["admin", "agent", "buyer", "seller"],
    },
  },
} as const
