import { supabase, transformPropertyData } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Agent } from "@/api/agents";

export interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  city: string;
  street_name: string;
  streetName?: string;
  beds: number;
  baths?: number;
  living_area: number;
  livingArea?: number;
  plot_area?: number;
  plotArea?: number;
  type: string;
  listing_type: string;
  listingType?: string;
  description: string;
  year_built?: number;
  yearBuilt?: number;
  features: string[];
  additional_details?: string;
  additionalDetails?: string;
  featured_image_url: string;
  featuredImageUrl?: string;
  gallery_image_urls: string[];
  galleryImageUrls?: string[];
  owner_id: number;
  ownerId?: number;
  latitude: number;
  longitude: number;
  postal_code?: number;
  postalCode?: number;
  created_at: string;
  createdAt?: string | number;
  updated_at: string;
  updatedAt?: string | number;
  agent?: Partial<Agent>;
  owner?: Partial<Agent>;
  image?: string;
  images?: string[];
  additionalImages?: string[];
  isPremium?: boolean;
}

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }

      return data.map(item => this.transformProperty(item));
    } catch (error) {
      console.error('Unexpected error fetching properties:', error);
      return [];
    }
  },

  async getPropertyById(id: string | number): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', typeof id === 'string' ? parseInt(id, 10) : id)
        .single();

      if (error) {
        console.error(`Error fetching property with ID ${id}:`, error);
        return null;
      }

      return this.transformProperty(data);
    } catch (error) {
      console.error(`Unexpected error fetching property with ID ${id}:`, error);
      return null;
    }
  },

  async searchProperties(
    searchTerm: string = '',
    filters: {
      propertyType?: string[];
      city?: string[];
      minPrice?: number;
      maxPrice?: number;
      minBeds?: number;
      minLivingArea?: number;
      maxLivingArea?: number;
      features?: string[];
      listingType?: string[];
    } = {}
  ): Promise<Property[]> {
    try {
      let query = supabase
        .from('properties')
        .select('*');

      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      if (filters.propertyType && filters.propertyType.length > 0) {
        query = query.in('type', filters.propertyType);
      }

      if (filters.city && filters.city.length > 0) {
        query = query.in('city', filters.city);
      }

      if (filters.minBeds && filters.minBeds > 0) {
        query = query.gte('beds', filters.minBeds);
      }

      if (filters.minLivingArea && filters.minLivingArea > 0) {
        query = query.gte('living_area', filters.minLivingArea);
      }
      
      if (filters.maxLivingArea && filters.maxLivingArea > 0) {
        query = query.lte('living_area', filters.maxLivingArea);
      }

      if (filters.listingType && filters.listingType.length > 0) {
        query = query.in('listing_type', filters.listingType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error searching properties:', error);
        return [];
      }

      return data
        .map(item => this.transformProperty(item))
        .filter(property => this.filterProperty(property, filters));
    } catch (error) {
      console.error('Unexpected error searching properties:', error);
      return [];
    }
  },

  transformProperty(item: any): Property {
    const property = transformPropertyData(item);
    if (!property.street_name) {
      property.street_name = property.streetName || '';
    }
    return {
      ...property,
      created_at: String(property.created_at || property.createdAt || ''),
      updated_at: String(property.updated_at || property.updatedAt || '')
    } as unknown as Property;
  },

  filterProperty(property: Property, filters: any): boolean {
    const numericPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
    
    if (filters.minPrice && numericPrice < filters.minPrice) return false;
    if (filters.maxPrice && numericPrice > filters.maxPrice) return false;
    
    if (filters.features && filters.features.length > 0) {
      const propertyFeatures = property.features.map(f => f.toLowerCase());
      
      for (const feature of filters.features) {
        const featureLower = feature.toLowerCase();
        if (!propertyFeatures.some(pf => pf.includes(featureLower))) {
          return false;
        }
      }
    }
    
    return true;
  },

  async createProperty(property: Partial<Property>): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          beds: property.beds ?? 0,
          city: property.city ?? '',
          description: property.description ?? '',
          location: property.location ?? '',
          price: property.price ?? '',
          title: property.title ?? '',
          type: property.type ?? '',
          listing_type: property.listing_type ?? '',
          ...property,
          owner_id: property.owner_id?.toString() ?? ''
        })
        .single();
  
      if (error) throw error;
      return this.transformProperty(data);
    } catch (error) {
      console.error('Error creating property:', error);
      return null;
    }
  },
  
  async updateProperty(id: number, property: Partial<Property>): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          ...property,
          owner_id: property.owner_id?.toString() ?? null,
        })
        .eq('id', id)
        .single();

      if (error) throw error;
      return this.transformProperty(data);
    } catch (error) {
      console.error(`Error updating property with ID ${id}:`, error);
      return null;
    }
  },

  async deleteProperty(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting property with ID ${id}:`, error);
      return false;
    }
  },

  async uploadImage(file: File, prefix: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(`${prefix}-${Date.now()}-${file.name}`, file);

      if (error) throw error;
      return supabase.storage.from("property-images").getPublicUrl(data.path).data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
};

export const searchProperties = propertyService.searchProperties;