import React, { useMemo } from "react";
import { MainNav } from "@/components/MainNav";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { FilterChips } from "@/components/search/FilterChips";
import { PropertyGrid } from "@/components/search/PropertyGrid";
import { SortByControl } from "@/components/search/SortByControl";
import { useSearchProperties } from "@/hooks/useSearchProperties";

export default function Search() {
  const { t } = useLanguage();
  const {
    searchTerm,
    setSearchTerm,
    properties,
    loading,
    showFilters,
    setShowFilters,
    selectedCity,
    setSelectedCity,
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
    filtersApplied,
    handleSearch,
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval
  } = useSearchProperties();

  const filterProps = useMemo(() => ({
    showFilters,
    selectedCity,
    setSelectedCity,
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
    maxPriceLimit,
    maxLivingAreaLimit,
    cities,
    handleReset,
    handleSearch,
    activeFilterSection,
    setActiveFilterSection
  }), [
    showFilters, selectedCity, propertyType, listingType, minPrice, maxPrice,
    minBeds, minBaths, minLivingArea, maxLivingArea, 
    maxPriceLimit, maxLivingAreaLimit, cities, activeFilterSection
  ]);

  const filterChipProps = useMemo(() => ({
    selectedCity,
    propertyType,
    listingType,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    maxLivingAreaLimit,
    filtersApplied,
    handleFilterRemoval
  }), [
    selectedCity, propertyType, listingType, minBeds, minBaths,
    minLivingArea, maxLivingArea, maxLivingAreaLimit, filtersApplied
  ]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <SearchHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        getActiveFiltersCount={getActiveFiltersCount}
        handleSearch={handleSearch}
      />
      
      <Filters {...filterProps} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
            <div className="flex items-center">
              <h1 className="text-xl font-medium mr-4">{t('search.results')} ({properties.length})</h1>
              <SortByControl sortOption={sortOption} setSortOption={setSortOption} />
            </div>
          </div>
          <FilterChips {...filterChipProps} />
        </div>
        
        <PropertyGrid
          properties={properties}
          loading={loading}
          handleReset={handleReset}
        />
      </div>
    </div>
  );
}
