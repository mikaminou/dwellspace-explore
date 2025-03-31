
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

// Get text color for a listing type
export function getListingTypeTextColor(type: string = 'sale'): string {
  switch (type.toLowerCase()) {
    case 'rent': return 'text-blue-500';
    case 'construction': return 'text-amber-500';
    case 'commercial': return 'text-purple-500';
    case 'vacation': return 'text-teal-500';
    case 'sale':
    default: return 'text-green-500';
  }
}

// Get button background color for a listing type
export function getListingTypeButtonClass(type: string = 'sale'): string {
  switch (type.toLowerCase()) {
    case 'rent': return 'bg-blue-500 hover:bg-blue-600';
    case 'construction': return 'bg-amber-500 hover:bg-amber-600';
    case 'commercial': return 'bg-purple-500 hover:bg-purple-600';
    case 'vacation': return 'bg-teal-500 hover:bg-teal-600';
    case 'sale':
    default: return 'bg-green-500 hover:bg-green-600';
  }
}

// Google Maps specific utility functions - updated for a more realistic look
export const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  styles: [
    {
      // Landscape - more natural colors
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { color: "#f2f2f0" }  // Slight off-white for land
      ]
    },
    {
      // Water with more natural blue
      featureType: "water",
      elementType: "geometry",
      stylers: [
        { color: "#c8d7e3" }  // Light blue-gray for water
      ]
    },
    {
      // Roads with better visibility
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        { color: "#ffffff" }  // White roads
      ]
    },
    {
      // Road outlines for better definition
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#d9d9d9" }  // Light gray for road borders
      ]
    },
    {
      // Major highways
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        { color: "#f5cc88" }  // Light amber for highways
      ]
    },
    {
      // Highway strokes
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#e6b366" }  // Darker amber for highway borders
      ]
    },
    {
      // Parks and green areas
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        { color: "#cde6c2" }  // Light green for parks
      ]
    },
    {
      // All text labels 
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [
        { color: "#403E43" }  // Darker text for better readability
      ]
    },
    {
      // Transit lines
      featureType: "transit.line",
      stylers: [
        { color: "#9F9EA1" }  // Medium gray for transit lines
      ]
    },
    {
      // POI (Points of Interest) styling
      featureType: "poi",
      elementType: "all",
      stylers: [
        { visibility: "simplified" },
        { saturation: -30 }
      ]
    },
    {
      // Administrative borders
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#8A898C" },  // Medium gray for borders
        { weight: 1 }
      ]
    },
    {
      // Country borders
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#555555" },  // Darker gray for country borders
        { weight: 1.2 }
      ]
    },
    {
      // Terrain/topography hints
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        { color: "#eae8e4" },  // Natural terrain color
        { saturation: -15 },
        { lightness: 0 }
      ]
    }
  ]
};
