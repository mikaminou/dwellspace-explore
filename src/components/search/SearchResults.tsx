
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { FilterChips } from "./FilterChips";
import { PropertyGrid } from "./PropertyGrid";
import { SortByControl } from "./SortByControl";
import { useSearch } from "@/contexts/search/SearchContext";

export function SearchResults() {
  const { t } = useLanguage();
  const { properties, loading, handleReset, selectedCities } = useSearch();
  const initialRenderRef = useRef(true);
  const propertyCountRef = useRef(properties.length);
  
  // Update property count reference when properties change and not loading
  useEffect(() => {
    if (!loading && properties.length > 0) {
      propertyCountRef.current = properties.length;
      initialRenderRef.current = false;
    }
  }, [loading, properties.length]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-medium">
            {selectedCities.length > 0 && loading && (
              t('search.searching') || 'Searching...'
            )}
            {selectedCities.length > 0 && !loading && (
              `${t('search.results') || 'Results'} (${propertyCountRef.current})`
            )}
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
        initialRender={initialRenderRef.current}
      />
    </div>
  );
}
