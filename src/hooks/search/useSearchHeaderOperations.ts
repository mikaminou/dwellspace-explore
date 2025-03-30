
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { parseNaturalLanguageQuery, applyNaturalLanguageFilters, validateExtractedFilters } from "@/utils/naturalLanguageSearch";
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

  // Define available property types and listing types
  const availablePropertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Studio', 'Duplex', 'Penthouse'];
  const availableListingTypes = ['Rent', 'Sale', 'Construction'];
  const availableAmenities = [
    'Pool', 'Garden', 'Garage', 'Balcony', 'Terrace', 'Parking', 'Furnished', 
    'Air Conditioning', 'Wifi', 'Elevator', 'Security', 'Gym', 'Modern', 
    'Fireplace', 'Basement', 'Storage', 'View', 'Waterfront', 'Mountain View'
  ];

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
    console.log("Extracted filters before validation:", extractedFilters);
    
    // Validate extracted filters against available options
    const validatedFilters = validateExtractedFilters(extractedFilters, {
      cities,
      propertyTypes: availablePropertyTypes,
      listingTypes: availableListingTypes,
      amenities: availableAmenities,
      maxPrice: maxPriceLimit,
      maxLivingArea: maxLivingAreaLimit
    });
    
    console.log("Filters after validation:", validatedFilters);
    
    // Apply filters if we found any valid ones
    if (Object.keys(validatedFilters).length > 0) {
      applyNaturalLanguageFilters(
        validatedFilters, 
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
    // Process natural language query
    const extractedFilters = parseNaturalLanguageQuery(searchTerm);
    console.log("Extracted filters before validation:", extractedFilters);
    
    // Validate extracted filters against available options
    const validatedFilters = validateExtractedFilters(extractedFilters, {
      cities,
      propertyTypes: availablePropertyTypes,
      listingTypes: availableListingTypes,
      amenities: availableAmenities,
      maxPrice: maxPriceLimit,
      maxLivingArea: maxLivingAreaLimit
    });
    
    console.log("Filters after validation:", validatedFilters);
    
    // Apply filters if we found any valid ones
    if (Object.keys(validatedFilters).length > 0) {
      applyNaturalLanguageFilters(
        validatedFilters, 
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
    
    // Important: Don't focus the input after clearing
    // This was removed to address the user's request
    
    // Trigger a new search with the city selection intact
    // We need to trigger this outside the current event loop to ensure
    // the state updates have been processed
    setTimeout(() => {
      handleSearch();
    }, 50);
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
