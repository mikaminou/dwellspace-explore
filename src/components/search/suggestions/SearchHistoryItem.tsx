
import React from "react";
import { Clock } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { SearchSuggestion } from "../SearchSuggestions";

interface SearchHistoryItemProps {
  item: SearchSuggestion;
  onSelect: (text: string) => void;
}

export function SearchHistoryItem({ item, onSelect }: SearchHistoryItemProps) {
  const { dir } = useLanguage();
  
  const handleSelect = React.useCallback(() => {
    // Small delay to ensure UI state is updated before search executes
    setTimeout(() => onSelect(item.text), 10);
  }, [item.text, onSelect]);
  
  return (
    <CommandItem
      onSelect={handleSelect}
      className={dir === "rtl" ? "flex-row-reverse arabic-text text-right" : ""}
    >
      <Clock className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"} text-muted-foreground`} />
      {item.text}
    </CommandItem>
  );
}
