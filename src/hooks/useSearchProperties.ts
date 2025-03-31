
import { useState, useEffect, useRef } from "react";
import { Property } from "@/api/properties";
import { useSearchInitialData } from "./search/useSearchInitialData";
import { useSearchOperations } from "./search/useSearchOperations";
import { useFilterManagement } from "./search/useFilterManagement";
import { SearchHookResult } from "./search/types";
import { useLocalStorage } from "./useLocalStorage";
import { useLocation } from "react-router-dom";

export function useSearchProperties(): SearchHookResult {
  const location = useLocation();
  
  // State variables - use localStorage for persistence
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useLocalStorage('showFilters', false);
  const [selectedCities, setSelectedCities] = useLocalStorage('selectedCities', [] as string[]);
  const [propertyType, setPropertyType] = useLocalStorage('propertyType', [] as string[]);
  const [listingType, setListingType] = useLocalStorage('listingType', [] as string[]);
  const [minPrice, setMinPrice] = useLocalStorage('minPrice', 0);
  const [maxPrice, setMaxPrice] = useLocalStorage('maxPrice', 50000000);
  const [minBeds, setMinBeds] = useLocalStorage('minBeds', 0);
  const [minBaths, setMinBaths] = useLocalStorage('minBaths', 0);
  const [minLivingArea, setMinLivingArea] = useLocalStorage('minLivingArea', 0);
  const [maxLivingArea, setMaxLivingArea] = useLocalStorage('maxLivingArea', 500);
  const [sortOption, setSortOption] = useLocalStorage('sortOption', 'relevance');
  const [cities, setCities] = useState<string[]>([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(50000000);
  const [maxLivingAreaLimit, setMaxLivingAreaLimit] = useState(500);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useLocalStorage('selectedAmenities', [] as string[]);
  // Add map toggle state
  const [showMap, setShowMap] = useLocalStorage('showMap', false);
  // Add hovered property ID state
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  // Add a flag to track if we're coming from a direct URL or the hero section
  const [isNewSearch, setIsNewSearch] = useLocalStorage('isNewSearch', true);
  // Add a flag to track if filters were applied
  const filtersApplied = useRef(false);
  const [filtersAppliedState, setFiltersAppliedState] = useLocalStorage('filtersApplied', false);

  // Load initial data
  useSearchInitialData(
    setMaxPriceLimit,
    setMaxPrice,
    setMaxLivingAreaLimit,
    setMaxLivingArea,
    setCities,
    setSelectedCities,
    setInitialLoadDone,
    isNewSearch
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

  // Parse search parameters from URL
  useEffect(() => {
    // Only process URL parameters when entering the search page
    if (location.pathname === '/search' && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const queryParam = searchParams.get('q');
      const propertyTypeParam = searchParams.get('propertyType');
      const listingTypeParam = searchParams.get('listingType');
      
      // If we have URL params, it's a new search from the hero section
      if (queryParam || propertyTypeParam || listingTypeParam) {
        // Set isNewSearch to true to prevent default city loading
        setIsNewSearch(true);
        filtersApplied.current = true;
        setFiltersAppliedState(true);
        
        // Reset existing filters when coming from hero section
        setMinLivingArea(0);
        setMaxLivingArea(maxLivingAreaLimit);
        setMinBeds(0);
        setMinBaths(0);
        setSelectedAmenities([]);
        
        // Reset existing search and set new parameters
        if (queryParam) {
          setSearchTerm(queryParam);
        }
        
        if (propertyTypeParam && propertyTypeParam !== 'any') {
          setPropertyType([propertyTypeParam]);
        } else {
          setPropertyType([]);
        }
        
        if (listingTypeParam && listingTypeParam !== 'any') {
          setListingType([listingTypeParam]);
        } else {
          setListingType([]);
        }
        
        // We'll automatically search after the initialLoadDone effect runs
      }
    }
  }, [location, setSearchTerm, setPropertyType, setListingType, setIsNewSearch, 
      setMinLivingArea, setMaxLivingArea, maxLivingAreaLimit, setMinBeds, 
      setMinBaths, setSelectedAmenities, setFiltersAppliedState]);

  // Effect to trigger search after initial data is loaded
  useEffect(() => {
    if (initialLoadDone) {
      if (filtersAppliedState || location.search) {
        // If filters were applied or we have URL params, run search
        filtersApplied.current = true;
        handleSearch();
      } else if (isNewSearch && selectedCities.length > 0) {
        // First time, with default city and no filters
        filtersApplied.current = true;
        handleSearch();
        setIsNewSearch(false);
      }
    }
  }, [initialLoadDone, selectedCities, handleSearch, isNewSearch, filtersAppliedState, location.search]);

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
    initialLoadDone,
    // Add map toggle state
    showMap,
    setShowMap,
    // Add hovered property ID state
    hoveredPropertyId,
    setHoveredPropertyId,
    // Add isNewSearch flag
    isNewSearch,
    setIsNewSearch,
    // Add filtersApplied flag
    filtersAppliedState,
    setFiltersAppliedState
  };
}
