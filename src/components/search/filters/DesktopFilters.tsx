
import React from "react";
import { Separator } from "@/components/ui/separator";
import { LocationFilter } from "./LocationFilter";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { ListingTypeFilter } from "./ListingTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BedsBathsFilter } from "./BedsBathsFilter";
import { LivingAreaFilter } from "./LivingAreaFilter";
import { AmenitiesFilter } from "./AmenitiesFilter"; // Import the new component
import { FilterActions } from "./FilterActions";
import { useSearch } from "@/contexts/search/SearchContext";

export function DesktopFilters() {
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
    selectedAmenities, // Add selectedAmenities
    setSelectedAmenities, // Add setter
    handleReset,
    handleSearch
  } = useSearch();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
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

        {/* Add the Amenities filter */}
        <AmenitiesFilter
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
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
