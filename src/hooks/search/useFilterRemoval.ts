
import { useCallback } from "react";

/**
 * Hook to handle removal of individual filters
 */
export function useFilterRemoval(
  selectedCities: string[],
  propertyType: string[],
  listingType: string[],
  maxLivingAreaLimit: number,
  selectedAmenities: string[],
  setSelectedCities: (cities: string[]) => void,
  setPropertyType: (types: string[]) => void,
  setListingType: (types: string[]) => void,
  setMinBeds: (beds: number) => void,
  setMinBaths: (baths: number) => void,
  setMinLivingArea: (area: number) => void,
  setMaxLivingArea: (area: number) => void,
  setSelectedAmenities: (amenities: string[]) => void,
  handleSearch: () => void
) {
  // Move the callback creation outside of any conditional logic to ensure
  // hook call order remains consistent
  const handleFilterRemoval = useCallback((filterType: string, value?: string) => {
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
    
    // Ensure any focused element is blurred
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Trigger a new search with the updated filter values using a fixed timeout
    setTimeout(handleSearch, 50);
  }, [
    selectedCities, 
    propertyType, 
    listingType, 
    maxLivingAreaLimit, 
    selectedAmenities, 
    setSelectedCities, 
    setPropertyType, 
    setListingType, 
    setMinBeds,
    setMinBaths, 
    setMinLivingArea, 
    setMaxLivingArea,
    setSelectedAmenities, 
    handleSearch
  ]);

  return handleFilterRemoval;
}
