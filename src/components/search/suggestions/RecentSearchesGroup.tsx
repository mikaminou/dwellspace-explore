
import React from "react";
import { CommandGroup } from "@/components/ui/command";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { SearchHistoryItem } from "./SearchHistoryItem";
import { SearchSuggestion } from "../SearchSuggestions";

interface RecentSearchesGroupProps {
  historyItems: SearchSuggestion[];
  onSelectSuggestion: (text: string) => void;
}

export function RecentSearchesGroup({ historyItems, onSelectSuggestion }: RecentSearchesGroupProps) {
  const { t } = useLanguage();
  
  if (historyItems.length === 0) return null;
  
  return (
    <CommandGroup heading={t('search.recentSearches') || "Recent Searches"}>
      {historyItems.map((item, index) => (
        <SearchHistoryItem
          key={`history-${index}`}
          item={item}
          onSelect={onSelectSuggestion}
        />
      ))}
    </CommandGroup>
  );
}
