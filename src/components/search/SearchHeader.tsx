
import React from "react";
import { useSearch } from "@/contexts/search/SearchContext";
import { SearchSuggestions } from "./SearchSuggestions";
import { SearchInputField } from "./SearchInputField";
import { FilterToggleButton } from "./FilterToggleButton";
import { SearchButton } from "./SearchButton";
import { useSearchHeaderOperations } from "@/hooks/search/useSearchHeaderOperations";

export function SearchHeader() {
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
    setLoading,
    maxPriceLimit,
    maxLivingAreaLimit,
    cities
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
    filtersApplied,
    handleSearch,
    setLoading,
    showFilters,
    setShowFilters,
    maxPriceLimit,
    maxLivingAreaLimit,
    cities
  });

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
          />
          
          <FilterToggleButton 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFiltersCount={getActiveFiltersCount()}
          />

          <SearchButton onClick={handleSearchClick} />
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
