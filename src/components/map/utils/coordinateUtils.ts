
// Helper function to generate coordinates from location with better error handling
export const generateCoordsFromLocation = (location: string, id: string | number): { lat: number; lng: number } | null => {
  console.log(`[coordinateUtils] Generating coordinates for property ${id} with location: "${location}"`);
  
  try {
    if (!location) {
      console.warn(`[coordinateUtils] No location for property ${id}`);
      return null;
    }
    
    // Default coordinates based on property ID for testing
    // In production, you'd use real geocoding
    const seed = String(id).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    console.log(`[coordinateUtils] Generated seed for property ${id}: ${seed}`);
    
    // Generate much more visible variance - DRAMATICALLY increased the multiplier for better spread
    const latVariance = (seed % 100) * 0.2; // 4x the original variance 
    const lngVariance = ((seed * 2) % 100) * 0.2; // 4x the original variance
    
    // Base coordinates (Algiers)
    const baseLat = 36.752887;
    const baseLng = 3.042048;
    
    // Return coordinates with better variance to ensure visibility
    const coords = {
      lat: baseLat + (latVariance - 10), // Much wider spread
      lng: baseLng + (lngVariance - 10)  // Much wider spread
    };
    
    console.log(`[coordinateUtils] Final coordinates for property ${id}: lat=${coords.lat}, lng=${coords.lng}`);
    return coords;
  } catch (error) {
    console.error(`[coordinateUtils] Error generating coordinates for property ${id}:`, error);
    // Fallback coordinates with guaranteed valid values
    return {
      lat: 36.752887,
      lng: 3.042048
    };
  }
};
