
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { FilterChips } from "./FilterChips";
import { PropertyGrid } from "./PropertyGrid";
import { SortByControl } from "./SortByControl";
import { useSearch } from "@/contexts/search/SearchContext";

export function SearchResults() {
  const { t } = useLanguage();
  const { properties, loading, handleReset, selectedCities } = useSearch();
  // Add ref to track previous loading state
  const loadingRef = useRef(loading);
  const propertiesCountRef = useRef(properties.length);
  
  // Use effect to prevent unnecessary re-renders during scroll
  useEffect(() => {
    loadingRef.current = loading;
    
    // Only update the count reference when we have new data
    if (!loading && properties.length > 0) {
      propertiesCountRef.current = properties.length;
    }
  }, [loading, properties]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-medium">
            {selectedCities.length > 0 && !loading && 
              `${t('search.results') || 'Results'} (${propertiesCountRef.current})`
            }
            {selectedCities.length > 0 && loading && 
              `${t('search.searching') || 'Searching...'}`
            }
          </h1>
          <SortByControl />
        </div>
        <FilterChips />
      </div>
      
      <PropertyGrid
        properties={properties}
        loading={loading}
        handleReset={handleReset}
        selectedCities={selectedCities}
      />
    </div>
  );
}
