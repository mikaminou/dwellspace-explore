import { supabase, transformPropertyData } from "@/integrations/supabase/client";
import { Property } from "@/api/properties";
import { toast } from "sonner";

// Function to get properties with coordinates
export const getPropertiesWithCoordinates = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .not('longitude', 'is', null)
      .not('latitude', 'is', null);

    if (error) {
      console.error('Error fetching properties with coordinates:', error);
      return [];
    }

    // Transform each property to match the Property type
    return data.map(property => ({
      ...transformPropertyData(property),
      // Ensure these properties exist to match the Property type
      featured_image_url: property.image || '',
      gallery_image_urls: property.images ? 
        (Array.isArray(property.images) ? property.images : []) : [],
    }));
  } catch (error) {
    console.error('Unexpected error fetching properties with coordinates:', error);
    return [];
  }
};

// Helper function to generate coordinates from location string
export const generateCoordinatesFromLocation = (location: string): [number, number] | null => {
  if (!location) return null;
  
  try {
    // This is a mock implementation - in production you'd use a real geocoding service
    // For testing, we'll generate random coordinates near Algiers
    const seed = location.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const latVariance = (seed % 100) * 0.01;
    const lngVariance = ((seed * 2) % 100) * 0.01;
    
    // Base coordinates (Algiers)
    const baseLat = 36.752887;
    const baseLng = 3.042048;
    
    return [
      baseLng + lngVariance - 0.5,
      baseLat + latVariance - 0.5
    ];
  } catch (error) {
    console.error(`Error generating coordinates for location ${location}:`, error);
    return null;
  }
};

// Get all properties and add coordinates if missing
export const getPropertiesWithGeodata = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) {
      console.error('Error fetching properties for geocoding:', error);
      return [];
    }

    // Transform each property to match the Property type
    return data.map(property => {
      // If coordinates exist, use them
      if (property.longitude && property.latitude) {
        return {
          ...transformPropertyData(property),
          // Ensure these properties exist to match the Property type
          featured_image_url: property.image || '',
          gallery_image_urls: property.images ? 
            (Array.isArray(property.images) ? property.images : []) : [],
        };
      }
      
      // Otherwise generate mock coordinates from the location
      const coordinates = generateCoordinatesFromLocation(property.location);
      return {
        ...transformPropertyData(property),
        // Add additional needed properties
        featured_image_url: property.image || '',
        gallery_image_urls: property.images ? 
          (Array.isArray(property.images) ? property.images : []) : [],
      };
    });
  } catch (error) {
    console.error('Unexpected error getting properties with geodata:', error);
    return [];
  }
};
