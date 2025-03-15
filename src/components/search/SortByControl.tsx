
import React from "react";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SortByControlProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

export function SortByControl({ sortOption, setSortOption }: SortByControlProps) {
  const { t, dir } = useLanguage();

  const sortOptions = [
    { value: 'relevance', label: t('search.relevance') },
    { value: 'priceAsc', label: t('search.priceAsc') },
    { value: 'priceDesc', label: t('search.priceDesc') },
    { value: 'areaAsc', label: t('search.areaAsc') },
    { value: 'areaDesc', label: t('search.areaDesc') },
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground">
        {t('search.sortBy')}:
      </span>
      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger 
          className={cn(
            "h-9 min-w-[180px] transition-all duration-200 hover:bg-muted/50 focus:ring-primary", 
            dir === 'rtl' ? 'arabic-text' : ''
          )}
        >
          <SelectValue placeholder={t('search.selectSortOption')} />
        </SelectTrigger>
        <SelectContent
          className="min-w-[180px]"
          align="start"
          sideOffset={8}
          position="popper"
        >
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className={cn(
                "transition-colors duration-150 hover:bg-accent/20 data-[selected]:bg-accent/30",
                dir === 'rtl' ? 'arabic-text' : ''
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
