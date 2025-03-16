
import { Property } from "@/api/properties";

// Helper function to generate coordinates from location string
// In a real app, you would have actual coordinates in your database
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  // Extract city from location (assuming format is "Area, City")
  const parts = location.split(',');
  const cityPart = parts.length > 1 ? parts[parts.length - 1].trim() : location;
  
  // Get base coordinates for the city
  const cityCoords = getCityCoordinates(cityPart);
  
  if (!cityCoords) {
    // Fallback to Algiers if city not found
    console.warn(`City not recognized in location "${location}", using Algiers as fallback`);
    return {
      lat: 36.752887 + (Math.sin(id) * 0.01),
      lng: 3.042048 + (Math.cos(id) * 0.01)
    };
  }
  
  // Generate slightly different coordinates based on the id to spread markers within the city
  return {
    lat: cityCoords[1] + (Math.sin(id * 0.5) * 0.01),
    lng: cityCoords[0] + (Math.cos(id * 0.5) * 0.01)
  };
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
// Returns coordinates as [longitude, latitude] tuple for compatibility with Mapbox
export function getCityCoordinates(city: string): [number, number] | null {
  // Normalize city name for comparison (remove leading/trailing spaces, case insensitive)
  const normalizedCity = city.trim().toLowerCase();
  
  // Check if the normalized city name contains any of our known cities
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

// Helper function to format price
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
