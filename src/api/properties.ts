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
  streetName?: string; // Added to match data model
  beds: number;
  baths?: number;
  living_area: number;
  livingArea?: number; // Added to match data model
  plot_area?: number;
  plotArea?: number; // Added to match data model
  type: string;
  listing_type: string;
  listingType?: string; // Added to match data model
  description: string;
  year_built?: number;
  yearBuilt?: number; // Added to match data model
  features: string[];
  additional_details?: string;
  additionalDetails?: string; // Added to match data model
  featured_image_url: string;
  featuredImageUrl?: string; // Added to match data model
  gallery_image_urls: string[];
  galleryImageUrls?: string[]; // Added to match data model
  owner_id: number;
  ownerId?: number; // Added to match data model
  latitude: number;
  longitude: number;
  postal_code?: number;
  postalCode?: number; // Added to match data model
  created_at: string;
  createdAt?: string | number; // Changed to support both string and number
  updated_at: string;
  updatedAt?: string | number; // Changed to support both string and number
  agent?: Agent;
  owner?: Agent; // Added to support components using owner
  image?: string;
  images?: string[];
  isPremium?: boolean;
}

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
    return data.map(item => {
      const property = transformPropertyData(item);
      // Ensure street_name is always present
      if (!property.street_name) {
        property.street_name = property.streetName || '';
      }
      // Ensure types are correct
      return {
        ...property,
        created_at: String(property.created_at || property.createdAt || ''),
        updated_at: String(property.updated_at || property.updatedAt || '')
      } as Property;
    });
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
    const property = transformPropertyData(data);
    // Ensure street_name is always present
    if (!property.street_name) {
      property.street_name = property.streetName || '';
    }
    // Ensure types are correct
    return {
      ...property,
      created_at: String(property.created_at || property.createdAt || ''),
      updated_at: String(property.updated_at || property.updatedAt || '')
    } as Property;
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
    minLivingArea?: number;
    maxLivingArea?: number;
    features?: string[];
    listingType?: 'sale' | 'rent' | 'construction' | 'any';
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

    // Apply living area range filter
    if (filters.minLivingArea && filters.minLivingArea > 0) {
      query = query.gte('living_area', filters.minLivingArea);
    }
    
    if (filters.maxLivingArea && filters.maxLivingArea > 0) {
      query = query.lte('living_area', filters.maxLivingArea);
    }

    // Apply listing type filter
    if (filters.listingType && filters.listingType !== 'any') {
      query = query.eq('listing_type', filters.listingType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching properties:', error);
      return [];
    }

    // Transform and filter the results
    return data
      .map(item => {
        const property = transformPropertyData(item);
        // Ensure street_name is always present
        if (!property.street_name) {
          property.street_name = property.streetName || '';
        }
        // Ensure types are correct
        return {
          ...property,
          created_at: String(property.created_at || property.createdAt || ''),
          updated_at: String(property.updated_at || property.updatedAt || '')
        } as Property;
      })
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
