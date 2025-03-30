
import { useCallback, useRef } from "react";

/**
 * Hook to handle filter reset functionality
 */
export function useFilterReset(
  selectedCities: string[],
  maxPriceLimit: number,
  maxLivingAreaLimit: number,
  setPropertyType: (types: string[]) => void,
  setListingType: (types: string[]) => void,
  setMinPrice: (price: number) => void,
  setMaxPrice: (price: number) => void,
  setMinBeds: (beds: number) => void,
  setMinBaths: (baths: number) => void,
  setMinLivingArea: (area: number) => void,
  setMaxLivingArea: (area: number) => void,
  setSelectedAmenities: (amenities: string[]) => void,
  setSortOption: (option: string) => void,
  handleSearch: () => void
) {
  // Add a flag to prevent multiple reset operations from running at once
  const resetInProgress = useRef(false);
  
  const handleReset = useCallback(() => {
    // If reset is already in progress, skip
    if (resetInProgress.current) {
      console.log("Reset already in progress, skipping");
      return;
    }
    
    resetInProgress.current = true;
    
    // When resetting filters, keep the current city selection
    // Do not modify selectedCities
    console.log("Resetting filters, keeping cities:", selectedCities);
    
    // Reset all other filters with null checks and use empty arrays instead of undefined
    setPropertyType([]);
    setListingType([]);
    
    // Use sensible defaults if limits are undefined or zero
    const defaultMaxPrice = maxPriceLimit && maxPriceLimit > 0 ? maxPriceLimit : 50000000;
    const defaultMaxLivingArea = maxLivingAreaLimit && maxLivingAreaLimit > 0 ? maxLivingAreaLimit : 500;
    
    setMinPrice(0);
    setMaxPrice(defaultMaxPrice);
    setMinBeds(0);
    setMinBaths(0);
    setMinLivingArea(0);
    setMaxLivingArea(defaultMaxLivingArea);
    setSelectedAmenities([]);
    setSortOption('relevance');
    
    // Force a new search with the reset values after a short delay to ensure state updates
    setTimeout(() => {
      // Ensure we're blurring any focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      handleSearch();
      resetInProgress.current = false;
    }, 300); // Increased timeout to ensure all state updates complete
  }, [
    maxPriceLimit, 
    maxLivingAreaLimit, 
    handleSearch, 
    setPropertyType, 
    setListingType, 
    setMinPrice, 
    setMaxPrice, 
    setMinBeds, 
    setMinBaths, 
    setMinLivingArea, 
    setMaxLivingArea, 
    setSortOption, 
    setSelectedAmenities,
    selectedCities
  ]);

  return handleReset;
}
