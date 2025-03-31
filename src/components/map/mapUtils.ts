
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

// Google Maps specific utility functions
export const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  styles: [
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { lightness: 20 }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffffff" }, { lightness: 17 }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }, { lightness: 18 }]
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }, { lightness: 16 }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { lightness: 21 }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#dedede" }, { lightness: 21 }]
    },
    {
      featureType: "administrative",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }, { lightness: 16 }]
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#797979" }]
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "simplified" }]
    }
  ]
};
