
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useSearch } from "@/contexts/search/SearchContext";
import { FilterChips } from "@/components/search/FilterChips";

export function MapFilters() {
  const { t } = useLanguage();
  const { 
    showFilters, 
    setShowFilters, 
    getActiveFiltersCount, 
    handleReset 
  } = useSearch();

  return (
    <div className="border-b bg-white py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={showFilters ? "active" : "filter"}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="h-4 w-4 mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
          {showFilters ? t('map.hideFilters') : t('map.showFilters')}
          {getActiveFiltersCount() > 0 && (
            <span className="ml-1 bg-cta text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
        
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={handleReset}
          >
            {t('map.clearAll')}
          </Button>
        )}
      </div>
      
      <div className="w-full sm:w-auto overflow-x-auto">
        <FilterChips />
      </div>
    </div>
  );
}
