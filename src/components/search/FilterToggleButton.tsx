
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface FilterToggleButtonProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
}

export function FilterToggleButton({
  showFilters,
  setShowFilters,
  activeFiltersCount,
}: FilterToggleButtonProps) {
  const { t, dir } = useLanguage();

  return (
    <Button 
      variant={showFilters ? "active" : "filter"} 
      size="lg"
      className={`whitespace-nowrap ${dir === 'rtl' ? 'arabic-text' : ''} w-full md:w-auto transition-all duration-200`}
      onClick={() => setShowFilters(!showFilters)}
    >
      <FilterIcon className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
      {showFilters ? t('search.hideFilters') : t('search.showFilters')}
      {activeFiltersCount > 0 && (
        <span className="ml-1 bg-cta text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
          {activeFiltersCount}
        </span>
      )}
    </Button>
  );
}
