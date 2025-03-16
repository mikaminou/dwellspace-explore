
// Helper function to generate coordinates from location with better error handling
export const generateCoordsFromLocation = (location: string, id: string | number): { lat: number; lng: number } | null => {
  try {
    if (!location) {
      console.warn(`No location for property ${id}`);
      return null;
    }
    
    // Default coordinates based on property ID for testing
    // In production, you'd use real geocoding
    const seed = String(id).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const latVariance = (seed % 100) * 0.01;
    const lngVariance = ((seed * 2) % 100) * 0.01;
    
    // Base coordinates (Algiers)
    const baseLat = 36.752887;
    const baseLng = 3.042048;
    
    return {
      lat: baseLat + latVariance - 0.5,
      lng: baseLng + lngVariance - 0.5
    };
  } catch (error) {
    console.error(`Error generating coordinates for property ${id}:`, error);
    return null;
  }
};
