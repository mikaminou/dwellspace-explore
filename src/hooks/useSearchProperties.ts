
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
  // Add a flag to track if filters have been changed since last search
  const [filtersChanged, setFiltersChanged] = useLocalStorage('filtersChanged', false);

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

  // Search operations
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

  // Monitor filter changes
  useEffect(() => {
    setFiltersChanged(true);
  }, [
    propertyType, listingType, minPrice, maxPrice, minBeds, 
    minBaths, minLivingArea, maxLivingArea, selectedAmenities,
    setFiltersChanged
  ]);
  
  // Reset filtersChanged when search is performed
  const handleSearchWithReset = () => {
    setFiltersChanged(false);
    handleSearch();
  };

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
    handleSearchWithReset
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
        
        // Reset all filters to ensure we start fresh
        setMinLivingArea(0);
        setMaxLivingArea(maxLivingAreaLimit);
        setMinBeds(0);
        setMinBaths(0);
        setMinPrice(0);
        setMaxPrice(maxPriceLimit);
        setSelectedAmenities([]);
        
        // Reset existing search and set new parameters
        if (queryParam) {
          setSearchTerm(queryParam);
        } else {
          setSearchTerm('');
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
        
        // Show filters if specific filters were applied
        if ((propertyTypeParam && propertyTypeParam !== 'any') || 
            (listingTypeParam && listingTypeParam !== 'any')) {
          setShowFilters(true);
        }
        
        // Mark filters as not changed since we're about to perform a search
        setFiltersChanged(false);
      }
    } else if (location.pathname === '/search' && !location.search) {
      // User navigated directly to /search without parameters
      // We'll show the empty state with a prompt to search
      if (!filtersAppliedState) {
        setIsNewSearch(true);
      }
    }
  }, [
    location, setSearchTerm, setPropertyType, setListingType, setIsNewSearch, 
    setMinLivingArea, setMaxLivingArea, maxLivingAreaLimit, setMinBeds, 
    setMinBaths, setSelectedAmenities, setFiltersAppliedState, setMinPrice,
    setMaxPrice, maxPriceLimit, setShowFilters, filtersAppliedState, setFiltersChanged
  ]);

  // Effect to trigger search after initial data is loaded
  useEffect(() => {
    if (initialLoadDone) {
      if (location.search) {
        // If we have URL params, run search
        filtersApplied.current = true;
        handleSearchWithReset();
      } else if (filtersAppliedState && selectedCities.length > 0) {
        // If filters were applied and we have cities, run search
        filtersApplied.current = true;
        handleSearchWithReset();
      } else if (isNewSearch && selectedCities.length > 0 && !location.search) {
        // First time with default city and no filters - don't auto search,
        // let the user initiate the search
        setIsNewSearch(false);
      }
    }
  }, [
    initialLoadDone, selectedCities, handleSearchWithReset, isNewSearch, 
    filtersAppliedState, location.search, setIsNewSearch
  ]);

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
    handleSearch: handleSearchWithReset,
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval,
    initialLoadDone,
    showMap,
    setShowMap,
    hoveredPropertyId,
    setHoveredPropertyId,
    isNewSearch,
    setIsNewSearch,
    filtersAppliedState,
    setFiltersAppliedState,
    filtersChanged,
    setFiltersChanged
  };
}
