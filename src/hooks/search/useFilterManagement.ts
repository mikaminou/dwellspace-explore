
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
    setSelectedCity('any');
    setPropertyType([]);
    setListingType([]);
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
    setMinBeds(0);
    setMinBaths(0);
    setMinLivingArea(0);
    setMaxLivingArea(maxLivingAreaLimit);
    setSortOption('relevance');
    
    setTimeout(() => {
      handleSearch();
    }, 0);
  }, [
    maxPriceLimit, maxLivingAreaLimit, handleSearch, setSelectedCity, setPropertyType, 
    setListingType, setMinPrice, setMaxPrice, setMinBeds, setMinBaths, 
    setMinLivingArea, setMaxLivingArea, setSortOption
  ]);

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (selectedCity !== 'any') count++;
    if (propertyType.length > 0) count++;
    if (listingType.length > 0) count++;
    if (minBeds > 0) count++;
    if (minBaths > 0) count++;
    if (minLivingArea > 0) count++;
    if (maxLivingArea < maxLivingAreaLimit) count++;
    return count;
  }, [
    selectedCity, propertyType, listingType, minBeds, 
    minBaths, minLivingArea, maxLivingArea, maxLivingAreaLimit
  ]);

  const handleFilterRemoval = useCallback((filterType: string, value?: string) => {
    switch (filterType) {
      case 'city':
        setSelectedCity('any');
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
    
    setTimeout(() => {
      handleSearch();
    }, 0);
  }, [
    propertyType, listingType, maxLivingAreaLimit, handleSearch,
    setSelectedCity, setPropertyType, setListingType, setMinBeds,
    setMinBaths, setMinLivingArea, setMaxLivingArea
  ]);

  return {
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval
  };
}
