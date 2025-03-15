import React, { useState, useEffect, useRef } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search as SearchIcon, 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Clock, 
  Star, 
  Filter as FilterIcon, 
  X, 
  Check, 
  DollarSign,
  Ruler,
  ChevronDown, 
  ChevronUp
} from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { searchProperties } from "@/api";
import { Property } from "@/api/properties";
import PropertyCard from "@/components/PropertyCard";
import { getMaxPropertyPrice, getMaxLivingArea, getAllCities } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-mobile";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState('any');
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [listingType, setListingType] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minLivingArea, setMinLivingArea] = useState(0);
  const [maxLivingArea, setMaxLivingArea] = useState(500);
  const [sortOption, setSortOption] = useState('relevance');
  const [cities, setCities] = useState<string[]>([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(50000000);
  const [maxLivingAreaLimit, setMaxLivingAreaLimit] = useState(500);
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);
  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { t, dir } = useLanguage();

  const filtersApplied = useRef(false);

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

  useEffect(() => {
    const fetchLimits = async () => {
      const maxPrice = await getMaxPropertyPrice();
      setMaxPriceLimit(maxPrice);
      setMaxPrice(maxPrice);

      const maxLiving = await getMaxLivingArea();
      setMaxLivingAreaLimit(maxLiving);
      setMaxLivingArea(maxLiving);

      const cities = await getAllCities();
      setCities(['any', ...cities]);
    };

    fetchLimits();
  }, []);

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

  const handleSearch = async () => {
    setLoading(true);
    filtersApplied.current = true;
    try {
      const results = await searchProperties(searchTerm, {
        city: selectedCity,
        propertyType: propertyType.join(','),
        minPrice: minPrice,
        maxPrice: maxPrice,
        minBeds: minBeds,
        minLivingArea: minLivingArea,
        maxLivingArea: maxLivingArea,
        listingType: listingType.join(',') as any,
      });
      setProperties(results);
    } catch (error: any) {
      toast.error(t('search.searchFailed'));
      console.error("Search failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCity('any');
    setPropertyType([]);
    setListingType([]);
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
    setMinBeds(0);
    setMinBaths(0);
    setMinLivingArea(0);
    setMaxLivingArea(maxLivingAreaLimit);
    setSortOption('relevance');
    filtersApplied.current = false;
    handleSearch();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCity !== 'any') count++;
    if (propertyType.length > 0) count++;
    if (listingType.length > 0) count++;
    if (minBeds > 0) count++;
    if (minBaths > 0) count++;
    if (minLivingArea > 0) count++;
    if (maxLivingArea < maxLivingAreaLimit) count++;
    return count;
  };

  const toggleFilterSection = (section: string) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  const getFilterSectionLabel = (section: string) => {
    switch (section) {
      case 'location':
        return t('search.location');
      case 'propertyType':
        return t('search.propertyType');
      case 'listingType':
        return t('search.listingType');
      case 'priceRange':
        return t('search.priceRange');
      case 'bedsBaths':
        return t('search.bedsBaths');
      case 'livingArea':
        return t('search.livingArea');
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
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
      
      {showFilters && (
        <div className="bg-white border-t border-b border-gray-200 py-4 overflow-hidden transition-all duration-300">
          <div className="container mx-auto px-4">
            {isMobile ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('location')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('location')}</span>
                      {activeFilterSection === 'location' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'location' && (
                      <div className="p-4 bg-gray-50 animate-accordion-down">
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
                    )}
                  </div>

                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('propertyType')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('propertyType')}</span>
                      {activeFilterSection === 'propertyType' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'propertyType' && (
                      <div className="p-4 bg-gray-50 animate-accordion-down">
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
                    )}
                  </div>

                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('listingType')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('listingType')}</span>
                      {activeFilterSection === 'listingType' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'listingType' && (
                      <div className="p-4 bg-gray-50 animate-accordion-down">
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
                    )}
                  </div>

                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('priceRange')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('priceRange')}</span>
                      {activeFilterSection === 'priceRange' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'priceRange' && (
                      <div className="p-4 bg-gray-50 animate-accordion-down">
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
                    )}
                  </div>

                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('bedsBaths')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('bedsBaths')}</span>
                      {activeFilterSection === 'bedsBaths' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'bedsBaths' && (
                      <div className="p-4 bg-gray-50 animate-accordion-down">
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
                    )}
                  </div>

                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('livingArea')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('livingArea')}</span>
                      {activeFilterSection === 'livingArea' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'livingArea' && (
                      <div className="p-4 bg-gray-50 animate-accordion-down">
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
                    )}
                  </div>
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
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-medium mb-2">{`${t('search.results')} (${properties.length})`}</h1>
          {filtersApplied.current && (
            <div className="flex flex-wrap gap-2">
              {selectedCity !== 'any' && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <MapPin size={12} /> {selectedCity}
                </div>
              )}
              {propertyType.length > 0 && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <Home size={12} /> {propertyType.join(', ')}
                </div>
              )}
              {listingType.length > 0 && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  {listingType.includes('sale') ? <DollarSign size={12} /> : <Clock size={12} />} {listingType.join(', ')}
                </div>
              )}
              {minBeds > 0 && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <Bed size={12} /> {minBeds}+ {t('search.beds')}
                </div>
              )}
              {minBaths > 0 && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <Bath size={12} /> {minBaths}+ {t('search.baths')}
                </div>
              )}
              {(minLivingArea > 0 || maxLivingArea < maxLivingAreaLimit) && (
                <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <Ruler size={12} /> {minLivingArea} - {maxLivingArea} m²
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-gray-100 animate-pulse rounded-lg h-[300px] flex items-center justify-center text-gray-400"
              >
                <span className="text-lg">{t('search.loading')}</span>
              </div>
            ))
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center">
              <SearchIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">{t('search.noPropertiesFound')}</h3>
              <p className="text-muted-foreground mb-4">{t('search.tryAdjustingFilters')}</p>
              <Button onClick={handleReset} variant="outline">
                {t('search.resetFilters')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
