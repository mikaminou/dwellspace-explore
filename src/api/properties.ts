import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyDetails, PropertyLocation, PropertyMedia, PropertyAmenities } from "@/integrations/supabase/tables";
import { propertyDetailsService } from "./propertyDetails";
import { propertyLocationService } from "./propertyLocations";
import { propertyMediaService } from "./propertyMedia";
import { propertyAmenitiesService } from "./propertyAmenities";

export interface CreatePropertyInput extends Partial<Property> {
  details?: Partial<PropertyDetails>;
  location?: Partial<PropertyLocation>;
  media?: Partial<PropertyMedia>[];
  amenities?: Partial<PropertyAmenities>[];
}

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) return null;

      // Fetch related data from other services
      const details = await propertyDetailsService.getDetailsByPropertyId(id);
      const location = await propertyLocationService.getLocationByPropertyId(id);
      const media = await propertyMediaService.getMediaByPropertyId(id);
      const amenities = await propertyAmenitiesService.getAmenitiesByPropertyId(id);

      return {
        ...data,
        details,
        location,
        media,
        amenities,
      };
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      return null;
    }
  },

  async createProperty(property: CreatePropertyInput): Promise<Property | null> {
    try {
      // Insert the main property record
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: property.title,
          description: property.description,
          type: property.type,
          price: property.price,
          currency: property.currency,
          status: property.status,
          listing_type: property.listingType,
          owner_id: property.owner_id,
        })
        .select()
        .single();

      if (error) throw error;

      if (!data) return null;

      // Delegate related inserts to other services
      if (property.details) {
        await propertyDetailsService.createDetails(data.id, property.details);
      }
      if (property.location) {
        await propertyLocationService.createLocation(data.id, property.location);
      }
      if (property.media) {
        await propertyMediaService.createMedia(data.id, property.media);
      }
      if (property.amenities) {
        await propertyAmenitiesService.createAmenities(data.id, property.amenities);
      }

      // Return the full property with related data
      return this.getPropertyById(data.id);
    } catch (error) {
      console.error('Error creating property:', error);
      return null;
    }
  },

  async updateProperty(id: string, property: CreatePropertyInput): Promise<Property | null> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          description: property.description,
          type: property.type,
          price: property.price,
          currency: property.currency,
          status: property.status,
          listing_type: property.listingType,
          owner_id: property.owner_id,
        })
        .eq('id', id);

      if (error) throw error;

      // Delegate related updates to other services
      if (property.details) {
        await propertyDetailsService.updateDetails(id, property.details);
      }
      if (property.location) {
        await propertyLocationService.updateLocation(id, property.location);
      }
      if (property.media) {
        await propertyMediaService.updateMedia(id, property.media);
      }
      if (property.amenities) {
        await propertyAmenitiesService.updateAmenities(id, property.amenities);
      }

      return this.getPropertyById(id);
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      return null;
    }
  },

  async deleteProperty(id: string): Promise<boolean> {
    try {
      // Delegate related deletions to other services
      await propertyDetailsService.deleteDetailsByPropertyId(id);
      await propertyLocationService.deleteLocationByPropertyId(id);
      await propertyMediaService.deleteMediaByPropertyId(id);
      await propertyAmenitiesService.deleteAmenitiesByPropertyId(id);

      const { error } = await supabase.from('properties').delete().eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error);
      return false;
    }
  },
};