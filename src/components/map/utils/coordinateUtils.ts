
import { generateCoordinatesFromLocation } from "@/api/geocoding";

// Helper function to generate coordinates from location with better error handling
export const generateCoordsFromLocation = (location: string, id: string | number): { lat: number; lng: number } | null => {
  try {
    if (!location) {
      console.warn(`No location for property ${id}`);
      return null;
    }
    
    // Use the geocoding function to get coordinates
    const coords = generateCoordinatesFromLocation(location);
    
    if (!coords || coords.length !== 2) {
      console.warn(`Invalid coordinates generated for property ${id}`);
      return null;
    }
    
    // Return in the format expected by the map functions
    return {
      lng: coords[0],
      lat: coords[1]
    };
  } catch (error) {
    console.error(`Error generating coordinates for property ${id}:`, error);
    return null;
  }
};
