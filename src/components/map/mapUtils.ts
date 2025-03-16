
import { Property } from "@/api/properties";

// A safeguard function to ensure we always get valid numbers
const ensureValidNumber = (value: any, defaultValue: number): number => {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  return value;
};

// Global fallback coordinates (Algiers)
const FALLBACK_COORDS = { lat: 36.752887, lng: 3.042048 };

// Helper function to generate coordinates from location string
// In a real app, you would have actual coordinates in your database
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  if (!location) {
    console.warn('Location string is empty or missing');
    // Return fallback with slight variation based on id
    return {
      lat: FALLBACK_COORDS.lat + (Math.sin(id * 0.3) * 0.01),
      lng: FALLBACK_COORDS.lng + (Math.cos(id * 0.3) * 0.01)
    };
  }
  
  try {
    // Extract city from location (assuming format is "Area, City")
    const parts = location.split(',');
    const cityPart = parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
    
    // Get base coordinates for the city
    const cityCoords = getCityCoordinates(cityPart);
    
    if (!cityCoords) {
      // Fallback to Algiers if city not found
      console.warn(`City not recognized in location "${location}", using fallback coordinates`);
      return {
        lat: ensureValidNumber(FALLBACK_COORDS.lat + (Math.sin(id) * 0.01), FALLBACK_COORDS.lat),
        lng: ensureValidNumber(FALLBACK_COORDS.lng + (Math.cos(id) * 0.01), FALLBACK_COORDS.lng)
      };
    }
    
    // Generate slightly different coordinates based on the id to spread markers within the city
    return {
      lat: ensureValidNumber(cityCoords.lat + (Math.sin(id * 0.5) * 0.01), cityCoords.lat),
      lng: ensureValidNumber(cityCoords.lng + (Math.cos(id * 0.5) * 0.01), cityCoords.lng)
    };
  } catch (error) {
    console.error('Error generating coordinates from location:', error, 'location:', location, 'id:', id);
    // Return fallback coordinates on error
    return {
      lat: ensureValidNumber(FALLBACK_COORDS.lat + (Math.sin(id) * 0.005), FALLBACK_COORDS.lat),
      lng: ensureValidNumber(FALLBACK_COORDS.lng + (Math.cos(id) * 0.005), FALLBACK_COORDS.lng)
    };
  }
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
export function getCityCoordinates(city: string): { lat: number, lng: number } | null {
  if (!city || typeof city !== 'string') {
    console.warn('Invalid city name provided:', city);
    return null;
  }
  
  try {
    // Normalize city name for comparison (remove leading/trailing spaces, case insensitive)
    const normalizedCity = city.trim().toLowerCase();
    
    if (normalizedCity.length === 0) {
      return null;
    }
    
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
    
    // No match found
    return null;
  } catch (error) {
    console.error('Error getting city coordinates:', error, 'city:', city);
    return null;
  }
}

// Helper function to format price with robust error handling
export function formatPrice(price: string): string {
  try {
    if (!price || typeof price !== 'string') {
      return '$0';
    }
    
    // Extract numeric value, handle various formats
    const numericString = price.replace(/[^0-9.]/g, '');
    const numericPrice = parseFloat(numericString);
    
    if (isNaN(numericPrice)) {
      return '$0';
    }
    
    if (numericPrice < 1000) {
      return `$${Math.round(numericPrice)}`;
    } else if (numericPrice < 1000000) {
      return `$${Math.round(numericPrice / 1000)}K`;
    } else {
      return `$${(numericPrice / 1000000).toFixed(1)}M`;
    }
  } catch (error) {
    console.error('Error formatting price:', error, 'price:', price);
    return '$0';
  }
}
