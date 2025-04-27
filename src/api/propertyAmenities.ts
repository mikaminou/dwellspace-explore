import { supabase } from "@/integrations/supabase/client";
import { PropertyAmenities } from "@/integrations/supabase/tables";

export const propertyAmenitiesService = {
  async getAmenitiesByPropertyId(propertyId: string): Promise<PropertyAmenities[]> {
    try {
      const { data, error } = await supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', propertyId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching property amenities for property ID ${propertyId}:`, error);
      return [];
    }
  },

  async createAmenities(propertyId: string, amenities: Partial<PropertyAmenities>[]): Promise<void> {
    try {
      const amenityInserts = amenities.map(item => ({
        ...item,
        property_id: propertyId,
      }));

      const { error } = await supabase
        .from('property_amenities')
        .insert(amenityInserts);

      if (error) throw error;
    } catch (error) {
      console.error(`Error creating property amenities for property ID ${propertyId}:`, error);
    }
  },

  async updateAmenities(propertyId: string, amenities: Partial<PropertyAmenities>[]): Promise<void> {
    try {
      // Delete existing amenities
      const { error: deleteError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId);

      if (deleteError) throw deleteError;

      // Insert new amenities
      await this.createAmenities(propertyId, amenities);
    } catch (error) {
      console.error(`Error updating property amenities for property ID ${propertyId}:`, error);
    }
  },

  async deleteAmenitiesByPropertyId(propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting property amenities for property ID ${propertyId}:`, error);
    }
  },
};