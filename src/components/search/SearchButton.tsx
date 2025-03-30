
import React from "react";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const { t } = useLanguage();

  return (
    <Button 
      onClick={onClick} 
      variant="cta" 
      size="lg"
      className="w-full md:w-auto transition-all duration-200"
    >
      <SearchIcon className="h-4 w-4 mr-1" />
      {t('search.search')}
    </Button>
  );
}
