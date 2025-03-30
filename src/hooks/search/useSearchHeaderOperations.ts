
import { useRef, useState } from "react";
import { FilterSetters } from "@/utils/naturalLanguageSearch/types";
import { useSearchHeaderScroll } from "./useSearchHeaderScroll";
import { useSearchKeyboardShortcuts } from "./useSearchKeyboardShortcuts";
import { useNaturalLanguageParser } from "./useNaturalLanguageParser";
import { useSearchInputOperations } from "./useSearchInputOperations";

export function useSearchHeaderOperations({
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
  setListingType,
  filtersApplied,
  handleSearch,
  setLoading,
  showFilters,
  setShowFilters,
  maxPriceLimit,
  maxLivingAreaLimit,
  cities
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchHeaderRef = useRef<HTMLDivElement>(null);

  // Define available property types and listing types
  const availablePropertyTypes = ['House', 'Apartment', 'Villa', 'Condo', 'Studio', 'Duplex', 'Penthouse'];
  const availableListingTypes = ['Rent', 'Sale', 'Construction'];
  const availableAmenities = [
    'Pool', 'Garden', 'Garage', 'Balcony', 'Terrace', 'Parking', 'Furnished', 
    'Air Conditioning', 'Wifi', 'Elevator', 'Security', 'Gym', 'Modern', 
    'Fireplace', 'Basement', 'Storage', 'View', 'Waterfront', 'Mountain View'
  ];

  // Handle scroll behavior for sticky header
  const searchHeaderSticky = useSearchHeaderScroll(searchHeaderRef);

  // Set up keyboard shortcuts
  useSearchKeyboardShortcuts({ setShowSuggestions });

  // Set up input operations
  const { handleInputFocus, handleClearSearch } = useSearchInputOperations({
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
    setListingType,
    setLoading,
    filtersApplied,
    handleSearch,
    setShowSuggestions
  });

  // Set up filter setters for natural language parsing
  const filterSetters: FilterSetters = {
    setPropertyType,
    setMinBeds,
    setMinBaths,
    setMinPrice,
    setMaxPrice,
    setSelectedCities,
    setSelectedAmenities,
    setMinLivingArea,
    setMaxLivingArea,
    setListingType
  };

  // Setup validation options
  const validationOptions = {
    cities,
    propertyTypes: availablePropertyTypes,
    listingTypes: availableListingTypes,
    amenities: availableAmenities,
    maxPrice: maxPriceLimit,
    maxLivingArea: maxLivingAreaLimit
  };

  // Set up natural language parser
  const { processNaturalLanguageQuery, handleSelectSuggestion } = useNaturalLanguageParser({
    searchTerm,
    setters: filterSetters,
    validationOptions,
    showFilters,
    setShowFilters,
    filtersApplied,
    handleSearch
  });

  const handleSearchClick = () => {
    processNaturalLanguageQuery();
    setShowSuggestions(false);
  };

  const handleSelectSuggestionWrapper = (suggestion: string) => {
    setSearchTerm(suggestion);
    processNaturalLanguageQuery();
    handleSelectSuggestion(suggestion);
    setShowSuggestions(false);
  };

  return {
    searchHeaderRef,
    searchHeaderSticky,
    inputRef,
    showSuggestions,
    setShowSuggestions,
    handleInputFocus,
    handleSearchClick,
    handleClearSearch,
    handleSelectSuggestion: handleSelectSuggestionWrapper
  };
}
