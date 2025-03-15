
import React, { useMemo } from "react";
import { MainNav } from "@/components/MainNav";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { FilterChips } from "@/components/search/FilterChips";
import { PropertyGrid } from "@/components/search/PropertyGrid";
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

  // Memoize filter props to prevent unnecessary re-renders
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
    sortOption,
    setSortOption,
    maxPriceLimit,
    maxLivingAreaLimit,
    cities,
    handleReset,
    handleSearch,
    activeFilterSection,
    setActiveFilterSection
  }), [
    showFilters, selectedCity, propertyType, listingType, minPrice, maxPrice,
    minBeds, minBaths, minLivingArea, maxLivingArea, sortOption, 
    maxPriceLimit, maxLivingAreaLimit, cities, activeFilterSection
  ]);

  // Memoize filter chip props
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
        <div className="mb-6">
          <h1 className="text-xl font-medium mb-3">{t('search.results')} ({properties.length})</h1>
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
