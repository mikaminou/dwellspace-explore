
import { Property } from "@/api/properties";

// Helper function to generate coordinates from location string
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  // Check if the location contains a city name and use that city's coordinates as base
  const cityCoords = getCityCoordinatesFromLocation(location);
  
  if (cityCoords) {
    // Generate slightly different coordinates based on the id to spread markers within the city
    // Using a deterministic but small offset to avoid extreme displacements
    const offset = 0.005; // Smaller offset in degrees to keep markers closer together
    const idHash = Math.abs(Math.sin(id * 0.1)) * offset; // Normalize the offset
    
    return {
      lat: restrictLatitude(cityCoords.lat + (Math.sin(id) * idHash)),
      lng: restrictLongitude(cityCoords.lng + (Math.cos(id) * idHash))
    };
  }
  
  // Fallback to Algiers if no city is detected
  const baseCoords = { lat: 36.752887, lng: 3.042048 };
  const offset = 0.005; // Smaller offset in degrees
  const idHash = Math.abs(Math.sin(id * 0.1)) * offset; // Normalize the offset
  
  return {
    lat: restrictLatitude(baseCoords.lat + (Math.sin(id) * idHash)),
    lng: restrictLongitude(baseCoords.lng + (Math.cos(id) * idHash))
  };
}

// Ensure longitude stays within -180 to 180 degrees
function restrictLongitude(lng: number): number {
  // Simple clamping approach for more stable results
  return Math.max(-179.9, Math.min(179.9, lng));
}

// Ensure latitude stays within -85 to 85 degrees (mapbox limits)
function restrictLatitude(lat: number): number {
  return Math.max(-84.9, Math.min(84.9, lat));
}

// Helper function to extract city from location string
function getCityCoordinatesFromLocation(location: string): { lat: number, lng: number } | null {
  const cities = getCitiesCoordinates();
  const locationLower = location.toLowerCase();
  
  // Check if the location string contains any of our known cities
  for (const [cityName, coords] of Object.entries(cities)) {
    // More aggressive match with various forms of the city name
    if (
      locationLower.includes(cityName.toLowerCase()) || 
      locationLower.includes(cityName.toLowerCase().replace(' ', '')) ||
      locationLower.includes(cityName.toLowerCase().replace('-', ' ')) ||
      locationLower.includes(cityName.toLowerCase().replace(' ', '-'))
    ) {
      return coords;
    }
  }
  
  return null;
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
export function getCityCoordinates(city: string): { lat: number, lng: number } | null {
  const cities = getCitiesCoordinates();
  
  // Try exact match first
  if (cities[city]) {
    return cities[city];
  }
  
  // If not found, try case-insensitive match
  const cityLower = city.toLowerCase();
  for (const [name, coords] of Object.entries(cities)) {
    if (name.toLowerCase() === cityLower) {
      return coords;
    }
  }
  
  return null;
}

// Centralized function to get all cities coordinates
function getCitiesCoordinates(): {[key: string]: { lat: number, lng: number }} {
  return {
    'Algiers': { lat: 36.752887, lng: 3.042048 },
    'Oran': { lat: 35.691544, lng: -0.642049 },
    'Constantine': { lat: 36.365, lng: 6.614722 },
    'Annaba': { lat: 36.897503, lng: 7.765092 },
    'Setif': { lat: 36.190073, lng: 5.408341 }
  };
}

// Helper function to format price in DZD (Algerian Dinar)
export function formatPrice(price: string): string {
  const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
  if (numericPrice < 1000000) {
    return `${Math.round(numericPrice / 1000)}K DZD`;
  } else {
    return `${(numericPrice / 1000000).toFixed(1)}M DZD`;
  }
}
