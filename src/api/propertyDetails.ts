import { supabase } from "@/integrations/supabase/client";
import { PropertyDetails } from "@/integrations/supabase/tables";

export const propertyDetailsService = {
  async getDetailsByPropertyId(propertyId: string): Promise<PropertyDetails | null> {
    try {
      const { data, error } = await supabase
        .from('property_details')
        .select('*')
        .eq('property_id', propertyId)
        .single();

      if (error) throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching property details for property ID ${propertyId}:`, error);
      return null;
    }
  },

  async createDetails(propertyId: string, details: Partial<PropertyDetails>): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_details')
        .insert({
          ...details,
          property_id: propertyId,
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error creating property details for property ID ${propertyId}:`, error);
    }
  },

  async updateDetails(propertyId: string, details: Partial<PropertyDetails>): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_details')
        .upsert({
          ...details,
          property_id: propertyId,
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error updating property details for property ID ${propertyId}:`, error);
    }
  },

  async deleteDetailsByPropertyId(propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_details')
        .delete()
        .eq('property_id', propertyId);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting property details for property ID ${propertyId}:`, error);
    }
  },
};
