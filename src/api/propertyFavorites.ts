import { supabase } from "@/integrations/supabase/client";
import { PropertyFavorites } from "@/integrations/supabase/tables";

export const propertyFavoritesService = {
  async getFavoritesByUserId(userId: string): Promise<PropertyFavorites[]> {
    try {
      const { data, error } = await supabase
        .from('property_favorites')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(`Error fetching property favorites for user ID ${userId}:`, error);
      return [];
    }
  },

  async addFavorite(userId: string, propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_favorites')
        .insert({
          user_id: userId,
          property_id: propertyId,
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error adding property favorite for user ID ${userId}:`, error);
    }
  },

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('property_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) throw error;
    } catch (error) {
      console.error(`Error removing property favorite for user ID ${userId}:`, error);
    }
  },
};
