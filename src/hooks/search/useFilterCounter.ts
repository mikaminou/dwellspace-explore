
import { useCallback } from "react";

/**
 * Hook to count active filters
 */
export function useFilterCounter(
  propertyType: string[],
  listingType: string[],
  minBeds: number,
  minBaths: number,
  minLivingArea: number,
  maxLivingArea: number,
  maxLivingAreaLimit: number,
  selectedAmenities: string[]
) {
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    // We don't count cities as filters since they're required
    
    // Check if arrays have values before counting them
    if (propertyType && Array.isArray(propertyType) && propertyType.length > 0) count++;
    if (listingType && Array.isArray(listingType) && listingType.length > 0) count++;
    
    // Check if numeric values are defined and meet conditions
    if (typeof minBeds === 'number' && minBeds > 0) count++;
    if (typeof minBaths === 'number' && minBaths > 0) count++;
    if (typeof minLivingArea === 'number' && minLivingArea > 0) count++;
    
    if (typeof maxLivingArea === 'number' && 
        typeof maxLivingAreaLimit === 'number' && 
        maxLivingArea < maxLivingAreaLimit) count++;
    
    // Check if amenities array has values
    if (selectedAmenities && Array.isArray(selectedAmenities) && selectedAmenities.length > 0) count++;
    
    return count;
  }, [
    propertyType, listingType, minBeds, 
    minBaths, minLivingArea, maxLivingArea, maxLivingAreaLimit,
    selectedAmenities
  ]);

  return getActiveFiltersCount;
}
