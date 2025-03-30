
import React from "react";
import { Search } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface SearchQueryItemProps {
  searchTerm: string;
  onSelect: (text: string) => void;
}

export function SearchQueryItem({ searchTerm, onSelect }: SearchQueryItemProps) {
  const { t, dir } = useLanguage();
  
  const handleSelect = React.useCallback(() => {
    // Small delay to ensure UI state is updated before search executes
    setTimeout(() => onSelect(searchTerm), 10);
  }, [searchTerm, onSelect]);
  
  return (
    <CommandItem
      onSelect={handleSelect}
      className={dir === "rtl" ? "flex-row-reverse arabic-text text-right" : ""}
    >
      <Search className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
      {t('search.searchFor') || "Search for"} "{searchTerm}"
    </CommandItem>
  );
}
