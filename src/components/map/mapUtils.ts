
import { Property } from "@/api/properties";

// Format price for display on map markers
export function formatPrice(price: string): string {
  if (!price) return "$0";
  
  // Handle numeric price strings or those with currency symbols
  const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
  
  if (numericPrice < 1000) {
    return `$${numericPrice}`;
  } else if (numericPrice < 1000000) {
    return `$${Math.round(numericPrice / 1000)}K`;
  } else {
    return `$${(numericPrice / 1000000).toFixed(1)}M`;
  }
}

// Get city coordinates for map centering by city name
export function getCityCoordinates(city: string): [number, number] | null {
  // Normalize city name for comparison (remove leading/trailing spaces, case insensitive)
  const normalizedCity = city.trim().toLowerCase();
  
  // Pre-defined coordinates for major cities
  const cities: {[key: string]: [number, number]} = {
    'algiers': [3.042048, 36.752887],
    'oran': [-0.642049, 35.691544],
    'constantine': [6.614722, 36.365],
    'annaba': [7.765092, 36.897503],
    'setif': [5.408341, 36.190073],
    'tizi ouzou': [4.0500, 36.7167],
    'blida': [2.8300, 36.4700],
    'tlemcen': [-1.3200, 34.8800],
    'bejaia': [5.0833, 36.7500],
    'bouira': [3.9000, 36.3800],
    'ghardaia': [3.6700, 32.4900],
    'adrar': [-0.2900, 27.8700]
  };
  
  // Try to find a matching city
  for (const [knownCity, coords] of Object.entries(cities)) {
    if (normalizedCity.includes(knownCity)) {
      return coords;
    }
  }
  
  return null;
}
