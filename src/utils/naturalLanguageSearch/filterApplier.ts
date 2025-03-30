
import { ExtractedFilters, FilterSetters } from './types';

/**
 * Applies extracted filters to the search state
 */
export function applyNaturalLanguageFilters(
  filters: ExtractedFilters,
  setters: FilterSetters
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
