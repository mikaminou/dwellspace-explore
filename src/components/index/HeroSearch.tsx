import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchIcon, Sparkles } from "lucide-react";
import { propertyTypeOptions, listingTypeOptions } from "@/config/propertyConfig";
import { SearchSuggestions } from "@/components/search/SearchSuggestions";
import { useDebounce } from "@/hooks/useDebounce";
import { useNavigate } from 'react-router-dom';

interface HeroSearchProps {
  onSearchSubmit: (searchParams: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearchSubmit }) => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('any');
  const [selectedListingType, setSelectedListingType] = useState('any');
  const debouncedSearchInput = useDebounce(searchInput, 300);

  const handleSearchSubmit = useCallback(() => {
    if (searchInput.trim()) {
      const searchParams = `?q=${encodeURIComponent(searchInput)}&propertyType=${selectedPropertyType}&listingType=${selectedListingType}`;
      onSearchSubmit(searchParams);
    }
  }, [searchInput, selectedPropertyType, selectedListingType, onSearchSubmit]);

  const handleSelectSuggestion = useCallback((suggestion: string | undefined) => {
    if (suggestion && suggestion.trim()) {
      setSearchInput(suggestion);
      setShowSearchSuggestions(false);
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchSuggestions(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (debouncedSearchInput) {
      setShowSearchSuggestions(true);
    }
  }, [debouncedSearchInput]);

  return (
    <div className="bg-white dark:bg-card p-2 rounded-lg shadow-lg mb-8 max-w-3xl mx-auto animate-slide-up delay-100">
      <div className="flex flex-col md:flex-row">
        <div className="flex-grow md:border-r dark:border-gray-700 p-2 relative">
          <Input 
            placeholder={t('search.location')}
            className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right pr-4' : ''}`}
            dir={dir}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            aria-label={t('search.location')}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <div className="bg-cta/10 text-cta text-xs p-1 rounded-md flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>{t('search.ai') || "AI"}</span>
            </div>
          </div>
        </div>
        <div className="md:w-44 p-2">
          <Select 
            value={selectedPropertyType} 
            onValueChange={setSelectedPropertyType}
          >
            <SelectTrigger className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right' : ''}`} dir={dir}>
              <SelectValue placeholder={t('search.propertyType')} />
            </SelectTrigger>
            <SelectContent dir={dir}>
              <SelectGroup>
                {propertyTypeOptions.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value} 
                    className={dir === 'rtl' ? 'arabic-text text-right' : ''}
                  >
                    {t(`propertyTypes.${type.value}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="md:w-44 p-2">
          <Select
            value={selectedListingType}
            onValueChange={setSelectedListingType}
          >
            <SelectTrigger className={`h-12 border-0 shadow-none ${dir === 'rtl' ? 'arabic-text text-right' : ''}`} dir={dir}>
              <SelectValue placeholder={t('search.listingType')} />
            </SelectTrigger>
            <SelectContent dir={dir}>
              <SelectGroup>
                {listingTypeOptions.map((type) => (
                  <SelectItem 
                    key={type.value} 
                    value={type.value} 
                    className={dir === 'rtl' ? 'arabic-text text-right' : ''}
                  >
                    {t(`listingTypes.${type.value}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="p-2">
          <Button 
            className={`w-full h-12 bg-primary hover:bg-primary/90 text-white ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`} 
            size="lg"
            onClick={handleSearchSubmit}
          >
            <SearchIcon className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('search.search')}
          </Button>
        </div>
      </div>
      
      {showSearchSuggestions && (
        <SearchSuggestions
        searchInput={debouncedSearchInput}
        onSelectSuggestion={handleSelectSuggestion}
        onClose={() => setShowSearchSuggestions(false)}
      />
      )}
    </div>
  );
};