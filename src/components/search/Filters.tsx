
import React from "react";
import { X, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { MobileFilterSection } from "./MobileFilterSection";
import { useMediaQuery } from "@/hooks/use-mobile";

interface FiltersProps {
  showFilters: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  propertyType: string[];
  setPropertyType: (types: string[]) => void;
  listingType: string[];
  setListingType: (types: string[]) => void;
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minBeds: number;
  setMinBeds: (beds: number) => void;
  minBaths: number;
  setMinBaths: (baths: number) => void;
  minLivingArea: number;
  setMinLivingArea: (area: number) => void;
  maxLivingArea: number;
  setMaxLivingArea: (area: number) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  maxPriceLimit: number;
  maxLivingAreaLimit: number;
  cities: string[];
  handleReset: () => void;
  handleSearch: () => void;
  activeFilterSection: string | null;
  setActiveFilterSection: (section: string | null) => void;
}

export function Filters({
  showFilters,
  selectedCity,
  setSelectedCity,
  propertyType,
  setPropertyType,
  listingType,
  setListingType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minBeds,
  setMinBeds,
  minBaths,
  setMinBaths,
  minLivingArea,
  setMinLivingArea,
  maxLivingArea,
  setMaxLivingArea,
  sortOption,
  setSortOption,
  maxPriceLimit,
  maxLivingAreaLimit,
  cities,
  handleReset,
  handleSearch,
  activeFilterSection,
  setActiveFilterSection
}: FiltersProps) {
  const { t, dir } = useLanguage();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  const propertyTypes = [
    { value: 'House', label: t('search.house') },
    { value: 'Apartment', label: t('search.apartment') },
    { value: 'Villa', label: t('search.villa') },
    { value: 'Land', label: t('search.land') },
  ];

  const listingTypes = [
    { value: 'sale', label: t('search.sale') },
    { value: 'rent', label: t('search.rent') },
    { value: 'construction', label: t('search.construction') },
  ];

  const sortOptions = [
    { value: 'relevance', label: t('search.relevance') },
    { value: 'priceAsc', label: t('search.priceAsc') },
    { value: 'priceDesc', label: t('search.priceDesc') },
    { value: 'areaAsc', label: t('search.areaAsc') },
    { value: 'areaDesc', label: t('search.areaDesc') },
  ];

  if (!showFilters) return null;

  return (
    <div className="bg-white border-t border-b border-gray-200 py-4 overflow-hidden transition-all duration-300">
      <div className="container mx-auto px-4">
        {isMobile ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <MobileFilterSection 
                section="location" 
                activeSection={activeFilterSection} 
                onToggle={toggleFilterSection}
              >
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className={`${dir === 'rtl' ? 'arabic-text' : ''} border-2`}>
                    <SelectValue placeholder={t('search.anyCity')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cities.map(city => (
                        <SelectItem key={city} value={city} className={dir === 'rtl' ? 'arabic-text' : ''}>
                          {city === "any" ? t('search.anyCity') : city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </MobileFilterSection>

              <MobileFilterSection 
                section="propertyType" 
                activeSection={activeFilterSection} 
                onToggle={toggleFilterSection}
              >
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={propertyType.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPropertyType([...propertyType, type.value]);
                          } else {
                            setPropertyType(propertyType.filter(item => item !== type.value));
                          }
                        }}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </MobileFilterSection>

              <MobileFilterSection 
                section="listingType" 
                activeSection={activeFilterSection} 
                onToggle={toggleFilterSection}
              >
                <div className="space-y-2">
                  {listingTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={listingType.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setListingType([...listingType, type.value]);
                          } else {
                            setListingType(listingType.filter(item => item !== type.value));
                          }
                        }}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </MobileFilterSection>

              <MobileFilterSection 
                section="priceRange" 
                activeSection={activeFilterSection} 
                onToggle={toggleFilterSection}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={t('search.minPrice')}
                      value={minPrice.toString()}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                    <Input
                      type="number"
                      placeholder={t('search.maxPrice')}
                      value={maxPrice.toString()}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                  </div>
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    max={maxPriceLimit}
                    step={10000}
                    onValueChange={(value) => {
                      setMinPrice(value[0]);
                      setMaxPrice(value[1]);
                    }}
                  />
                </div>
              </MobileFilterSection>

              <MobileFilterSection 
                section="bedsBaths" 
                activeSection={activeFilterSection} 
                onToggle={toggleFilterSection}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={t('search.minBeds')}
                      value={minBeds.toString()}
                      onChange={(e) => setMinBeds(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                    <Input
                      type="number"
                      placeholder={t('search.minBaths')}
                      value={minBaths.toString()}
                      onChange={(e) => setMinBaths(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                  </div>
                </div>
              </MobileFilterSection>

              <MobileFilterSection 
                section="livingArea" 
                activeSection={activeFilterSection} 
                onToggle={toggleFilterSection}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={t('search.minLivingArea')}
                      value={minLivingArea.toString()}
                      onChange={(e) => setMinLivingArea(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                    <Input
                      type="number"
                      placeholder={t('search.maxLivingArea')}
                      value={maxLivingArea.toString()}
                      onChange={(e) => setMaxLivingArea(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                  </div>
                  <Slider
                    defaultValue={[minLivingArea, maxLivingArea]}
                    max={maxLivingAreaLimit}
                    step={10}
                    onValueChange={(value) => {
                      setMinLivingArea(value[0]);
                      setMaxLivingArea(value[1]);
                    }}
                  />
                </div>
              </MobileFilterSection>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleReset} size="sm" className="text-sm">
                <X className="mr-1 h-4 w-4" />
                {t('search.resetFilters')}
              </Button>
              
              <div className="flex space-x-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="h-9 text-sm">
                    <span className="flex items-center">
                      <Star className="mr-1 h-4 w-4" />
                      {t('search.sortBy')}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="cta" 
                  size="sm" 
                  onClick={handleSearch}
                  className="text-sm"
                >
                  {t('search.applyFilters')}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">{t('search.location')}</h4>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className={`${dir === 'rtl' ? 'arabic-text' : ''} border-2`}>
                    <SelectValue placeholder={t('search.anyCity')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cities.map(city => (
                        <SelectItem key={city} value={city} className={dir === 'rtl' ? 'arabic-text' : ''}>
                          {city === "any" ? t('search.anyCity') : city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">{t('search.propertyType')}</h4>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={propertyType.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPropertyType([...propertyType, type.value]);
                          } else {
                            setPropertyType(propertyType.filter(item => item !== type.value));
                          }
                        }}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">{t('search.listingType')}</h4>
                <div className="space-y-2">
                  {listingTypes.map(type => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={listingType.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setListingType([...listingType, type.value]);
                          } else {
                            setListingType(listingType.filter(item => item !== type.value));
                          }
                        }}
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">{t('search.priceRange')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={t('search.minPrice')}
                      value={minPrice.toString()}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                    <Input
                      type="number"
                      placeholder={t('search.maxPrice')}
                      value={maxPrice.toString()}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                  </div>
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    max={maxPriceLimit}
                    step={10000}
                    onValueChange={(value) => {
                      setMinPrice(value[0]);
                      setMaxPrice(value[1]);
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">{t('search.bedsBaths')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={t('search.minBeds')}
                      value={minBeds.toString()}
                      onChange={(e) => setMinBeds(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                    <Input
                      type="number"
                      placeholder={t('search.minBaths')}
                      value={minBaths.toString()}
                      onChange={(e) => setMinBaths(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">{t('search.livingArea')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder={t('search.minLivingArea')}
                      value={minLivingArea.toString()}
                      onChange={(e) => setMinLivingArea(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                    <Input
                      type="number"
                      placeholder={t('search.maxLivingArea')}
                      value={maxLivingArea.toString()}
                      onChange={(e) => setMaxLivingArea(Number(e.target.value))}
                      className="w-24 text-sm border-2"
                    />
                  </div>
                  <Slider
                    defaultValue={[minLivingArea, maxLivingArea]}
                    max={maxLivingAreaLimit}
                    step={10}
                    onValueChange={(value) => {
                      setMinLivingArea(value[0]);
                      setMaxLivingArea(value[1]);
                    }}
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset} size="sm">
                <X className="mr-2 h-4 w-4" />
                {t('search.resetFilters')}
              </Button>
              
              <div className="flex space-x-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="h-9">
                    <span className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      {t('search.sortBy')}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="cta" 
                  size="sm" 
                  onClick={handleSearch}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {t('search.applyFilters')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
