
import React from "react";
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
    getActiveFiltersCount
  } = useSearchProperties();

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
      
      <Filters
        showFilters={showFilters}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        listingType={listingType}
        setListingType={setListingType}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minBeds={minBeds}
        setMinBeds={setMinBeds}
        minBaths={minBaths}
        setMinBaths={setMinBaths}
        minLivingArea={minLivingArea}
        setMinLivingArea={setMinLivingArea}
        maxLivingArea={maxLivingArea}
        setMaxLivingArea={setMaxLivingArea}
        sortOption={sortOption}
        setSortOption={setSortOption}
        maxPriceLimit={maxPriceLimit}
        maxLivingAreaLimit={maxLivingAreaLimit}
        cities={cities}
        handleReset={handleReset}
        handleSearch={handleSearch}
        activeFilterSection={activeFilterSection}
        setActiveFilterSection={setActiveFilterSection}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-medium mb-2">{`${t('search.results')} (${properties.length})`}</h1>
          <FilterChips
            selectedCity={selectedCity}
            propertyType={propertyType}
            listingType={listingType}
            minBeds={minBeds}
            minBaths={minBaths}
            minLivingArea={minLivingArea}
            maxLivingArea={maxLivingArea}
            maxLivingAreaLimit={maxLivingAreaLimit}
            filtersApplied={filtersApplied}
          />
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
