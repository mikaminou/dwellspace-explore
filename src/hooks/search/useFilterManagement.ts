import { useCallback } from "react";
import { SearchFilters } from "./types";

export function useFilterManagement(
  selectedCity: string,
  propertyType: string[],
  listingType: string[],
  minBeds: number,
  minBaths: number,
  minLivingArea: number,
  maxLivingArea: number,
  maxLivingAreaLimit: number,
  maxPriceLimit: number,
  setSelectedCity: (city: string) => void,
  setPropertyType: (types: string[]) => void,
  setListingType: (types: string[]) => void,
  setMinPrice: (price: number) => void,
  setMaxPrice: (price: number) => void,
  setMinBeds: (beds: number) => void,
  setMinBaths: (baths: number) => void,
  setMinLivingArea: (area: number) => void,
  setMaxLivingArea: (area: number) => void,
  setSortOption: (option: string) => void,
  handleSearch: () => void
) {
  const handleReset = useCallback(() => {
    // When resetting filters, instead of setting to 'any', keep the current city
    // or set to the first available city if none is selected
    // This ensures we don't use the 'any' option anymore
    setPropertyType([]);
    setListingType([]);
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
    setMinBeds(0);
    setMinBaths(0);
    setMinLivingArea(0);
    setMaxLivingArea(maxLivingAreaLimit);
    setSortOption('relevance');
    
    // Force a new search with the reset values after a short delay to ensure state updates
    setTimeout(() => {
      handleSearch();
    }, 50);
  }, [
    maxPriceLimit, maxLivingAreaLimit, handleSearch, setPropertyType, 
    setListingType, setMinPrice, setMaxPrice, setMinBeds, setMinBaths, 
    setMinLivingArea, setMaxLivingArea, setSortOption
  ]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    // Remove selectedCity check since we no longer have an "any" option
    if (propertyType.length > 0) count++;
    if (listingType.length > 0) count++;
    if (minBeds > 0) count++;
    if (minBaths > 0) count++;
    if (minLivingArea > 0) count++;
    if (maxLivingArea < maxLivingAreaLimit) count++;
    return count;
  }, [
    propertyType, listingType, minBeds, 
    minBaths, minLivingArea, maxLivingArea, maxLivingAreaLimit
  ]);

  const handleFilterRemoval = useCallback((filterType: string, value?: string) => {
    switch (filterType) {
      case 'city':
        // Don't reset city to 'any' since we no longer have that option
        // Instead, do nothing when trying to remove city filter
        break;
      case 'propertyType':
        if (value) {
          setPropertyType(propertyType.filter(type => type !== value));
        }
        break;
      case 'listingType':
        if (value) {
          setListingType(listingType.filter(type => type !== value));
        }
        break;
      case 'beds':
        setMinBeds(0);
        break;
      case 'baths':
        setMinBaths(0);
        break;
      case 'livingArea':
        setMinLivingArea(0);
        setMaxLivingArea(maxLivingAreaLimit);
        break;
      default:
        break;
    }
    
    // Force a new search with the updated filter values
    setTimeout(() => {
      handleSearch();
    }, 50);
  }, [
    propertyType, listingType, maxLivingAreaLimit, handleSearch,
    setPropertyType, setListingType, setMinBeds,
    setMinBaths, setMinLivingArea, setMaxLivingArea
  ]);

  return {
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval
  };
}
