
import { Property } from "@/api/properties";

// Helper function to generate coordinates from location string
// This now considers the city name in the location string
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  // Check if the location contains a city name and use that city's coordinates as base
  const cityCoords = getCityCoordinatesFromLocation(location);
  
  if (cityCoords) {
    // Generate slightly different coordinates based on the id to spread markers within the city
    return {
      lat: cityCoords.lat + (Math.sin(id) * 0.005),
      lng: cityCoords.lng + (Math.cos(id) * 0.005)
    };
  }
  
  // Fallback to Algiers if no city is detected
  const baseCoords = { lat: 36.752887, lng: 3.042048 };
  return {
    lat: baseCoords.lat + (Math.sin(id) * 0.005),
    lng: baseCoords.lng + (Math.cos(id) * 0.005)
  };
}

// Helper function to extract city from location string
function getCityCoordinatesFromLocation(location: string): { lat: number, lng: number } | null {
  const cities = Object.keys(getCitiesCoordinates());
  
  // Check if the location string contains any of our known cities
  for (const city of cities) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return getCityCoordinates(city);
    }
  }
  
  return null;
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
export function getCityCoordinates(city: string): { lat: number, lng: number } | null {
  const cities = getCitiesCoordinates();
  return cities[city] || null;
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

// Get badge class for a listing type
export function getListingTypeBadgeClass(type: string = 'sale'): string {
  switch (type.toLowerCase()) {
    case 'rent': return 'bg-blue-500 text-white';
    case 'construction': return 'bg-amber-500 text-white';
    case 'commercial': return 'bg-purple-500 text-white';
    case 'vacation': return 'bg-teal-500 text-white';
    case 'sale':
    default: return 'bg-green-500 text-white';
  }
}
