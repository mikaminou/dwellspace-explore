
import React from "react";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Clock, Search } from "lucide-react";

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
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchSuggestion[]>("search_history", []);
  
  // Filter history based on the search term
  const getFilteredHistory = (): SearchSuggestion[] => {
    if (!searchTerm) return searchHistory.slice(0, 5);
    
    return searchHistory
      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  };
  
  const handleSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSelectSuggestion(suggestion);
    
    // Add to search history if it doesn't exist already
    const exists = searchHistory.some(item => item.text === suggestion);
    if (!exists) {
      const newHistoryItem: SearchSuggestion = {
        text: suggestion, 
        type: "history", 
        timestamp: Date.now()
      };
      
      const newHistory = [
        newHistoryItem,
        ...searchHistory,
      ].slice(0, 10); // Keep only the last 10 searches
      
      setSearchHistory(newHistory);
    }
    
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder={t('search.suggestionsPlaceholder') || "Type to search..."} 
        value={searchTerm}
        onValueChange={setSearchTerm}
        className={dir === "rtl" ? "arabic-text text-right" : ""}
      />
      <CommandList>
        {getFilteredHistory().length > 0 && (
          <CommandGroup heading={t('search.recentSearches') || "Recent Searches"}>
            {getFilteredHistory().map((item, index) => (
              <CommandItem
                key={`history-${index}`}
                onSelect={() => handleSelect(item.text)}
                className={dir === "rtl" ? "flex-row-reverse arabic-text text-right" : ""}
              >
                <Clock className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"} text-muted-foreground`} />
                {item.text}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {searchTerm && (
          <CommandGroup>
            <CommandItem
              onSelect={() => handleSelect(searchTerm)}
              className={dir === "rtl" ? "flex-row-reverse arabic-text text-right" : ""}
            >
              <Search className={`h-4 w-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
              {t('search.searchFor') || "Search for"} "{searchTerm}"
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
