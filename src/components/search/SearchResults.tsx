
import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { FilterChips } from "./FilterChips";
import { PropertyGrid } from "./PropertyGrid";
import { SortByControl } from "./SortByControl";
import { useSearch } from "@/contexts/search/SearchContext";

export function SearchResults() {
  const { t } = useLanguage();
  const { properties, loading, handleReset, selectedCities } = useSearch();

  // Force a re-render when properties change or loading state changes
  const [forceUpdate, setForceUpdate] = React.useState(0);
  
  useEffect(() => {
    // Force a re-render when properties change
    setForceUpdate(prev => prev + 1);
  }, [properties, loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 animate-fade-in">
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
        key={`property-grid-${forceUpdate}`}
        properties={properties}
        loading={loading}
        handleReset={handleReset}
        selectedCities={selectedCities}
      />
    </div>
  );
}
