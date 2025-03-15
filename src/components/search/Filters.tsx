
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-mobile";
import { MobileFilterSection } from "./MobileFilterSection";
import { LocationFilter } from "./filters/LocationFilter";
import { PropertyTypeFilter } from "./filters/PropertyTypeFilter";
import { ListingTypeFilter } from "./filters/ListingTypeFilter";
import { PriceRangeFilter } from "./filters/PriceRangeFilter";
import { BedsBathsFilter } from "./filters/BedsBathsFilter";
import { LivingAreaFilter } from "./filters/LivingAreaFilter";
import { FilterActions } from "./filters/FilterActions";

interface FiltersProps {
  showFilters: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  propertyType: string[];
  setPropertyType: (types: string[]) => void;
  listingType: string[];
  setListingType: (types: string[]) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minBeds: number;
  setMinBeds: (beds: number) => void;
  minBaths: number;
  setMinBaths: (baths: number) => void;
  minLivingArea: number;
  setMinLivingArea: (area: number) => void;
  maxLivingArea: number;
  setMaxLivingArea: (area: number) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  maxPriceLimit: number;
  maxLivingAreaLimit: number;
  cities: string[];
  handleReset: () => void;
  handleSearch: () => void;
  activeFilterSection: string | null;
  setActiveFilterSection: (section: string | null) => void;
}

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
  sortOption,
  setSortOption,
  maxPriceLimit,
  maxLivingAreaLimit,
  cities,
  handleReset,
  handleSearch,
  activeFilterSection,
  setActiveFilterSection
}: FiltersProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  if (!showFilters) return null;

  return (
    <div className="bg-white border-t border-b border-gray-200 py-4 overflow-hidden transition-all duration-300">
      <div className="container mx-auto px-4">
        {isMobile ? (
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
              sortOption={sortOption}
              setSortOption={setSortOption}
              handleReset={handleReset}
              handleSearch={handleSearch}
              isMobile={true}
            />
          </div>
        ) : (
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
              sortOption={sortOption}
              setSortOption={setSortOption}
              handleReset={handleReset}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
}
