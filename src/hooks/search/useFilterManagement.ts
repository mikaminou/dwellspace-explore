
import { useCallback } from "react";

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
    console.log("Resetting filters, keeping cities:", selectedCities);
    
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
    
    // Still auto-search after reset since this is explicitly initiated by the user
    setTimeout(() => {
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

  const handleFilterRemoval = useCallback((filterType: string, value?: string | number) => {
    switch (filterType) {
      case 'city':
        if (value) {
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
    
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Filter removals should still trigger searches since they are explicit user actions
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
