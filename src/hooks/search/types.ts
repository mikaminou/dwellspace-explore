
import { Property } from "@/api/properties";
import { MutableRefObject } from "react";

export interface SearchHookResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  propertyType: string[];
  setPropertyType: (types: string[]) => void;
  listingType: string[];
  setListingType: (types: string[]) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minBeds: number;
  setMinBeds: (beds: number) => void;
  minBaths: number;
  setMinBaths: (baths: number) => void;
  minLivingArea: number;
  setMinLivingArea: (area: number) => void;
  maxLivingArea: number;
  setMaxLivingArea: (area: number) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  cities: string[];
  maxPriceLimit: number;
  maxLivingAreaLimit: number;
  activeFilterSection: string | null;
  setActiveFilterSection: (section: string | null) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  filtersApplied: MutableRefObject<boolean>;
  handleSearch: () => void;
  handleReset: () => void;
  getActiveFiltersCount: () => number;
  handleFilterRemoval: (filterType: string, value?: string) => void;
  initialLoadDone: boolean;
  // Add map toggle state
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}
