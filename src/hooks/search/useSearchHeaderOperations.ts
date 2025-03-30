
import { useRef, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
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
  filtersApplied,
  handleSearch,
  setLoading,
  showFilters,
  setShowFilters,
  maxPriceLimit,
  maxLivingAreaLimit
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);

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
    
    // Apply filters if we found any
    if (Object.keys(extractedFilters).length > 0) {
      applyNaturalLanguageFilters(
        extractedFilters, 
        { 
          setPropertyType, 
          setMinBeds, 
          setMinPrice, 
          setMaxPrice, 
          setSelectedCities,
          setSelectedAmenities 
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
    
    toast({
      title: t('search.searchingFor') || "Searching for",
      description: suggestion,
      duration: 3000,
    });
  };

  const handleSearchClick = () => {
    // Process natural language query
    const extractedFilters = parseNaturalLanguageQuery(searchTerm);
    
    // Apply filters if we found any
    if (Object.keys(extractedFilters).length > 0) {
      applyNaturalLanguageFilters(
        extractedFilters, 
        { 
          setPropertyType, 
          setMinBeds, 
          setMinPrice, 
          setMaxPrice, 
          setSelectedCities 
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
    
    // Set loading state to indicate data is being fetched
    setLoading(true);
    
    // Make sure filters are still considered applied (to show results)
    filtersApplied.current = true;
    
    // Delay the search operation slightly to ensure state updates have happened
    setTimeout(() => {
      // Trigger a new search with the city selection intact
      handleSearch();
    }, 50);
    
    // Focus the input field after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
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
