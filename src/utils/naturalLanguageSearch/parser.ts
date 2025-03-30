import { ExtractedFilters } from './types';

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
