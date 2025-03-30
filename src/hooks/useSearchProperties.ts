
import { useState, useEffect, useRef } from "react";
import { Property } from "@/api/properties";
import { useSearchInitialData } from "./search/useSearchInitialData";
import { useSearchOperations } from "./search/useSearchOperations";
import { useFilterManagement } from "./search/useFilterManagement";
import { SearchHookResult } from "./search/types";

export function useSearchProperties(): SearchHookResult {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [listingType, setListingType] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minLivingArea, setMinLivingArea] = useState(0);
  const [maxLivingArea, setMaxLivingArea] = useState(500);
  const [sortOption, setSortOption] = useState('relevance');
  const [cities, setCities] = useState<string[]>([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(50000000);
  const [maxLivingAreaLimit, setMaxLivingAreaLimit] = useState(500);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]); 
  
  const filtersApplied = useRef(false);

  // Load initial data
  useSearchInitialData(
    setMaxPriceLimit,
    setMaxPrice,
    setMaxLivingAreaLimit,
    setMaxLivingArea,
    setCities,
    setSelectedCities,
    setInitialLoadDone
  );

  // Search operations - make sure parameters are in the correct order
  const { handleSearch } = useSearchOperations(
    searchTerm,
    selectedCities,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    filtersApplied,
    selectedAmenities,
    setProperties,
    setLoading
  );

  // Filter management
  const { handleReset, getActiveFiltersCount, handleFilterRemoval } = useFilterManagement(
    selectedCities,
    propertyType,
    listingType,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    maxLivingAreaLimit,
    maxPriceLimit,
    selectedAmenities,
    setSelectedCities,
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

  // Effect to trigger search after initial data is loaded
  useEffect(() => {
    if (initialLoadDone && selectedCities.length > 0) {
      handleSearch();
    }
  }, [initialLoadDone, selectedCities, handleSearch]);

  return {
    searchTerm,
    setSearchTerm,
    properties,
    setProperties,
    loading,
    setLoading,
    showFilters,
    setShowFilters,
    selectedCities,
    setSelectedCities,
    propertyType,
    setPropertyType,
    listingType,
    setListingType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minBeds,
    setMinBeds,
    minBaths,
    setMinBaths,
    minLivingArea,
    setMinLivingArea,
    maxLivingArea,
    setMaxLivingArea,
    sortOption,
    setSortOption,
    cities,
    maxPriceLimit,
    maxLivingAreaLimit,
    activeFilterSection,
    setActiveFilterSection,
    selectedAmenities,
    setSelectedAmenities,
    filtersApplied,
    handleSearch,
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval,
    initialLoadDone
  };
}
