
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Filter as FilterIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  getActiveFiltersCount: () => number;
  handleSearch: () => void;
}

export function SearchHeader({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  getActiveFiltersCount,
  handleSearch
}: SearchHeaderProps) {
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);
  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const { t, dir } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (searchHeaderRef.current) {
        const rect = searchHeaderRef.current.getBoundingClientRect();
        setSearchHeaderSticky(rect.top <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={searchHeaderRef}
      className={`w-full bg-white transition-all duration-300 z-20 ${
        searchHeaderSticky ? 'sticky top-0 shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative w-full md:flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              className={`pl-10 ${dir === 'rtl' ? 'arabic-text' : ''} h-12 border-2 focus:border-cta transition-colors`} 
              placeholder={t('search.placeholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          
          <Button 
            variant={showFilters ? "active" : "filter"} 
            size="lg"
            className={`whitespace-nowrap ${dir === 'rtl' ? 'arabic-text' : ''} w-full md:w-auto transition-all duration-200`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {showFilters ? t('search.hideFilters') : t('search.showFilters')}
            {getActiveFiltersCount() > 0 && (
              <span className="ml-1 bg-cta text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>

          <Button 
            onClick={handleSearch} 
            variant="cta" 
            size="lg"
            className="w-full md:w-auto transition-all duration-200"
          >
            <SearchIcon className="h-4 w-4 mr-1" />
            {t('search.search')}
          </Button>
        </div>
      </div>
    </div>
  );
}
