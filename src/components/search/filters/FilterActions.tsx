
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Search, FilterIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface FilterActionsProps {
  handleReset: () => void;
  handleSearch: () => void;
  isMobile?: boolean;
}

export function FilterActions({ 
  handleReset, 
  handleSearch,
  isMobile = false
}: FilterActionsProps) {
  const { t } = useLanguage();

  const handleResetClick = () => {
    // Blur any focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    handleReset();
  };

  const handleSearchClick = () => {
    // Blur any focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    handleSearch();
  };

  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={handleResetClick} 
        size={isMobile ? "sm" : "default"}
        className={`${isMobile ? 'text-sm' : ''} hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors`}
      >
        <X className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} />
        {t('search.resetFilters')}
      </Button>
      
      <Button 
        variant="default" 
        size={isMobile ? "sm" : "default"}
        onClick={handleSearchClick}
        className={`${isMobile ? 'text-sm' : ''} bg-primary hover:bg-primary-dark text-white transition-colors animate-pulse`}
      >
        <Search className="mr-2 h-4 w-4" />
        {t('search.applyFilters')}
      </Button>
    </div>
  );
}
