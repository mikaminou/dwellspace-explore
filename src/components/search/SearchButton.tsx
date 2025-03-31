
import React from "react";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useSearch } from "@/contexts/search/SearchContext";

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const { t } = useLanguage();
  const { filtersChanged } = useSearch();

  return (
    <Button 
      onClick={onClick} 
      variant="cta" 
      size="lg"
      className={`w-full md:w-auto transition-all duration-200 ${!filtersChanged ? 'animate-pulse' : ''}`}
    >
      <SearchIcon className="h-4 w-4 mr-1" />
      {t('search.search')}
    </Button>
  );
}
