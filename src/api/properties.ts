
import { supabase, transformPropertyData } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Agent } from "./agents";

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
  isPremium?: boolean;
}

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return data.map(item => {
      const property = transformPropertyData(item);
      if (!property.street_name) {
        property.street_name = property.streetName || '';
      }
      return {
        ...property,
        created_at: String(property.created_at || property.createdAt || ''),
        updated_at: String(property.updated_at || property.updatedAt || '')
      } as unknown as Property;
    });
  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    return [];
  }
};

export const getPropertyById = async (id: string | number): Promise<Property | null> => {
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

    const property = transformPropertyData(data);
    if (!property.street_name) {
      property.street_name = property.streetName || '';
    }
    return {
      ...property,
      created_at: String(property.created_at || property.createdAt || ''),
      updated_at: String(property.updated_at || property.updatedAt || '')
    } as unknown as Property;
  } catch (error) {
    console.error(`Unexpected error fetching property with ID ${id}:`, error);
    return null;
  }
};

export const searchProperties = async (
  searchTerm: string = '',
  filters: {
    propertyType?: string[];
    city?: string[];
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    minLivingArea?: number;
    maxLivingArea?: number;
    features?: string[];
    listingType?: string[];
  } = {}
): Promise<Property[]> => {
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
    
    if (filters.minBaths && filters.minBaths > 0) {
      query = query.gte('baths', filters.minBaths);
    }

    if (filters.minLivingArea && filters.minLivingArea > 0) {
      query = query.gte('living_area', filters.minLivingArea);
    }
    
    if (filters.maxLivingArea) {
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
      .map(item => {
        const property = transformPropertyData(item);
        if (!property.street_name) {
          property.street_name = property.streetName || '';
        }
        return {
          ...property,
          created_at: String(property.created_at || property.createdAt || ''),
          updated_at: String(property.updated_at || property.updatedAt || '')
        } as unknown as Property;
      })
      .filter(property => {
        // Apply client-side filters for price and features
        const numericPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
        
        if (filters.minPrice && numericPrice < filters.minPrice) return false;
        if (filters.maxPrice && numericPrice > filters.maxPrice) return false;
        
        if (filters.features && filters.features.length > 0) {
          const propertyFeatures = property.features.map(f => f.toLowerCase());
          
          for (const feature of filters.features) {
            const featureLower = feature.toLowerCase();
            // Check if any property feature contains the search feature
            if (!propertyFeatures.some(pf => pf.includes(featureLower))) {
              return false;
            }
          }
        }
        
        return true;
      });
  } catch (error) {
    console.error('Unexpected error searching properties:', error);
    return [];
  }
};
