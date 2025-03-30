
import React from "react";
import { CommandDialog, CommandInput, CommandList, CommandGroup } from "@/components/ui/command";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { RecentSearchesGroup } from "./suggestions/RecentSearchesGroup";
import { SearchQueryItem } from "./suggestions/SearchQueryItem";
import { useSearchHistory } from "./suggestions/useSearchHistory";

export interface SearchSuggestion {
  text: string;
  type: "history";
  timestamp?: number;
}

interface SearchSuggestionsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectSuggestion: (suggestion: string) => void;
}

export function SearchSuggestions({
  open,
  setOpen,
  searchTerm,
  setSearchTerm,
  onSelectSuggestion,
}: SearchSuggestionsProps) {
  const { t, dir } = useLanguage();
  const { getFilteredHistory, addToSearchHistory } = useSearchHistory();
  
  const handleSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    addToSearchHistory(suggestion);
    onSelectSuggestion(suggestion);
    setOpen(false);
  };

  const filteredHistory = getFilteredHistory(searchTerm);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder={t('search.suggestionsPlaceholder') || "Type to search..."} 
        value={searchTerm}
        onValueChange={setSearchTerm}
        className={dir === "rtl" ? "arabic-text text-right" : ""}
      />
      <CommandList>
        <RecentSearchesGroup 
          historyItems={filteredHistory} 
          onSelectSuggestion={handleSelect} 
        />
        
        {searchTerm && (
          <CommandGroup>
            <SearchQueryItem
              searchTerm={searchTerm}
              onSelect={handleSelect}
            />
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
