
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
  
  return (
    <CommandItem
      onSelect={() => onSelect(searchTerm)}
      className={dir === "rtl" ? "flex-row-reverse arabic-text text-right" : ""}
    >
      <Search className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
      {t('search.searchFor') || "Search for"} "{searchTerm}"
    </CommandItem>
  );
}
