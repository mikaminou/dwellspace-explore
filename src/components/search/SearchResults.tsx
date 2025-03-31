
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { FilterChips } from "./FilterChips";
import { PropertyGrid } from "./PropertyGrid";
import { SortByControl } from "./SortByControl";
import { useSearch } from "@/contexts/search/SearchContext";

export function SearchResults() {
  const { t } = useLanguage();
  const { properties, loading, handleReset, selectedCities, showMap } = useSearch();
  // Add a local key to force re-renders when properties change
  const [renderKey, setRenderKey] = useState(0);
  
  // Force re-render when properties change
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [properties, loading]);

  // Re-render when map is toggled
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [showMap]);

  return (
    <div className={`container mx-auto py-6 transition-all duration-300 ${showMap ? 'pr-2' : 'px-2'}`}>
      <div className="mb-5 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-medium">
            {selectedCities.length > 0 && 
              `${t('search.results') || 'Results'} (${properties.length})`
            }
          </h1>
          <SortByControl />
        </div>
        <FilterChips />
      </div>
      
      <PropertyGrid
        key={`property-grid-${renderKey}`}
        properties={properties}
        loading={loading}
        handleReset={handleReset}
        selectedCities={selectedCities}
        showMap={showMap}
      />
    </div>
  );
}
