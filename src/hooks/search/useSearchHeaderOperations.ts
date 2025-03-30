
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { parseNaturalLanguageQuery, applyNaturalLanguageFilters } from "@/utils/naturalLanguageSearch";
import { useLanguage } from "@/contexts/language/LanguageContext";

export function useSearchHeaderOperations({
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
  filtersApplied,
  handleSearch,
  setLoading,
  showFilters,
  setShowFilters,
  maxPriceLimit,
  maxLivingAreaLimit,
  cities
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);
  const clearOperationInProgress = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (searchHeaderRef.current) {
        const rect = searchHeaderRef.current.getBoundingClientRect();
        setSearchHeaderSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSuggestions(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    
    // Process natural language query
    const extractedFilters = parseNaturalLanguageQuery(suggestion);
    
    // Get valid property types
    const validPropertyTypes = ['house', 'apartment', 'villa', 'land'];
    
    // Get valid listing types
    const validListingTypes = ['rent', 'sale', 'construction'];
    
    // Get valid amenities
    const validAmenities = [
      'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 
      'furnished', 'air conditioning', 'wifi', 'elevator', 'security', 
      'gym', 'modern', 'fireplace', 'basement', 'storage', 'view', 
      'waterfront', 'mountain view'
    ];
    
    // Apply filters if we found any, with validation
    if (Object.keys(extractedFilters).length > 0) {
      applyNaturalLanguageFilters(
        extractedFilters, 
        { 
          setPropertyType, 
          setMinBeds,
          setMinBaths, 
          setMinPrice, 
          setMaxPrice, 
          setSelectedCities,
          setSelectedAmenities,
          setMinLivingArea,
          setMaxLivingArea,
          setListingType
        },
        {
          cities: cities, // Pass available cities for validation
          propertyTypes: validPropertyTypes,
          listingTypes: validListingTypes,
          amenities: validAmenities
        }
      );
      
      // Mark filters as applied
      filtersApplied.current = true;
      
      // Show filters if we've applied any
      if (!showFilters) {
        setShowFilters(true);
      }
    }
    
    handleSearch();
    
    toast(t('search.searchingFor') || "Searching for", {
      description: suggestion,
      duration: 3000,
    });
  };

  const handleSearchClick = () => {
    // Prevent execution if clear operation is in progress
    if (clearOperationInProgress.current) return;
    
    // Process natural language query
    const extractedFilters = parseNaturalLanguageQuery(searchTerm);
    
    // Get valid property types
    const validPropertyTypes = ['house', 'apartment', 'villa', 'land'];
    
    // Get valid listing types
    const validListingTypes = ['rent', 'sale', 'construction'];
    
    // Get valid amenities
    const validAmenities = [
      'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 
      'furnished', 'air conditioning', 'wifi', 'elevator', 'security', 
      'gym', 'modern', 'fireplace', 'basement', 'storage', 'view', 
      'waterfront', 'mountain view'
    ];
    
    // Apply filters if we found any, with validation
    if (Object.keys(extractedFilters).length > 0) {
      applyNaturalLanguageFilters(
        extractedFilters, 
        { 
          setPropertyType, 
          setMinBeds,
          setMinBaths, 
          setMinPrice, 
          setMaxPrice, 
          setSelectedCities,
          setSelectedAmenities,
          setMinLivingArea,
          setMaxLivingArea,
          setListingType
        },
        {
          cities: cities, // Pass available cities for validation
          propertyTypes: validPropertyTypes,
          listingTypes: validListingTypes,
          amenities: validAmenities
        }
      );
      
      // Mark filters as applied
      filtersApplied.current = true;
      
      // Show filters if we've applied any
      if (!showFilters) {
        setShowFilters(true);
      }
    }
    
    handleSearch();
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    // Set a flag to prevent concurrent operations
    clearOperationInProgress.current = true;
    
    // First clear the search term
    setSearchTerm('');
    
    // Clear all non-city related filters
    setPropertyType([]);
    setMinBeds(0);
    setMinBaths(0);
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
    setMinLivingArea(0);
    setMaxLivingArea(maxLivingAreaLimit);
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
      // Reset the flag after the operation completes
      clearOperationInProgress.current = false;
    }, 150); // Increased timeout to ensure state updates are processed
  };

  return {
    searchHeaderRef,
    searchHeaderSticky,
    inputRef,
    showSuggestions,
    setShowSuggestions,
    handleInputFocus,
    handleSearchClick,
    handleClearSearch,
    handleSelectSuggestion
  };
}
