
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
    
    // Generate EXTREMELY visible variance - creating a GLOBAL spread
    const latVariance = (seed % 100) * 1.5; // 30x the original variance 
    const lngVariance = ((seed * 2) % 100) * 1.5; // 30x the original variance
    
    // Base coordinates (center point)
    const baseLat = 36.752887;
    const baseLng = 3.042048;
    
    // Return coordinates with global spread to ensure visibility
    const coords = {
      lat: baseLat + (latVariance - 75), // Global spread (-75 to +75 degrees)
      lng: baseLng + (lngVariance - 75)  // Global spread (-75 to +75 degrees)
    };
    
    console.log(`[coordinateUtils] Final coordinates for property ${id}: lat=${coords.lat}, lng=${coords.lng}`);
    return coords;
  } catch (error) {
    console.error(`[coordinateUtils] Error generating coordinates for property ${id}:`, error);
    // Fallback coordinates with guaranteed valid values
    return {
      lat: 36.752887 + (Math.random() * 50) - 25,
      lng: 3.042048 + (Math.random() * 50) - 25
    };
  }
};
