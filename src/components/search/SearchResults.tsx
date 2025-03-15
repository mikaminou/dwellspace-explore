
import React from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { FilterChips } from "./FilterChips";
import { PropertyGrid } from "./PropertyGrid";
import { SortByControl } from "./SortByControl";
import { useSearch } from "@/contexts/search/SearchContext";

export function SearchResults() {
  const { t } = useLanguage();
  const { properties, loading, handleReset } = useSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-medium">{t('search.results')} ({properties.length})</h1>
          <SortByControl />
        </div>
        <FilterChips />
      </div>
      
      <PropertyGrid
        properties={properties}
        loading={loading}
        handleReset={handleReset}
      />
    </div>
  );
}
