
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

// New geocoding function to get coordinates from address
export async function geocodeAddress(address: string): Promise<{longitude: number, latitude: number} | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    // Using OpenStreetMap Nominatim API as it's free and doesn't require API key
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
    
    if (!response.ok) {
      console.error('Geocoding API error:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        longitude: parseFloat(data[0].lon),
        latitude: parseFloat(data[0].lat)
      };
    }
    
    console.warn(`No coordinates found for address: ${address}`);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Combine address components into a single string for geocoding
export function formatAddressForGeocoding(
  street: string,
  city: string,
  postal_code?: number | string | null
): string {
  let addressParts = [];
  
  if (street) addressParts.push(street);
  if (city) addressParts.push(city);
  if (postal_code) addressParts.push(postal_code.toString());
  
  // Add country name for better results
  addressParts.push('Algeria');
  
  return addressParts.join(', ');
}
