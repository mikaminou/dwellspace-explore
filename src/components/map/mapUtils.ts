
import { Property } from "@/api/properties";

// Helper function to generate coordinates from location string
// In a real app, you would have actual coordinates in your database
export function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  // Base coordinates for Algiers
  const baseCoords = { lat: 36.752887, lng: 3.042048 };
  
  // Generate slightly different coordinates based on the id to spread markers
  return {
    lat: baseCoords.lat + (Math.sin(id) * 0.03),
    lng: baseCoords.lng + (Math.cos(id) * 0.03)
  };
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
export function getCityCoordinates(city: string): { lat: number, lng: number } | null {
  const cities: {[key: string]: { lat: number, lng: number }} = {
    'Algiers': { lat: 36.752887, lng: 3.042048 },
    'Oran': { lat: 35.691544, lng: -0.642049 },
    'Constantine': { lat: 36.365, lng: 6.614722 },
    'Annaba': { lat: 36.897503, lng: 7.765092 },
    'Setif': { lat: 36.190073, lng: 5.408341 }
  };
  
  return cities[city] || null;
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
