import { ExtractedFilters, ValidationOptions } from './types';

/**
 * Validates extracted filters against available options
 */
export function validateExtractedFilters(
  filters: ExtractedFilters,
  availableOptions: ValidationOptions
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
  
  // Validate property types - process EACH property type independently
  if (validatedFilters.propertyType && validatedFilters.propertyType.length > 0 && availableOptions.propertyTypes) {
    const availableTypesLower = availableOptions.propertyTypes.map(type => type.toLowerCase());
    
    // Filter out invalid property types while keeping valid ones
    const validPropertyTypes = validatedFilters.propertyType.filter(type => 
      availableTypesLower.includes(type.toLowerCase())
    );
    
    if (validPropertyTypes.length > 0) {
      validatedFilters.propertyType = validPropertyTypes;
    } else {
      delete validatedFilters.propertyType;
    }
  }
  
  // Validate listing types - process EACH listing type independently
  if (validatedFilters.listingType && validatedFilters.listingType.length > 0 && availableOptions.listingTypes) {
    const availableListingTypesLower = availableOptions.listingTypes.map(type => type.toLowerCase());
    
    // Filter out invalid listing types while keeping valid ones
    const validListingTypes = validatedFilters.listingType.filter(type => 
      availableListingTypesLower.includes(type.toLowerCase())
    );
    
    if (validListingTypes.length > 0) {
      validatedFilters.listingType = validListingTypes;
    } else {
      delete validatedFilters.listingType;
    }
  }
  
  // Validate amenities - process EACH amenity independently
  if (validatedFilters.amenities && validatedFilters.amenities.length > 0 && availableOptions.amenities) {
    const availableAmenitiesLower = availableOptions.amenities.map(amenity => amenity.toLowerCase());
    
    // Filter out invalid amenities while keeping valid ones
    const validAmenities = validatedFilters.amenities.filter(amenity => 
      availableAmenitiesLower.includes(amenity.toLowerCase())
    );
    
    if (validAmenities.length > 0) {
      validatedFilters.amenities = validAmenities;
    } else {
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
