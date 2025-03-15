
import { Property } from "@/api/properties";

/**
 * Coordinate utilities for property maps
 */

// City coordinates lookup table - extracted for easier maintenance
const CITY_COORDINATES: {[key: string]: { lat: number, lng: number }} = {
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

// Default coordinates to use as fallback
const DEFAULT_COORDINATES = { lat: 36.752887, lng: 3.042048 }; // Algiers

/**
 * Generates coordinates based on a location string and property ID
 */
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } {
  // Input validation with clear error messages
  if (!location) {
    console.warn(`Missing location for property ${id}, using default coordinates`);
    return generateRandomizedCoordinates(DEFAULT_COORDINATES, id);
  }

  if (!id && id !== 0) {
    console.warn(`Invalid property ID, using default coordinates`);
    return generateRandomizedCoordinates(DEFAULT_COORDINATES, Math.random() * 1000);
  }

  try {
    // Extract city from location (assuming format is "Area, City")
    const parts = location.split(',');
    const cityPart = parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
    
    // Look up city coordinates
    const cityCoords = getCityCoordinates(cityPart);
    
    // Generate slightly varied coordinates based on the property ID
    return generateRandomizedCoordinates(cityCoords, id);
  } catch (error) {
    console.error(`Failed to generate coordinates for property ${id} at "${location}":`, error);
    return generateRandomizedCoordinates(DEFAULT_COORDINATES, id);
  }
}

/**
 * Gets coordinates for a city name
 */
export function getCityCoordinates(city: string): { lat: number, lng: number } {
  // Input validation
  if (!city || typeof city !== 'string') {
    console.warn("Invalid city name provided to getCityCoordinates");
    return DEFAULT_COORDINATES;
  }

  try {
    // Normalize city name for case-insensitive comparison
    const normalizedCity = city.trim().toLowerCase();
    
    // First try exact match
    if (CITY_COORDINATES[normalizedCity]) {
      return CITY_COORDINATES[normalizedCity];
    }
    
    // If no exact match, try partial match
    for (const [knownCity, coords] of Object.entries(CITY_COORDINATES)) {
      if (normalizedCity.includes(knownCity)) {
        return coords;
      }
    }
    
    // No match found
    console.warn(`No coordinates found for city "${city}", using default`);
    return DEFAULT_COORDINATES;
  } catch (error) {
    console.error(`Error in getCityCoordinates for "${city}":`, error);
    return DEFAULT_COORDINATES;
  }
}

/**
 * Creates slightly randomized coordinates for properties in the same city
 */
function generateRandomizedCoordinates(baseCoords: { lat: number, lng: number }, seed: number): { lat: number, lng: number } {
  // Create a deterministic but small offset based on the property ID
  // This ensures properties in the same city don't all stack on top of each other
  return {
    lat: baseCoords.lat + (Math.sin(seed * 0.5) * 0.01),
    lng: baseCoords.lng + (Math.cos(seed * 0.5) * 0.01)
  };
}

/**
 * Formats a price string into a more readable format
 */
export function formatPrice(price: string): string {
  if (!price || typeof price !== 'string') {
    return '$0';
  }
  
  try {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
    if (isNaN(numericPrice)) return price;
    
    if (numericPrice < 1000000) {
      return `$${Math.round(numericPrice / 1000)}K`;
    } else {
      return `$${(numericPrice / 1000000).toFixed(1)}M`;
    }
  } catch (error) {
    console.error("Error formatting price:", error);
    return price || '$0';
  }
}
