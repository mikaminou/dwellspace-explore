import { useCallback } from "react";
// Removing the incorrect import of SearchFilters

export function useFilterManagement(
  selectedCities: string[],
  propertyType: string[],
  listingType: string[],
  minBeds: number,
  minBaths: number,
  minLivingArea: number,
  maxLivingArea: number,
  maxLivingAreaLimit: number,
  maxPriceLimit: number,
  selectedAmenities: string[],
  setSelectedCities: (cities: string[]) => void,
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
    
    // Reset all other filters
    setPropertyType([]);
    setListingType([]);
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
    setMinBeds(0);
    setMinBaths(0);
    setMinLivingArea(0);
    setMaxLivingArea(maxLivingAreaLimit);
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

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    // We don't count cities as filters since they're required
    if (propertyType.length > 0) count++;
    if (listingType.length > 0) count++;
    if (minBeds > 0) count++;
    if (minBaths > 0) count++;
    if (minLivingArea > 0) count++;
    if (maxLivingArea < maxLivingAreaLimit) count++;
    if (selectedAmenities.length > 0) count++;
    return count;
  }, [
    propertyType, listingType, minBeds, 
    minBaths, minLivingArea, maxLivingArea, maxLivingAreaLimit,
    selectedAmenities
  ]);

  const handleFilterRemoval = useCallback((filterType: string, value?: string) => {
    switch (filterType) {
      case 'city':
        if (value) {
          // Remove specific city if value is provided
          setSelectedCities(selectedCities.filter(city => city !== value));
        }
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
      case 'amenities':
        if (value) {
          setSelectedAmenities(selectedAmenities.filter(amenity => amenity !== value));
        } else {
          setSelectedAmenities([]);
        }
        break;
      default:
        break;
    }
    
    // Ensure any focused element is blurred
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Force a new search with the updated filter values
    setTimeout(() => {
      handleSearch();
    }, 50);
  }, [
    selectedCities, propertyType, listingType, maxLivingAreaLimit, handleSearch,
    setSelectedCities, setPropertyType, setListingType, setMinBeds,
    setMinBaths, setMinLivingArea, setMaxLivingArea,
    selectedAmenities, setSelectedAmenities
  ]);

  return {
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval
  };
}
