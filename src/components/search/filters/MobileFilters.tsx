
import React from "react";
import { MobileFilterSection } from "../MobileFilterSection";
import { LocationFilter } from "./LocationFilter";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { ListingTypeFilter } from "./ListingTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BedsBathsFilter } from "./BedsBathsFilter";
import { LivingAreaFilter } from "./LivingAreaFilter";
import { FilterActions } from "./FilterActions";
import { useSearch } from "@/contexts/search/SearchContext";

export function MobileFilters() {
  const {
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
  } = useSearch();

  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <MobileFilterSection 
          section="location" 
          activeSection={activeFilterSection} 
          onToggle={toggleFilterSection}
        >
          <LocationFilter 
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
          />
        </MobileFilterSection>

        <MobileFilterSection 
          section="propertyType" 
          activeSection={activeFilterSection} 
          onToggle={toggleFilterSection}
        >
          <PropertyTypeFilter
            propertyType={propertyType}
            setPropertyType={setPropertyType}
          />
        </MobileFilterSection>

        <MobileFilterSection 
          section="listingType" 
          activeSection={activeFilterSection} 
          onToggle={toggleFilterSection}
        >
          <ListingTypeFilter
            listingType={listingType}
            setListingType={setListingType}
          />
        </MobileFilterSection>

        <MobileFilterSection 
          section="priceRange" 
          activeSection={activeFilterSection} 
          onToggle={toggleFilterSection}
        >
          <PriceRangeFilter
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            maxPriceLimit={maxPriceLimit}
          />
        </MobileFilterSection>

        <MobileFilterSection 
          section="bedsBaths" 
          activeSection={activeFilterSection} 
          onToggle={toggleFilterSection}
        >
          <BedsBathsFilter
            minBeds={minBeds}
            setMinBeds={setMinBeds}
            minBaths={minBaths}
            setMinBaths={setMinBaths}
          />
        </MobileFilterSection>

        <MobileFilterSection 
          section="livingArea" 
          activeSection={activeFilterSection} 
          onToggle={toggleFilterSection}
        >
          <LivingAreaFilter
            minLivingArea={minLivingArea}
            setMinLivingArea={setMinLivingArea}
            maxLivingArea={maxLivingArea}
            setMaxLivingArea={setMaxLivingArea}
            maxLivingAreaLimit={maxLivingAreaLimit}
          />
        </MobileFilterSection>
      </div>

      <FilterActions
        handleReset={handleReset}
        handleSearch={handleSearch}
        isMobile={true}
      />
    </div>
  );
}
