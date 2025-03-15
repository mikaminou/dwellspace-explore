
import { supabase } from "@/integrations/supabase/client";

export type Property = {
  id: number;
  title: string;
  price: string;
  location: string;
  city: string;
  beds: number;
  baths: number;
  area: number;
  type: string;
  description: string;
  year_built: number;
  features: string[];
  additional_details: string;
  featured_image_url: string;
  gallery_image_urls: string[];
  agent_id: string;
  created_at: string;
  updated_at: string;
};

// Function to get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, agent:agents(*)');

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    // Transform the JSONB array to a proper JS array for features
    return data.map((property: any) => ({
      ...property,
      features: property.features || [],
      gallery_image_urls: property.gallery_image_urls || [],
    }));
  } catch (error) {
    console.error('Unexpected error fetching properties:', error);
    return [];
  }
};

// Function to get a property by ID
export const getPropertyById = async (id: string | number): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*, agent:agents(*)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      return null;
    }

    // Transform the JSONB array to a proper JS array for features
    return {
      ...data,
      features: data.features || [],
      gallery_image_urls: data.gallery_image_urls || [],
    };
  } catch (error) {
    console.error(`Unexpected error fetching property with ID ${id}:`, error);
    return null;
  }
};

// Function to search properties
export const searchProperties = async (
  searchTerm: string = '',
  filters: {
    propertyType?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    features?: string[];
  } = {}
): Promise<Property[]> => {
  try {
    let query = supabase
      .from('properties')
      .select('*, agent:agents(*)');

    // Apply search term filter (search in title, location, or description)
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    // Apply property type filter
    if (filters.propertyType && filters.propertyType !== 'any') {
      query = query.eq('type', filters.propertyType);
    }

    // Apply city filter
    if (filters.city && filters.city !== 'any') {
      query = query.eq('city', filters.city);
    }

    // Apply minimum bedrooms filter
    if (filters.minBeds && filters.minBeds > 0) {
      query = query.gte('beds', filters.minBeds);
    }

    // We cannot directly filter on price because it's stored as a string with currency
    // So we'll filter on the client side for price

    const { data, error } = await query;

    if (error) {
      console.error('Error searching properties:', error);
      return [];
    }

    // Apply price filtering on the client side and transform the data
    return data
      .filter(property => {
        // Extract numeric value from price string
        const numericPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
        
        // Check if price is within range
        if (filters.minPrice && numericPrice < filters.minPrice) return false;
        if (filters.maxPrice && numericPrice > filters.maxPrice) return false;
        
        // Check features if we're filtering by them
        if (filters.features && filters.features.length > 0) {
          // Convert features to lowercase for case-insensitive matching
          const propertyFeatures = (property.features || []).map((f: string) => f.toLowerCase());
          
          // Check if all required features exist
          for (const feature of filters.features) {
            const featureLower = feature.toLowerCase();
            // Check if any property feature contains the search feature
            if (!propertyFeatures.some(pf => pf.includes(featureLower))) {
              return false;
            }
          }
        }
        
        return true;
      })
      .map((property: any) => ({
        ...property,
        features: property.features || [],
        gallery_image_urls: property.gallery_image_urls || [],
      }));
  } catch (error) {
    console.error('Unexpected error searching properties:', error);
    return [];
  }
};
