import { Property } from "@/api/properties";

// Helper function to generate coordinates from location string
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  // Check if the location contains a city name and use that city's coordinates as base
  const cityCoords = getCityCoordinatesFromLocation(location);
  
  if (cityCoords) {
    // Generate slightly different coordinates based on the id
    // Using a very small offset to keep markers close to their origin
    const offset = 0.002; // Reduced offset to minimize marker spread
    const idHash = (id % 10) * offset;
    
    return {
      lat: restrictLatitude(cityCoords.lat + (Math.sin(id) * idHash)),
      lng: restrictLongitude(cityCoords.lng + (Math.cos(id) * idHash))
    };
  }
  
  // Fallback to Algiers if no city is detected
  const baseCoords = { lat: 36.752887, lng: 3.042048 };
  const offset = 0.002;
  const idHash = (id % 10) * offset;
  
  return {
    lat: restrictLatitude(baseCoords.lat + (Math.sin(id) * idHash)),
    lng: restrictLongitude(baseCoords.lng + (Math.cos(id) * idHash))
  };
}

// Ensure longitude stays within North Africa region
function restrictLongitude(lng: number): number {
  return Math.max(-15, Math.min(35, lng));
}

// Ensure latitude stays within North Africa region
function restrictLatitude(lat: number): number {
  return Math.max(20, Math.min(38, lat));
}

// Helper function to extract city from location string
function getCityCoordinatesFromLocation(location: string): { lat: number, lng: number } | null {
  const cities = getCitiesCoordinates();
  const locationLower = location.toLowerCase();
  
  // Check if the location string contains any of our known cities
  for (const [cityName, coords] of Object.entries(cities)) {
    if (locationLower.includes(cityName.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
}

// Helper function to get city coordinates
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
