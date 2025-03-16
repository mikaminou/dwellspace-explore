
// Helper function to generate coordinates from location with better error handling
export const generateCoordsFromLocation = (location: string, id: string | number): { lat: number; lng: number } | null => {
  console.log(`[coordinateUtils] Generating coordinates for property ${id} with location: "${location}"`);
  
  try {
    if (!location) {
      console.warn(`[coordinateUtils] No location for property ${id}`);
      return null;
    }
    
    // Base coordinates for different cities - using realistic coordinates
    const cityCoordinates: Record<string, [number, number]> = {
      'Algiers': [36.7538, 3.0588],
      'Oran': [35.6969, -0.6331],
      'Constantine': [36.3650, 6.6147],
      'Annaba': [36.9000, 7.7667],
      'Blida': [36.4703, 2.8277],
      'Batna': [35.5553, 6.1742],
      'Setif': [36.1898, 5.4108],
      'Sidi Bel Abbes': [35.1892, -0.6306],
      'Biskra': [34.8500, 5.7333],
      'Tebessa': [35.4000, 8.1167],
      'Tizi Ouzou': [36.7169, 4.0497],
      'Bejaia': [36.7539, 5.0843],
      'Tiaret': [35.3706, 1.3195],
      'Tlemcen': [34.8828, -1.3167],
      // Fallback international cities
      'Paris': [48.8566, 2.3522],
      'London': [51.5074, -0.1278],
      'New York': [40.7128, -74.0060],
      'Dubai': [25.2048, 55.2708],
      'Tokyo': [35.6762, 139.6503],
      'Berlin': [52.5200, 13.4050]
    };
    
    // Clean location string
    const cleanLocation = location.trim();
    
    // Try to find exact location match first
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      // Check if location contains city name (case insensitive)
      if (cleanLocation.toLowerCase().includes(city.toLowerCase())) {
        // Add a very small random offset (within ~300m) to prevent markers from stacking
        const latVariance = (Math.random() - 0.5) * 0.005; // ~300m north/south
        const lngVariance = (Math.random() - 0.5) * 0.005; // ~300m east/west
        
        return {
          lat: coords[0] + latVariance,
          lng: coords[1] + lngVariance
        };
      }
    }
    
    // If no match found, default to Algiers with a small random offset
    console.log(`[coordinateUtils] No match found for location: ${location}, defaulting to Algiers`);
    const defaultCoords = cityCoordinates['Algiers'];
    return {
      lat: defaultCoords[0] + (Math.random() - 0.5) * 0.005,
      lng: defaultCoords[1] + (Math.random() - 0.5) * 0.005
    };
  } catch (error) {
    console.error(`[coordinateUtils] Error generating coordinates for property ${id}:`, error);
    // Fallback to Algiers with a small random offset
    return {
      lat: 36.7538 + (Math.random() - 0.5) * 0.005,
      lng: 3.0588 + (Math.random() - 0.5) * 0.005
    };
  }
};
