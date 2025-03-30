
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
    if (propertyType && propertyType.length > 0) count++;
    if (listingType && listingType.length > 0) count++;
    if (minBeds && minBeds > 0) count++;
    if (minBaths && minBaths > 0) count++;
    if (minLivingArea && minLivingArea > 0) count++;
    if (maxLivingArea && maxLivingAreaLimit && maxLivingArea < maxLivingAreaLimit) count++;
    if (selectedAmenities && selectedAmenities.length > 0) count++;
    return count;
  }, [
    propertyType, listingType, minBeds, 
    minBaths, minLivingArea, maxLivingArea, maxLivingAreaLimit,
    selectedAmenities
  ]);

  return getActiveFiltersCount;
}
