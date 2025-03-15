
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Check, Star, X } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface FilterActionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  handleReset: () => void;
  handleSearch: () => void;
  isMobile?: boolean;
}

export function FilterActions({ 
  sortOption, 
  setSortOption, 
  handleReset, 
  handleSearch,
  isMobile = false
}: FilterActionsProps) {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'relevance', label: t('search.relevance') },
    { value: 'priceAsc', label: t('search.priceAsc') },
    { value: 'priceDesc', label: t('search.priceDesc') },
    { value: 'areaAsc', label: t('search.areaAsc') },
    { value: 'areaDesc', label: t('search.areaDesc') },
  ];

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
      
      <div className="flex space-x-2">
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className={isMobile ? "h-9 text-sm" : "h-9"}>
            <span className="flex items-center">
              <Star className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} />
              {t('search.sortBy')}
            </span>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="cta" 
          size="sm" 
          onClick={handleSearch}
          className={isMobile ? "text-sm" : ""}
        >
          {!isMobile && <Check className="mr-2 h-4 w-4" />}
          {t('search.applyFilters')}
        </Button>
      </div>
    </div>
  );
}
