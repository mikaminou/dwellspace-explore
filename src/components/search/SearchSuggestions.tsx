import React, { useState, useEffect } from "react";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandGroup,
  CommandSeparator 
} from "@/components/ui/command";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { RecentSearchesGroup } from "./suggestions/RecentSearchesGroup";
import { SearchQueryItem } from "./suggestions/SearchQueryItem";
import { useSearchHistory } from "./suggestions/useSearchHistory";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export interface SearchSuggestion {
  text: string;
  type: "history";
  timestamp?: number;
}

interface SearchSuggestionsProps {
  searchInput: string;
  onSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

export function SearchSuggestions({
  searchInput,
  onSelectSuggestion,
  onClose
}: SearchSuggestionsProps) {
  const { t, dir } = useLanguage();
  const { getFilteredHistory, addToSearchHistory } = useSearchHistory();
  const [isOpen, setIsOpen] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchInput);
  
  useEffect(() => {
    setLocalSearchTerm(searchInput);
  }, [searchInput]);

  const handleSelect = (suggestion: string) => {
    addToSearchHistory(suggestion);
    onSelectSuggestion(suggestion);
    setIsOpen(false);
    onClose();
  };

  const filteredHistory = getFilteredHistory(localSearchTerm);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose();
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle>
        <VisuallyHidden>{t('search.search')}</VisuallyHidden>
      </DialogTitle>
      <DialogDescription>
        <VisuallyHidden>{t('search.suggestionsPlaceholder')}</VisuallyHidden>
      </DialogDescription>
      
      <CommandInput 
        placeholder={t('search.suggestionsPlaceholder') || "Type to search..."} 
        value={localSearchTerm}
        onValueChange={setLocalSearchTerm}
        className={dir === "rtl" ? "arabic-text text-right" : ""}
      />
      <CommandList>
        <RecentSearchesGroup 
          historyItems={filteredHistory} 
          onSelectSuggestion={handleSelect} 
        />
        
        {localSearchTerm && (
          <CommandGroup>
            <SearchQueryItem
              searchTerm={localSearchTerm}
              onSelect={handleSelect}
            />
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
