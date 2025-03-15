
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
        size="sm"
        className={isMobile ? "text-sm" : ""}
      >
        <X className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} />
        {t('search.resetFilters')}
      </Button>
      
      <Button 
        variant="cta" 
        size="sm" 
        onClick={handleSearch}
        className={isMobile ? "text-sm" : ""}
      >
        {t('search.applyFilters')}
      </Button>
    </div>
  );
}
