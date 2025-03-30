import { useCallback } from "react";

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
  const handleReset = useCallback(() => {
    // When resetting filters, keep the current city selection
    // Do not modify selectedCities
    console.log("Resetting filters, keeping cities:", selectedCities);
    
    // Reset all other filters with null checks
    setPropertyType([]);
    setListingType([]);
    
    // Use sensible defaults if limits are undefined
    const defaultMaxPrice = maxPriceLimit || 50000000;
    const defaultMaxLivingArea = maxLivingAreaLimit || 500;
    
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
    }, 100);
  }, [
    maxPriceLimit, maxLivingAreaLimit, handleSearch, setPropertyType, 
    setListingType, setMinPrice, setMaxPrice, setMinBeds, setMinBaths, 
    setMinLivingArea, setMaxLivingArea, setSortOption, setSelectedAmenities,
    selectedCities
  ]);

  return handleReset;
}
