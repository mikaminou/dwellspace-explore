
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

  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={handleReset} 
        size={isMobile ? "sm" : "default"}
        className={`${isMobile ? 'text-sm' : ''} hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors`}
      >
        <X className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} />
        {t('search.resetFilters')}
      </Button>
      
      <Button 
        variant="default" 
        size={isMobile ? "sm" : "default"}
        onClick={handleSearch}
        className={`${isMobile ? 'text-sm' : ''} bg-primary hover:bg-primary-dark text-white transition-colors`}
      >
        <Search className="mr-2 h-4 w-4" />
        {t('search.applyFilters')}
      </Button>
    </div>
  );
}
