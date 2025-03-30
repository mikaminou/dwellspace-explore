
interface ExtractedFilters {
  propertyType?: string[];
  beds?: number;
  baths?: number;
  features?: string[];
  maxPrice?: number;
  minPrice?: number;
  city?: string;
  amenities?: string[];
  livingArea?: {
    min?: number;
    max?: number;
  };
  listingType?: string[];
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
  
  // Extract number of bathrooms
  const bathroomMatch = lowerQuery.match(/(\d+)\s*(bathroom|bath|ba)/);
  if (bathroomMatch) {
    filters.baths = parseInt(bathroomMatch[1], 10);
  }

  // Extract features/amenities
  const amenities = [
    'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 'furnished', 
    'air conditioning', 'wifi', 'elevator', 'security', 'gym', 'modern', 
    'fireplace', 'basement', 'storage', 'view', 'waterfront', 'mountain view'
  ];
  
  // Split amenities from features for better filtering
  filters.amenities = amenities.filter(amenity => lowerQuery.includes(amenity));
  
  // Keep other features that are not specific amenities
  filters.features = [];
  
  // Extract listing type
  const listingTypes = ['rent', 'sale', 'construction'];
  const extractedListingTypes = listingTypes.filter(type => {
    return lowerQuery.includes(`for ${type}`) || lowerQuery.includes(`to ${type}`);
  });
  
  if (extractedListingTypes.length > 0) {
    filters.listingType = extractedListingTypes;
  }
  
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
  
  // Extract living area
  const livingAreaMatch = lowerQuery.match(/(\d+)\s*(?:to|-)\s*(\d+)\s*(?:m2|sq\s*m|square\s*meters)/i);
  if (livingAreaMatch) {
    filters.livingArea = {
      min: parseInt(livingAreaMatch[1], 10),
      max: parseInt(livingAreaMatch[2], 10)
    };
  }
  
  const minLivingAreaMatch = lowerQuery.match(/(?:at least|minimum|min)\s*(\d+)\s*(?:m2|sq\s*m|square\s*meters)/i);
  if (minLivingAreaMatch) {
    if (!filters.livingArea) filters.livingArea = {};
    filters.livingArea.min = parseInt(minLivingAreaMatch[1], 10);
  }
  
  const maxLivingAreaMatch = lowerQuery.match(/(?:at most|maximum|max)\s*(\d+)\s*(?:m2|sq\s*m|square\s*meters)/i);
  if (maxLivingAreaMatch) {
    if (!filters.livingArea) filters.livingArea = {};
    filters.livingArea.max = parseInt(maxLivingAreaMatch[1], 10);
  }

  // Extract location
  const cities = ['algiers', 'oran', 'constantine', 'annaba', 'blida', 'batna', 'djelfa', 'sétif', 'sidi bel abbès', 'biskra'];
  
  // Find all city mentions, not just the first one
  const foundCities = cities.filter(city => lowerQuery.includes(city));
  if (foundCities.length > 0) {
    // Capitalize first letter of each word for all found cities
    const firstCity = foundCities[0].split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    filters.city = firstCity;
  }

  // Extract "near" locations
  const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
  if (nearMatch && nearMatch[1]) {
    const nearLocation = nearMatch[1].trim();
    if (nearLocation && !cities.some(city => nearLocation.toLowerCase().includes(city))) {
      // This is a landmark or area, we could use it for more specific searches
      if (!filters.features) filters.features = [];
      filters.features.push(`near ${nearLocation}`);
    }
  }

  return filters;
}

/**
 * Validates extracted filters against available options
 */
