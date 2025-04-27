import { supabase } from "@/integrations/supabase/client";
import { PropertyMedia } from "@/integrations/supabase/tables";

export const propertyMediaService = {
  async getMediaByPropertyId(propertyId: string): Promise<PropertyMedia[]> {
    try {
      const { data, error } = await supabase
        .from('property_media')
        .select('*')
        .eq('property_id', propertyId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching property media for property ID ${propertyId}:`, error);
      return [];
    }
  },

  async createMedia(propertyId: string, media: Partial<PropertyMedia>[]): Promise<void> {
    try {
      const mediaInserts = media.map(item => ({
        ...item,
        property_id: propertyId,
      }));

      const { error } = await supabase
        .from('property_media')
        .insert(mediaInserts);

      if (error) throw error;
    } catch (error) {
      console.error(`Error creating property media for property ID ${propertyId}:`, error);
    }
  },

  async updateMedia(propertyId: string, media: Partial<PropertyMedia>[]): Promise<void> {
    try {
      // Delete existing media
      const { error: deleteError } = await supabase
        .from('property_media')
        .delete()
        .eq('property_id', propertyId);

      if (deleteError) throw deleteError;

      // Insert new media
      await this.createMedia(propertyId, media);
    } catch (error) {
      console.error(`Error updating property media for property ID ${propertyId}:`, error);
    }
  },

  async deleteMediaByPropertyId(propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_media')
        .delete()
        .eq('property_id', propertyId);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting property media for property ID ${propertyId}:`, error);
    }
  },
};
