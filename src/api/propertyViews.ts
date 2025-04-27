import { supabase } from "@/integrations/supabase/client";
import { PropertyViews } from "@/integrations/supabase/tables";

export const propertyViewsService = {
  // Log a property view by a profile
  async logPropertyView(userId: string, propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_views')
        .upsert({
          user_id: userId,
          property_id: propertyId,
          viewed_at: new Date().toISOString(), // Log the current timestamp
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error logging property view for user ID ${userId} and property ID ${propertyId}:`, error);
    }
  },

  // Get the view history for a specific property
  async getPropertyViewHistory(propertyId: string): Promise<PropertyViews[]> {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select('*')
        .eq('property_id', propertyId)
        .order('viewed_at', { ascending: false }); // Order by most recent views

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching view history for property ID ${propertyId}:`, error);
      return [];
    }
  },

  // Get the view history for a specific profile
  async getProfileViewHistory(userId: string): Promise<PropertyViews[]> {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false }); // Order by most recent views

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching view history for user ID ${userId}:`, error);
      return [];
    }
  },

  // Check if a profile has viewed a specific property
  async hasProfileViewedProperty(userId: string, propertyId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('property_views')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows found" error

      return !!data; // Return true if a record exists, false otherwise
    } catch (error) {
      console.error(`Error checking if user ID ${userId} has viewed property ID ${propertyId}:`, error);
      return false;
    }
  },
};
