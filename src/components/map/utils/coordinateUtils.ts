
// Helper function to generate coordinates from location with better error handling
export const generateCoordsFromLocation = (location: string, id: string | number): { lat: number; lng: number } | null => {
  console.log(`[coordinateUtils] Generating coordinates for property ${id} with location: "${location}"`);
  
  try {
    if (!location) {
      console.warn(`[coordinateUtils] No location for property ${id}`);
      return null;
    }
    
    // Base coordinates for different locations
    // This is a simplified approach - in production you'd use real geocoding
    const locationMap: Record<string, [number, number]> = {
      'Algiers': [36.752887, 3.042048],
      'Paris': [48.856614, 2.352222],
      'London': [51.507351, -0.127758],
      'New York': [40.712776, -74.005974],
      'Tokyo': [35.689487, 139.691711],
      'Sydney': [-33.868820, 151.209290],
      'Dubai': [25.204849, 55.270782],
      'Rome': [41.902782, 12.496365],
      'Barcelona': [41.385063, 2.173404],
      'Berlin': [52.520008, 13.404954],
      'Madrid': [40.416775, -3.703790],
      'Lisbon': [38.722252, -9.139337],
    };
    
    // Normalize location name to handle case and trim whitespace
    const normalizedLocation = location.trim();
    
    // Try to find exact location match first
    let coords = locationMap[normalizedLocation];
    
    // If no exact match, try to find a partial match
    if (!coords) {
      // Find any location that contains our location string
      const partialMatch = Object.keys(locationMap).find(key => 
        normalizedLocation.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(normalizedLocation.toLowerCase())
      );
      
      if (partialMatch) {
        coords = locationMap[partialMatch];
      }
    }
    
    // If we have coordinates from our map, add a small random offset for visual separation
    if (coords) {
      // Add a small variance to prevent markers from stacking exactly on top of each other
      // Much smaller variance than before, just enough to separate markers visually
      const latVariance = (Math.random() - 0.5) * 0.02;  // +/- 0.01 degrees (about 1km)
      const lngVariance = (Math.random() - 0.5) * 0.02;  // +/- 0.01 degrees
      
      return {
        lat: coords[0] + latVariance,
        lng: coords[1] + lngVariance
      };
    }
    
    // If no match found, default to Algiers with a small random offset
    console.log(`[coordinateUtils] No match found for location: ${location}, defaulting to Algiers`);
    return {
      lat: 36.752887 + (Math.random() - 0.5) * 0.02,
      lng: 3.042048 + (Math.random() - 0.5) * 0.02
    };
  } catch (error) {
    console.error(`[coordinateUtils] Error generating coordinates for property ${id}:`, error);
    // Fallback to Algiers with a small random offset
    return {
      lat: 36.752887 + (Math.random() - 0.5) * 0.01,
      lng: 3.042048 + (Math.random() - 0.5) * 0.01
    };
  }
};
