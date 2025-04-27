import { supabase } from "@/integrations/supabase/client";
import { Amenity } from "@/integrations/supabase/tables";


export const amenitiesService = {
  async getAllAmenities(): Promise<Amenity[]> {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .select('*');

      if (error) {
        console.error('Error fetching amenities:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        name: item.name,
      })) || [];
    } catch (error) {
      console.error('Unexpected error fetching amenities:', error);
      return [];
    }
  },

  async addAmenity(name: string): Promise<Amenity | null> {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .insert({ id: crypto.randomUUID(), name })
        .select()
        .single();

      if (error) {
        console.error('Error adding amenity:', error);
        return null;
      }

      return data ? {
        id: data.id,
        name: data.name,
      } : null;
    } catch (error) {
      console.error('Unexpected error adding amenity:', error);
      return null;
    }
  },

  async updateAmenity(id: string, name: string): Promise<Amenity | null> {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .update({
          name,
          id: id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating amenity:', error);
        return null;
      }

      return data ? {
        id: data.id,
        name: data.name,
      } : null;
    } catch (error) {
      console.error('Unexpected error updating amenity:', error);
      return null;
    }
  },

  async deleteAmenity(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('amenities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting amenity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error deleting amenity:', error);
      return false;
    }
  }
};

export const { getAllAmenities, addAmenity, updateAmenity, deleteAmenity } = amenitiesService;