
import { useFilterCounter } from "./useFilterCounter";
import { useFilterReset } from "./useFilterReset";
import { useFilterRemoval } from "./useFilterRemoval";

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
  // Get the count of active filters
  const getActiveFiltersCount = useFilterCounter(
    propertyType,
    listingType,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    maxLivingAreaLimit,
    selectedAmenities
  );

  // Handle resetting all filters
  const handleReset = useFilterReset(
    selectedCities,
    maxPriceLimit,
    maxLivingAreaLimit,
    setPropertyType,
    setListingType,
    setMinPrice,
    setMaxPrice,
    setMinBeds,
    setMinBaths,
    setMinLivingArea,
    setMaxLivingArea,
    setSelectedAmenities,
    setSortOption,
    handleSearch
  );

  // Handle removing individual filters
  const handleFilterRemoval = useFilterRemoval(
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
  );

  return {
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval
  };
}
