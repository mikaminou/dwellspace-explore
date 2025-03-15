
export interface FilterProps {
  showFilters: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
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
  maxPriceLimit: number;
  maxLivingAreaLimit: number;
  cities: string[];
  handleReset: () => void;
  handleSearch: () => void;
  activeFilterSection: string | null;
  setActiveFilterSection: (section: string | null) => void;
}
