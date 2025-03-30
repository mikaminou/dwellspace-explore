
import { useCallback } from "react";

export function useSearchInputOperations({
  searchTerm,
  setSearchTerm,
  setPropertyType,
  setMinBeds,
  setMinBaths,
  setMinPrice,
  setMaxPrice,
  setSelectedCities,
  setMinLivingArea,
  setMaxLivingArea,
  setSelectedAmenities,
  setListingType,
  setLoading,
  filtersApplied,
  handleSearch,
  setShowSuggestions
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPropertyType: (types: string[]) => void;
  setMinBeds: (beds: number) => void;
  setMinBaths: (baths: number) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setSelectedCities: (cities: string[]) => void;
  setMinLivingArea: (area: number) => void;
  setMaxLivingArea: (area: number) => void;
  setSelectedAmenities: (amenities: string[]) => void;
  setListingType: (types: string[]) => void;
  setLoading: (loading: boolean) => void;
  filtersApplied: React.MutableRefObject<boolean>;
  handleSearch: () => void;
  setShowSuggestions: (show: boolean) => void;
}) {
  const handleInputFocus = useCallback(() => {
    setShowSuggestions(true);
  }, [setShowSuggestions]);

  const handleClearSearch = useCallback(() => {
    // First clear the search term
    setSearchTerm('');
    
    // Clear all non-city related filters
    setPropertyType([]);
    setMinBeds(0);
    setMinBaths(0);
    setMinPrice(0);
    setMaxPrice(0); // This will be updated with maxPriceLimit in the main hook
    setMinLivingArea(0);
    setMaxLivingArea(0); // This will be updated with maxLivingAreaLimit in the main hook
    setSelectedAmenities([]);
    setListingType([]);
    
    // Set loading state to indicate data is being fetched
    setLoading(true);
    
    // Make sure filters are still considered applied (to show results)
    filtersApplied.current = true;
    
    // Close the suggestions if they're open
    setShowSuggestions(false);
    
    // Trigger a new search with the city selection intact
    // We need to trigger this outside the current event loop to ensure
    // the state updates have been processed
    setTimeout(() => {
      handleSearch();
    }, 50);
  }, [
    setSearchTerm, setPropertyType, setMinBeds, setMinBaths, setMinPrice,
    setMaxPrice, setMinLivingArea, setMaxLivingArea, setSelectedAmenities,
    setListingType, setLoading, filtersApplied, setShowSuggestions, handleSearch
  ]);

  return {
    handleInputFocus,
    handleClearSearch,
  };
}
