interface ExtractedFilters {
  propertyType?: string[];
  beds?: number;
  features?: string[];
  maxPrice?: number;
  minPrice?: number;
  city?: string;
  amenities?: string[];
}

/**
 * Extracts search filters from a natural language query
 */
export function parseNaturalLanguageQuery(query: string): ExtractedFilters {
  const filters: ExtractedFilters = {};
  const lowerQuery = query.toLowerCase();

  // Extract property type
  const propertyTypes = ['house', 'apartment', 'villa', 'condo', 'studio', 'duplex', 'penthouse'];
  filters.propertyType = propertyTypes.filter(type => lowerQuery.includes(type));

  // Extract number of bedrooms
  const bedroomMatch = lowerQuery.match(/(\d+)\s*(bedroom|bed|br)/);
  if (bedroomMatch) {
    filters.beds = parseInt(bedroomMatch[1], 10);
  }

  // Extract features/amenities
  const amenities = ['pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 'furnished', 
    'air conditioning', 'wifi', 'elevator', 'security', 'gym', 'modern'];
  
  // Split amenities from features for better filtering
  filters.amenities = amenities.filter(amenity => lowerQuery.includes(amenity));
  
  // Keep other features that are not specific amenities
  filters.features = [];
  
  // Extract price range
  const underPriceMatch = lowerQuery.match(/under\s*\$?(\d+)k?/i);
  if (underPriceMatch) {
    const value = parseInt(underPriceMatch[1], 10);
    filters.maxPrice = lowerQuery.includes('k') ? value * 1000 : value;
  }

  const betweenPriceMatch = lowerQuery.match(/between\s*\$?(\d+)k?\s*(?:and|-)\s*\$?(\d+)k?/i);
  if (betweenPriceMatch) {
    let minValue = parseInt(betweenPriceMatch[1], 10);
    let maxValue = parseInt(betweenPriceMatch[2], 10);
    
    filters.minPrice = lowerQuery.includes('k') ? minValue * 1000 : minValue;
    filters.maxPrice = lowerQuery.includes('k') ? maxValue * 1000 : maxValue;
  }

  // Extract location
  const cities = ['algiers', 'oran', 'constantine', 'annaba', 'blida', 'batna', 'djelfa', 'sétif', 'sidi bel abbès', 'biskra'];
  const cityMatch = cities.find(city => lowerQuery.includes(city));
  if (cityMatch) {
    // Capitalize first letter of each word
    filters.city = cityMatch.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Extract "near" locations
  const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
  if (nearMatch && nearMatch[1]) {
    const nearLocation = nearMatch[1].trim();
    if (nearLocation && !cities.some(city => nearLocation.toLowerCase().includes(city))) {
      // This is a landmark or area, we could use it for more specific searches
      // For now, we'll just add it to features
      if (!filters.features) filters.features = [];
      filters.features.push(`near ${nearLocation}`);
    }
  }

  return filters;
}

/**
 * Applies extracted filters to the search state
 */
export function applyNaturalLanguageFilters(
  filters: ExtractedFilters,
  setters: {
    setPropertyType: (types: string[]) => void;
    setMinBeds: (beds: number) => void;
    setMinPrice: (price: number) => void;
    setMaxPrice: (price: number) => void;
    setSelectedCity: (city: string) => void;
    setSelectedAmenities?: (amenities: string[]) => void;
  }
) {
  const { setPropertyType, setMinBeds, setMinPrice, setMaxPrice, setSelectedCity, setSelectedAmenities } = setters;

  // Apply property type
  if (filters.propertyType && filters.propertyType.length > 0) {
    setPropertyType(filters.propertyType);
  }

  // Apply bedrooms
  if (filters.beds && filters.beds > 0) {
    setMinBeds(filters.beds);
  }

  // Apply price range
  if (filters.minPrice && filters.minPrice > 0) {
    setMinPrice(filters.minPrice);
  }
  
  if (filters.maxPrice && filters.maxPrice > 0) {
    setMaxPrice(filters.maxPrice);
  }

  // Apply city
  if (filters.city) {
    setSelectedCity(filters.city);
  }

  // Apply amenities if we have a setter and amenities to set
  if (setSelectedAmenities && filters.amenities && filters.amenities.length > 0) {
    setSelectedAmenities(filters.amenities);
  }
}
