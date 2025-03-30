import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Filter as FilterIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useSearch } from "@/contexts/search/SearchContext";
import { SearchSuggestions } from "./SearchSuggestions";
import { toast } from "@/components/ui/use-toast";
import { parseNaturalLanguageQuery, applyNaturalLanguageFilters } from "@/utils/naturalLanguageSearch";

export function SearchHeader() {
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, dir } = useLanguage();
  const { 
    searchTerm, 
    setSearchTerm, 
    showFilters, 
    setShowFilters, 
    getActiveFiltersCount, 
    handleSearch,
    setPropertyType,
    setMinBeds,
    setMinPrice,
    setMaxPrice,
    setSelectedCities,
    filtersApplied,
    handleReset,
    selectedCities
  } = useSearch();

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
        { setPropertyType, setMinBeds, setMinPrice, setMaxPrice, setSelectedCities }
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
        { setPropertyType, setMinBeds, setMinPrice, setMaxPrice, setSelectedCities }
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
    setSearchTerm('');
    
    // Instead of a full reset that might clear cities as well,
    // we'll selectively reset only what's related to the search term
    // while keeping the selected city intact
    filtersApplied.current = true; // Keep this true so we still show results
    
    // Only reset filters affected by search term, not city selection
    setPropertyType([]);
    setMinBeds(0);
    setMinPrice(0);
    
    // Re-run search with current city selection
    setTimeout(() => {
      handleSearch();
    }, 0);
    
    // Focus the input field after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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

  return (
    <div 
      ref={searchHeaderRef}
      className={`w-full bg-white transition-all duration-300 z-20 ${
        searchHeaderSticky ? 'sticky top-0 shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative w-full md:flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              ref={inputRef}
              className={`pl-10 ${dir === 'rtl' ? 'arabic-text' : ''} h-12 border-2 focus:border-cta transition-colors`} 
              placeholder={t('search.placeholder') || "Try 'modern 3 bedroom house with pool in Algiers'"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleInputFocus}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                  setShowSuggestions(false);
                }
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
          
          <Button 
            variant={showFilters ? "active" : "filter"} 
            size="lg"
            className={`whitespace-nowrap ${dir === 'rtl' ? 'arabic-text' : ''} w-full md:w-auto transition-all duration-200`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {showFilters ? t('search.hideFilters') : t('search.showFilters')}
            {getActiveFiltersCount() > 0 && (
              <span className="ml-1 bg-cta text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>

          <Button 
            onClick={handleSearchClick} 
            variant="cta" 
            size="lg"
            className="w-full md:w-auto transition-all duration-200"
          >
            <SearchIcon className="h-4 w-4 mr-1" />
            {t('search.search')}
          </Button>
        </div>
      </div>

      <SearchSuggestions
        open={showSuggestions}
        setOpen={setShowSuggestions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSelectSuggestion={handleSelectSuggestion}
      />
    </div>
  );
}
