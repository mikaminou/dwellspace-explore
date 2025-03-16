
import { Property } from "@/api/properties";

// Helper function to generate slightly varied coordinates for properties in the same city
export function generateVariedCoordinates(baseCoords: [number, number], propertyId: number): [number, number] {
  // Use the property ID to create a deterministic but varied position
  // This creates a spiral-like pattern around the base coordinates
  const angle = (propertyId % 20) * (Math.PI / 10); // 20 positions in a circle
  const radius = 0.001 + (propertyId % 5) * 0.0005; // Varying distances from center (100m-300m)
  
  return [
    baseCoords[0] + radius * Math.cos(angle),
    baseCoords[1] + radius * Math.sin(angle)
  ];
}

// Format price for display
export function formatPrice(price: string | number | undefined): string {
  if (!price) return 'N/A';
  
  try {
    // Convert string price to number
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price;
    
    if (isNaN(numericPrice)) return 'N/A';
    
    // Format based on magnitude
    if (numericPrice >= 1000000) {
      return `$${(numericPrice / 1000000).toFixed(1)}M`;
    } else if (numericPrice >= 1000) {
      return `$${Math.round(numericPrice / 1000)}K`;
    }
    
    return `$${numericPrice.toLocaleString()}`;
  } catch (error) {
    console.error('Error formatting price:', error);
    return String(price);
  }
}

// Get city coordinates (focused on Algeria)
export function getCityCoordinates(cityName: string): [number, number] | null {
  if (!cityName) return null;
  
  const normalizedCity = cityName.trim().toLowerCase();
  
  const cityCoords: Record<string, [number, number]> = {
    // Algeria
    'algiers': [36.7538, 3.0588],
    'oran': [35.6969, -0.6331],
    'constantine': [36.3650, 6.6147],
    'annaba': [36.9000, 7.7667],
    'batna': [35.5553, 6.1742],
    'setif': [36.1898, 5.4108],
    'blida': [36.4703, 2.8277],
    'tlemcen': [34.8828, -1.3167],
    'bejaia': [36.7539, 5.0843],
    'tizi ouzou': [36.7169, 4.0497],
    'biskra': [34.8500, 5.7333],
    'tiaret': [35.3706, 1.3195],
    'sidi bel abbes': [35.1892, -0.6306],
    'tebessa': [35.4000, 8.1167]
  };
  
  // Try direct match
  if (cityCoords[normalizedCity]) {
    return cityCoords[normalizedCity];
  }
  
  // Try partial match
  for (const [key, coords] of Object.entries(cityCoords)) {
    if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
      return coords;
    }
  }
  
  // Default to Algiers if no match
  console.warn(`No coordinates found for city: ${cityName}, defaulting to Algiers`);
  return cityCoords['algiers'];
}
