
import React from "react";
import { Separator } from "@/components/ui/separator";
import { LocationFilter } from "./LocationFilter";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { ListingTypeFilter } from "./ListingTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BedsBathsFilter } from "./BedsBathsFilter";
import { LivingAreaFilter } from "./LivingAreaFilter";
import { FilterActions } from "./FilterActions";
import { FilterProps } from "./FilterTypes";

export function DesktopFilters({ 
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
}: Omit<FilterProps, 'showFilters' | 'activeFilterSection' | 'setActiveFilterSection'>) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <LocationFilter 
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cities={cities}
        />

        <PropertyTypeFilter
          propertyType={propertyType}
          setPropertyType={setPropertyType}
        />

        <ListingTypeFilter
          listingType={listingType}
          setListingType={setListingType}
        />

        <PriceRangeFilter
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          maxPriceLimit={maxPriceLimit}
        />

        <BedsBathsFilter
          minBeds={minBeds}
          setMinBeds={setMinBeds}
          minBaths={minBaths}
          setMinBaths={setMinBaths}
        />

        <LivingAreaFilter
          minLivingArea={minLivingArea}
          setMinLivingArea={setMinLivingArea}
          maxLivingArea={maxLivingArea}
          setMaxLivingArea={setMaxLivingArea}
          maxLivingAreaLimit={maxLivingAreaLimit}
        />
      </div>
      
      <Separator className="my-4" />
      
      <FilterActions
        handleReset={handleReset}
        handleSearch={handleSearch}
      />
    </div>
  );
}
