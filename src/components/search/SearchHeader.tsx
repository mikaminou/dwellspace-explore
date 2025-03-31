
import React from "react";
import { useSearch } from "@/contexts/search/SearchContext";
import { SearchSuggestions } from "./SearchSuggestions";
import { SearchInputField } from "./SearchInputField";
import { FilterToggleButton } from "./FilterToggleButton";
import { SearchButton } from "./SearchButton";
import { useSearchHeaderOperations } from "@/hooks/search/useSearchHeaderOperations";
import { Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";

export function SearchHeader() {
  const { t } = useLanguage();
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
    setMinBaths,
    setMinLivingArea,
    setMaxLivingArea,
    setSelectedAmenities,
    setListingType,
    setLoading,
    maxPriceLimit,
    maxLivingAreaLimit,
    cities,
    // Add map state from context
    showMap,
    setShowMap,
    // Add filters applied state
    setFiltersAppliedState,
    // Check if we have active filters
    filtersAppliedState,
    // Get selected cities for placeholder text
    selectedCities
  } = useSearch();

  const {
    searchHeaderRef,
    searchHeaderSticky,
    inputRef,
    showSuggestions,
    setShowSuggestions,
    handleInputFocus,
    handleSearchClick,
    handleClearSearch,
    handleSelectSuggestion
  } = useSearchHeaderOperations({
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
    cities,
    setFiltersAppliedState
  });

  // Generate a dynamic placeholder based on whether search is active
  const getPlaceholder = () => {
    if (!filtersAppliedState) {
      return t('search.emptyPlaceholder') || "Search for properties...";
    }
    
    if (selectedCities.length > 0) {
      // Format the cities string for display
      const citiesStr = selectedCities.join(', ');
      // Use regular string interpolation for the translation key
      return t('search.cityPlaceholder', { cities: citiesStr }) || `Search in ${citiesStr}...`;
    }
    
    return t('search.placeholder') || "Try 'modern 3 bedroom house with pool in Algiers'";
  };

  return (
    <div 
      ref={searchHeaderRef}
      className={`w-full bg-white transition-all duration-300 z-20 ${
        searchHeaderSticky ? 'sticky top-0 shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <SearchInputField 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearchClick={handleSearchClick}
            handleClearSearch={handleClearSearch}
            onFocus={handleInputFocus}
            inputRef={inputRef}
            placeholder={getPlaceholder()}
          />
          
          <FilterToggleButton 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFiltersCount={getActiveFiltersCount()}
          />

          <SearchButton onClick={handleSearchClick} />
          
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 md:w-12 shrink-0"
            onClick={() => setShowMap(!showMap)}
            title={showMap ? "Hide Map" : "Show Map"}
          >
            <Map className={`h-5 w-5 ${showMap ? 'text-primary' : 'text-muted-foreground'}`} />
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