export function validateExtractedFilters(
  filters: ExtractedFilters,
  availableOptions: {
    cities?: string[];
    propertyTypes?: string[];
    listingTypes?: string[];
    amenities?: string[];
    maxPrice?: number;
    maxLivingArea?: number;
  }
): ExtractedFilters {
  const validatedFilters: ExtractedFilters = { ...filters };
  
  // Validate city - case insensitive comparison
  if (validatedFilters.city && availableOptions.cities) {
    const availableCitiesLower = availableOptions.cities.map(city => city.toLowerCase());
    if (!availableCitiesLower.includes(validatedFilters.city.toLowerCase())) {
      console.log(`City "${validatedFilters.city}" is not in available options:`, availableOptions.cities);
      delete validatedFilters.city;
    }
  }
  
  // Validate property types
  if (validatedFilters.propertyType && validatedFilters.propertyType.length > 0 && availableOptions.propertyTypes) {
    const availableTypesLower = availableOptions.propertyTypes.map(type => type.toLowerCase());
    validatedFilters.propertyType = validatedFilters.propertyType.filter(type => 
      availableTypesLower.includes(type.toLowerCase())
    );
    
    if (validatedFilters.propertyType.length === 0) {
      delete validatedFilters.propertyType;
    }
  }
  
  // Validate listing types
  if (validatedFilters.listingType && validatedFilters.listingType.length > 0 && availableOptions.listingTypes) {
    const availableListingTypesLower = availableOptions.listingTypes.map(type => type.toLowerCase());
    validatedFilters.listingType = validatedFilters.listingType.filter(type => 
      availableListingTypesLower.includes(type.toLowerCase())
    );
    
    if (validatedFilters.listingType.length === 0) {
      delete validatedFilters.listingType;
    }
  }
  
  // Validate amenities
  if (validatedFilters.amenities && validatedFilters.amenities.length > 0 && availableOptions.amenities) {
    const availableAmenitiesLower = availableOptions.amenities.map(amenity => amenity.toLowerCase());
    validatedFilters.amenities = validatedFilters.amenities.filter(amenity => 
      availableAmenitiesLower.includes(amenity.toLowerCase())
    );
    
    if (validatedFilters.amenities.length === 0) {
      delete validatedFilters.amenities;
    }
  }
  
  // Validate price ranges
  if (validatedFilters.maxPrice && availableOptions.maxPrice) {
    if (validatedFilters.maxPrice > availableOptions.maxPrice) {
      validatedFilters.maxPrice = availableOptions.maxPrice;
    }
  }
  
  // Validate living area
  if (validatedFilters.livingArea && availableOptions.maxLivingArea) {
    if (validatedFilters.livingArea.max && validatedFilters.livingArea.max > availableOptions.maxLivingArea) {
      validatedFilters.livingArea.max = availableOptions.maxLivingArea;
    }
  }
  
  return validatedFilters;
}

/**
 * Applies extracted filters to the search state
 */
export function applyNaturalLanguageFilters(
  filters: ExtractedFilters,
  setters: {
    setPropertyType: (types: string[]) => void;
    setMinBeds: (beds: number) => void;
    setMinBaths?: (baths: number) => void;
    setMinPrice: (price: number) => void;
    setMaxPrice: (price: number) => void;
    setSelectedCities: (cities: string[]) => void;
    setSelectedAmenities?: (amenities: string[]) => void;
    setMinLivingArea?: (area: number) => void;
    setMaxLivingArea?: (area: number) => void;
    setListingType?: (types: string[]) => void;
  }
) {
  const { 
    setPropertyType, setMinBeds, setMinBaths, setMinPrice, setMaxPrice, 
    setSelectedCities, setSelectedAmenities, setMinLivingArea, setMaxLivingArea, setListingType 
  } = setters;

  // Apply property type
  if (filters.propertyType && filters.propertyType.length > 0) {
    setPropertyType(filters.propertyType);
  }

  // Apply bedrooms
  if (filters.beds && filters.beds > 0) {
    setMinBeds(filters.beds);
  }

  // Apply bathrooms
  if (filters.baths && filters.baths > 0 && setMinBaths) {
    setMinBaths(filters.baths);
  }

  // Apply price range
  if (filters.minPrice && filters.minPrice > 0) {
    setMinPrice(filters.minPrice);
  }
  
  if (filters.maxPrice && filters.maxPrice > 0) {
    setMaxPrice(filters.maxPrice);
  }

  // Apply city - now we handle it as an array
  if (filters.city) {
    setSelectedCities([filters.city]);
  }

  // Apply amenities if we have a setter and amenities to set
  if (setSelectedAmenities && filters.amenities && filters.amenities.length > 0) {
    setSelectedAmenities(filters.amenities);
  }

  // Apply living area if we have setters and values
  if (filters.livingArea) {
    if (setMinLivingArea && filters.livingArea.min) {
      setMinLivingArea(filters.livingArea.min);
    }
    if (setMaxLivingArea && filters.livingArea.max) {
      setMaxLivingArea(filters.livingArea.max);
    }
  }

  // Apply listing type if we have a setter and values
  if (setListingType && filters.listingType && filters.listingType.length > 0) {
    setListingType(filters.listingType);
  }
}
