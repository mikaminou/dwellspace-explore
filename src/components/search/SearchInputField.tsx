
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface SearchInputFieldProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearchClick: () => void;
  handleClearSearch: () => void;
  onFocus: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function SearchInputField({
  searchTerm,
  setSearchTerm,
  handleSearchClick,
  handleClearSearch,
  onFocus,
  inputRef,
}: SearchInputFieldProps) {
  const { t, dir } = useLanguage();

  const onClearClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClearSearch();
    // Make sure the input doesn't get focus after clearing
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="relative w-full md:flex-1">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input 
        ref={inputRef}
        className={`pl-10 ${dir === 'rtl' ? 'arabic-text' : ''} h-12 border-2 focus:border-cta transition-colors`} 
        placeholder={t('search.placeholder') || "Try 'modern 3 bedroom house with pool in Algiers'"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={onFocus}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearchClick();
          }
        }}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        {searchTerm && (
          <button
            onClick={onClearClick}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
