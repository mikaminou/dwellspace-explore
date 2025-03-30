
/**
 * Interface for extracted filters from natural language search
 */
export interface ExtractedFilters {
  propertyType?: string[];
  beds?: number;
  baths?: number;
  features?: string[];
  maxPrice?: number;
  minPrice?: number;
  city?: string;
  amenities?: string[];
  livingArea?: {
    min?: number;
    max?: number;
  };
  listingType?: string[];
}

/**
 * Interface for validation options
 */
export interface ValidationOptions {
  cities?: string[];
  propertyTypes?: string[];
  listingTypes?: string[];
  amenities?: string[];
  maxPrice?: number;
  maxLivingArea?: number;
}

/**
 * Interface for filter setter functions
 */
export interface FilterSetters {
  setPropertyType: (types: string[]) => void;
  setMinBeds: (beds: number) => void;
  setMinBaths?: (baths: number) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setSelectedCities: (cities: string[]) => void;
  setSelectedAmenities?: (amenities: string[]) => void;
  setMinLivingArea?: (area: number) => void;
  setMaxLivingArea?: (area: number) => void;
  setListingType?: (types: string[]) => void;
}
