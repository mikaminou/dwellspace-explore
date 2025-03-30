
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
  
  return (
    <CommandItem
      onSelect={() => onSelect(item.text)}
      className={dir === "rtl" ? "flex-row-reverse arabic-text text-right" : ""}
    >
      <Clock className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"} text-muted-foreground`} />
      {item.text}
    </CommandItem>
  );
}
