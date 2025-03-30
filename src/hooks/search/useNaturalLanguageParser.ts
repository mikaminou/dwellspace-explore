
import { useState } from "react";
import { toast } from "sonner";
import { 
  parseNaturalLanguageQuery, 
  validateExtractedFilters, 
  applyNaturalLanguageFilters 
} from "@/utils/naturalLanguageSearch";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { FilterSetters } from "@/utils/naturalLanguageSearch/types";

export function useNaturalLanguageParser({
  searchTerm,
  setters,
  validationOptions,
  showFilters,
  setShowFilters,
  filtersApplied,
  handleSearch
}: {
  searchTerm: string;
  setters: FilterSetters;
  validationOptions: {
    cities: string[];
    propertyTypes: string[];
    listingTypes: string[];
    amenities: string[];
    maxPrice: number;
    maxLivingArea: number;
  };
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filtersApplied: React.MutableRefObject<boolean>;
  handleSearch: () => void;
}) {
  const { t } = useLanguage();

  const processNaturalLanguageQuery = () => {
    // Process natural language query
    const extractedFilters = parseNaturalLanguageQuery(searchTerm);
    console.log("Extracted filters before validation:", extractedFilters);
    
    // Validate extracted filters against available options
    const validatedFilters = validateExtractedFilters(extractedFilters, validationOptions);
    
    console.log("Filters after validation:", validatedFilters);
    
    // Apply filters if we found any valid ones
    if (Object.keys(validatedFilters).length > 0) {
      applyNaturalLanguageFilters(validatedFilters, setters);
      
      // Mark filters as applied
      filtersApplied.current = true;
      
      // Show filters if we've applied any
      if (!showFilters) {
        setShowFilters(true);
      }
    }
    
    handleSearch();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    toast(t('search.searchingFor') || "Searching for", {
      description: suggestion,
      duration: 3000,
    });
  };

  return {
    processNaturalLanguageQuery,
    handleSelectSuggestion
  };
}
