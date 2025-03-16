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

    console.log(`Found ${data.length} properties with coordinates in database`);

    // Transform each property to match the Property type
    return data.map(property => {
      const transformed = transformPropertyData(property);
      
      // Ensure numeric type for coordinates
      return {
        ...transformed,
        longitude: property.longitude !== null ? Number(property.longitude) : null,
        latitude: property.latitude !== null ? Number(property.latitude) : null,
        // Handle gallery images - ensure they're strings
        gallery_image_urls: Array.isArray(property.images) 
          ? property.images.map(img => String(img)) 
          : []
      };
    });
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
    console.log('Fetching properties with geodata');
    const { data, error } = await supabase
      .from('properties')
      .select('*');

    if (error) {
      console.error('Error fetching properties for geocoding:', error);
      return [];
    }

    console.log(`Found ${data.length} total properties, processing coordinates`);

    // Transform each property to match the Property type
    return data.map(property => {
      const transformed = transformPropertyData(property);
      
      // If coordinates exist, use them (ensure they're numbers)
      if (property.longitude !== null && property.latitude !== null) {
        return {
          ...transformed,
          longitude: Number(property.longitude),
          latitude: Number(property.latitude),
          // Handle gallery images - ensure they're strings
          gallery_image_urls: Array.isArray(property.images) 
            ? property.images.map(img => String(img)) 
            : []
        };
      }
      
      // Otherwise generate mock coordinates from the location
      const coordinates = generateCoordinatesFromLocation(property.location);
      
      return {
        ...transformed,
        // Add coordinates if generated
        longitude: coordinates ? coordinates[0] : null,
        latitude: coordinates ? coordinates[1] : null,
        // Handle gallery images - ensure they're strings
        gallery_image_urls: Array.isArray(property.images) 
          ? property.images.map(img => String(img)) 
          : []
      };
    });
  } catch (error) {
    console.error('Unexpected error getting properties with geodata:', error);
    return [];
  }
};
