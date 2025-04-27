import { supabase } from "@/integrations/supabase/client";
import { PropertyLocation } from "@/integrations/supabase/tables";

export const propertyLocationService = {
  async getLocationByPropertyId(propertyId: string): Promise<PropertyLocation | null> {
    try {
      const { data, error } = await supabase
        .from('property_locations')
        .select('*')
        .eq('property_id', propertyId)
        .single();

      if (error) throw error;

      return data || null;
    } catch (error) {
      console.error(`Error fetching property location for property ID ${propertyId}:`, error);
      return null;
    }
  },

  async createLocation(propertyId: string, location: Partial<PropertyLocation>): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_locations')
        .insert({
          ...location,
          property_id: propertyId,
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error creating property location for property ID ${propertyId}:`, error);
    }
  },

  async updateLocation(propertyId: string, location: Partial<PropertyLocation>): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_locations')
        .upsert({
          ...location,
          property_id: propertyId,
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error updating property location for property ID ${propertyId}:`, error);
    }
  },

  async deleteLocationByPropertyId(propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_locations')
        .delete()
        .eq('property_id', propertyId);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting property location for property ID ${propertyId}:`, error);
    }
  },
};
