
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
    const fallbackCoords = { lat: 36.752887, lng: 3.042048 };
    return {
      lat: fallbackCoords.lat + (Math.sin(id) * 0.01),
      lng: fallbackCoords.lng + (Math.cos(id) * 0.01)
    };
  }
  
  // Generate slightly different coordinates based on the id to spread markers within the city
  return {
    lat: cityCoords.lat + (Math.sin(id * 0.5) * 0.01),
    lng: cityCoords.lng + (Math.cos(id * 0.5) * 0.01)
  };
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
export function getCityCoordinates(city: string): { lat: number, lng: number } | null {
  // Normalize city name for comparison (remove leading/trailing spaces, case insensitive)
  const normalizedCity = city.trim().toLowerCase();
  
  // Check if the normalized city name contains any of our known cities
  const cities: {[key: string]: { lat: number, lng: number }} = {
    'algiers': { lat: 36.752887, lng: 3.042048 },
    'oran': { lat: 35.691544, lng: -0.642049 },
    'constantine': { lat: 36.365, lng: 6.614722 },
    'annaba': { lat: 36.897503, lng: 7.765092 },
    'setif': { lat: 36.190073, lng: 5.408341 },
    'tizi ouzou': { lat: 36.7167, lng: 4.0500 },
    'blida': { lat: 36.4700, lng: 2.8300 },
    'tlemcen': { lat: 34.8800, lng: -1.3200 },
    'bejaia': { lat: 36.7500, lng: 5.0833 },
    'bouira': { lat: 36.3800, lng: 3.9000 },
    'ghardaia': { lat: 32.4900, lng: 3.6700 },
    'adrar': { lat: 27.8700, lng: -0.2900 }
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
  const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
  if (numericPrice < 1000000) {
    return `$${Math.round(numericPrice / 1000)}K`;
  } else {
    return `$${(numericPrice / 1000000).toFixed(1)}M`;
  }
}
