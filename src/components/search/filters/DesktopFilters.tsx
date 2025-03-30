
import React from "react";
import { Separator } from "@/components/ui/separator";
import { LocationFilter } from "./LocationFilter";
import { PropertyTypeFilter } from "./PropertyTypeFilter";
import { ListingTypeFilter } from "./ListingTypeFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BedsBathsFilter } from "./BedsBathsFilter";
import { LivingAreaFilter } from "./LivingAreaFilter";
import { AmenitiesFilter } from "./AmenitiesFilter";
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
    selectedAmenities,
    setSelectedAmenities,
    handleReset,
    handleSearch
  } = useSearch();

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
        <div className="p-3">
          <LocationFilter 
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
          />
        </div>

        <div className="p-3">
          <PropertyTypeFilter
            propertyType={propertyType}
            setPropertyType={setPropertyType}
          />
        </div>

        <div className="p-3">
          <ListingTypeFilter
            listingType={listingType}
            setListingType={setListingType}
          />
        </div>

        <div className="p-3">
          <PriceRangeFilter
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            maxPriceLimit={maxPriceLimit}
          />
        </div>

        <div className="p-3">
          <BedsBathsFilter
            minBeds={minBeds}
            setMinBeds={setMinBeds}
            minBaths={minBaths}
            setMinBaths={setMinBaths}
          />
        </div>

        <div className="p-3">
          <LivingAreaFilter
            minLivingArea={minLivingArea}
            setMinLivingArea={setMinLivingArea}
            maxLivingArea={maxLivingArea}
            setMaxLivingArea={setMaxLivingArea}
            maxLivingAreaLimit={maxLivingAreaLimit}
          />
        </div>

        <div className="p-3">
          <AmenitiesFilter
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
          />
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <FilterActions
        handleReset={handleReset}
        handleSearch={handleSearch}
      />
    </div>
  );
}
