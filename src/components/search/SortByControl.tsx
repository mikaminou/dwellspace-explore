
import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

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
    <Select value={sortOption} onValueChange={setSortOption}>
      <SelectTrigger className={`h-9 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
        <span className="flex items-center">
          <Star className="mr-2 h-4 w-4" />
          {t('search.sortBy')}
        </span>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map(option => (
          <SelectItem key={option.value} value={option.value} className={dir === 'rtl' ? 'arabic-text' : ''}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
