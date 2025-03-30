
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

  // Get active filters count for styling
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="border-b bg-white py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={showFilters ? "active" : "filter"}
          size="sm"
          className={`whitespace-nowrap transition-all duration-200 ${activeFiltersCount > 0 ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="h-4 w-4 mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
          {showFilters ? t('map.hideFilters') : t('map.showFilters')}
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs animate-pulse">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={handleReset}
          >
            {t('map.clearAll')}
          </Button>
        )}
      </div>
      
      <div className="w-full sm:w-auto overflow-x-auto scrollbar-x-thin">
        <FilterChips />
      </div>
    </div>
  );
}
