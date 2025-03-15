import { supabase, transformPropertyData } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Agent } from "./agents";

export type Property = {
  id: number;
  title: string;
  price: string;
  location: string;
  city: string;
  beds: number;
  baths: number | null;
  area: number | null;
  type: string;
  description: string;
  year_built: number | null;
  features: string[];
  additional_details: string | null;
  featured_image_url: string;
  gallery_image_urls: string[];
  agent_id: string;
  created_at: string;
  updated_at: string;
  // Include the agent property for type compatibility with existing code
  agent?: Agent;
};

// Function to get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    // Transform and normalize the data
    return data.map(transformPropertyData);
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
      .select('*')
      .eq('id', typeof id === 'string' ? parseInt(id, 10) : id)
      .single();

    if (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      return null;
    }

    // Transform the data to ensure consistent property structure
    return transformPropertyData(data);
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
      .select('*');

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

    const { data, error } = await query;

    if (error) {
      console.error('Error searching properties:', error);
      return [];
    }

    // Transform and filter the results
    return data
      .map(transformPropertyData)
      .filter(property => {
        // Extract numeric value from price string
        const numericPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
        
        // Check if price is within range
        if (filters.minPrice && numericPrice < filters.minPrice) return false;
        if (filters.maxPrice && numericPrice > filters.maxPrice) return false;
        
        // Check features if we're filtering by them
        if (filters.features && filters.features.length > 0) {
          // Convert features to lowercase for case-insensitive matching
          const propertyFeatures = property.features.map(f => f.toLowerCase());
          
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
      });
  } catch (error) {
    console.error('Unexpected error searching properties:', error);
    return [];
  }
};
