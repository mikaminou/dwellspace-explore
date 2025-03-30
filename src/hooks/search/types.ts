
export interface SearchFilters {
  city?: string[];
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minLivingArea?: number;
  maxLivingArea?: number;
  listingType?: string[];
  naturalLanguageQuery?: string;
  amenities?: string[];
}

export interface SearchState {
  searchTerm: string;
  properties: any[];
  loading: boolean;
  showFilters: boolean;
  selectedCities: string[];
  propertyType: string[];
  listingType: string[];
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  minLivingArea: number;
  maxLivingArea: number;
  sortOption: string;
  cities: string[];
  maxPriceLimit: number;
  maxLivingAreaLimit: number;
  activeFilterSection: string | null;
  initialLoadDone: boolean;
  selectedAmenities: string[];
}

export interface SearchActions {
  setSearchTerm: (term: string) => void;
  setShowFilters: (show: boolean) => void;
  setSelectedCities: (cities: string[]) => void;
  setPropertyType: (types: string[]) => void;
  setListingType: (types: string[]) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setMinBeds: (beds: number) => void;
  setMinBaths: (baths: number) => void;
  setMinLivingArea: (area: number) => void;
  setMaxLivingArea: (area: number) => void;
  setSortOption: (option: string) => void;
  setActiveFilterSection: (section: string | null) => void;
  setSelectedAmenities: (amenities: string[]) => void;
  handleSearch: () => void;
  handleReset: () => void;
  getActiveFiltersCount: () => number;
  handleFilterRemoval: (filterType: string, value?: string) => void;
}

export interface SearchSuggestion {
  text: string;
  type: "history" | "ai" | "trending";
  timestamp?: number;
}

export type SearchHookResult = SearchState & SearchActions & {
  filtersApplied: React.MutableRefObject<boolean>;
};
