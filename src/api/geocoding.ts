
/**
 * API functions for geocoding operations
 */
import { supabase } from "@/integrations/supabase/client";
import { Property } from "./properties";

// Function to get coordinates for a property
export const getPropertyCoordinates = async (propertyId: number): Promise<{ longitude: number; latitude: number } | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('longitude, latitude')
      .eq('id', propertyId)
      .single();

    if (error || !data) {
      console.error(`Error fetching coordinates for property ID ${propertyId}:`, error);
      return null;
    }

    // Check if the property has coordinates
    if (!data.longitude || !data.latitude) {
      console.warn(`Property ID ${propertyId} does not have valid coordinates`);
      return null;
    }

    return {
      longitude: Number(data.longitude),
      latitude: Number(data.latitude)
    };
  } catch (error) {
    console.error(`Unexpected error fetching coordinates for property ID ${propertyId}:`, error);
    return null;
  }
};

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

    return data.map(property => ({
      ...property,
      longitude: Number(property.longitude),
      latitude: Number(property.latitude)
    })) as Property[];
  } catch (error) {
    console.error('Unexpected error fetching properties with coordinates:', error);
    return [];
  }
};
