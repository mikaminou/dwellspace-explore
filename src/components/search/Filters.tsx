
import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { MobileFilters } from "./filters/MobileFilters";
import { DesktopFilters } from "./filters/DesktopFilters";
import { FilterProps } from "./filters/FilterTypes";

export function Filters({
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
}: FilterProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!showFilters) return null;

  return (
    <div className="bg-white border-t border-b border-gray-200 py-4 overflow-hidden transition-all duration-300">
      <div className="container mx-auto px-4">
        {isMobile ? (
          <MobileFilters
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
            maxPriceLimit={maxPriceLimit}
            maxLivingAreaLimit={maxLivingAreaLimit}
            cities={cities}
            handleReset={handleReset}
            handleSearch={handleSearch}
            activeFilterSection={activeFilterSection}
            setActiveFilterSection={setActiveFilterSection}
          />
        ) : (
          <DesktopFilters
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
            maxPriceLimit={maxPriceLimit}
            maxLivingAreaLimit={maxLivingAreaLimit}
            cities={cities}
            handleReset={handleReset}
            handleSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
}
