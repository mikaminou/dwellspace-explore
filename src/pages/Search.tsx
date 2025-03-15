
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
  const { t, dir } = useLanguage();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("any");
  const [listingType, setListingType] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(50000000);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [minLivingArea, setMinLivingArea] = useState(0);
  const [maxLivingArea, setMaxLivingArea] = useState(500);
  const [maxLivingAreaLimit, setMaxLivingAreaLimit] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [features, setFeatures] = useState({
    parking: false,
    furnished: false,
    pool: false,
    garden: false,
    security: false,
    petFriendly: false,
    airConditioning: false,
    balcony: false,
    elevator: false,
    fireplace: false,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>(['any']);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("newest");
  const [searchHeaderSticky, setSearchHeaderSticky] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  const searchHeaderRef = useRef<HTMLDivElement>(null);
  const filtersApplied = useRef(false);

  // Pricing presets
  const pricePresets = [
    { label: t('search.lowRange'), min: 0, max: 5000000 },
    { label: t('search.midRange'), min: 5000000, max: 15000000 },
    { label: t('search.highRange'), min: 15000000, max: 30000000 },
    { label: t('search.luxuryRange'), min: 30000000, max: maxPriceLimit },
  ];

  const propertyTypes = [
    { value: "Villa", label: t('search.villa'), icon: <Home size={16} /> },
    { value: "Apartment", label: t('search.apartment'), icon: <Home size={16} /> },
    { value: "House", label: t('search.house') || "House", icon: <Home size={16} /> },
    { value: "Land", label: t('search.land') || "Land", icon: <MapPin size={16} /> },
    { value: "Studio", label: t('search.studio'), icon: <Home size={16} /> },
    { value: "Duplex", label: t('search.duplex'), icon: <Home size={16} /> },
    { value: "Traditional House", label: t('search.traditionalHouse'), icon: <Home size={16} /> },
    { value: "Loft", label: t('search.loft'), icon: <Home size={16} /> },
    { value: "Chalet", label: t('search.chalet'), icon: <Home size={16} /> }
  ];

  const listingTypes = [
    { value: "sale", label: t('search.forSale'), icon: <DollarSign size={16} /> },
    { value: "rent", label: t('search.forRent'), icon: <Clock size={16} /> },
    { value: "construction", label: t('search.underConstruction'), icon: <Home size={16} /> }
  ];

  const featuresList = [
    { id: "parking", label: t('search.parking') },
    { id: "furnished", label: t('search.furnished') },
    { id: "pool", label: t('search.pool') },
    { id: "garden", label: t('search.garden') },
    { id: "security", label: t('search.security') },
    { id: "petFriendly", label: t('search.petFriendly') },
    { id: "airConditioning", label: t('search.airConditioning') },
    { id: "balcony", label: t('search.balcony') },
    { id: "elevator", label: t('search.elevator') },
    { id: "fireplace", label: t('search.fireplace') },
  ];

  const sortOptions = [
    { value: "newest", label: t('search.newest') },
    { value: "price_asc", label: t('search.priceLowToHigh') },
    { value: "price_desc", label: t('search.priceHighToLow') },
    { value: "popular", label: t('search.mostPopular') },
  ];

  // Handle sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (searchHeaderRef.current) {
        const scrollPosition = window.scrollY;
        setSearchHeaderSticky(scrollPosition > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch max values from the database
  useEffect(() => {
    const fetchMaxValues = async () => {
      try {
        const fetchedMaxPrice = await getMaxPropertyPrice();
        const fetchedMaxLivingArea = await getMaxLivingArea();
        const fetchedCities = await getAllCities();
        
        // Update state with fetched max values
        setMaxPriceLimit(fetchedMaxPrice);
        setMaxPrice(fetchedMaxPrice);
        setMaxLivingAreaLimit(fetchedMaxLivingArea);
        setMaxLivingArea(fetchedMaxLivingArea);
        setCities(['any', ...fetchedCities]);
      } catch (error) {
        console.error('Error fetching max values:', error);
      }
    };

    fetchMaxValues();
  }, []);

  useEffect(() => {
    const fetchAllProperties = async () => {
      setLoading(true);
      try {
        const allProperties = await searchProperties();
        setProperties(allProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error(t('search.errorFetchingProperties'));
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, [t]);

  const handleSearch = async () => {
    filtersApplied.current = true;
    setLoading(true);
    setActiveFilterSection(null);
    
    try {
      const selectedFeatures = Object.entries(features)
        .filter(([_, selected]) => selected)
        .map(([feature]) => {
          switch (feature) {
            case 'parking': return 'parking';
            case 'furnished': return 'furnished';
            case 'pool': return 'pool';
            case 'garden': return 'garden';
            case 'security': return 'security';
            case 'petFriendly': return 'pet';
            case 'airConditioning': return 'air_conditioning';
            case 'balcony': return 'balcony';
            case 'elevator': return 'elevator';
            case 'fireplace': return 'fireplace';
            default: return feature;
          }
        });

      const filteredProperties = await searchProperties(searchTerm, {
        propertyType: propertyType.length > 0 ? propertyType.join(',') : undefined,
        city: selectedCity !== 'any' ? selectedCity : undefined,
        minPrice,
        maxPrice,
        minBeds: minBeds > 0 ? minBeds : undefined,
        minBaths: minBaths > 0 ? minBaths : undefined,
        minLivingArea: minLivingArea > 0 ? minLivingArea : undefined,
        maxLivingArea: maxLivingArea < maxLivingAreaLimit ? maxLivingArea : undefined,
        features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
        listingType: listingType.length > 0 ? listingType.join(',') as any : undefined
      });
      
      // Sort properties based on selected sort option
      let sortedProperties = [...filteredProperties];
      
      switch (sortOption) {
        case 'price_asc':
          sortedProperties.sort((a, b) => {
            const aPrice = parseInt(a.price.replace(/[^0-9]/g, ''));
            const bPrice = parseInt(b.price.replace(/[^0-9]/g, ''));
            return aPrice - bPrice;
          });
          break;
        case 'price_desc':
          sortedProperties.sort((a, b) => {
            const aPrice = parseInt(a.price.replace(/[^0-9]/g, ''));
            const bPrice = parseInt(b.price.replace(/[^0-9]/g, ''));
            return bPrice - aPrice;
          });
          break;
        case 'popular':
          // In a real app, this would use a popularity metric
          sortedProperties.sort((a, b) => (b.isPremium ? 1 : 0) - (a.isPremium ? 1 : 0));
          break;
        // Newest is default (no sorting needed if data is already ordered by date)
      }
      
      setProperties(sortedProperties);
      
      if (showFilters && isMobile) {
        setShowFilters(false);
      }
      
      toast.success(
        sortedProperties.length > 0 
          ? t('search.searchResultsFound', { count: sortedProperties.length }) 
          : t('search.noPropertiesFound')
      );
    } catch (error) {
      console.error('Error searching properties:', error);
      toast.error(t('search.errorSearchingProperties'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    filtersApplied.current = false;
    setSearchTerm("");
    setPropertyType([]);
    setSelectedCity("any");
    setListingType([]);
    setMinPrice(0);
    setMaxPrice(maxPriceLimit);
    setMinBeds(0);
    setMinBaths(0);
    setMinLivingArea(0);
    setMaxLivingArea(maxLivingAreaLimit);
    setSortOption("newest");
    setFeatures({
      parking: false,
      furnished: false,
      pool: false,
      garden: false,
      security: false,
      petFriendly: false,
      airConditioning: false,
      balcony: false,
      elevator: false,
      fireplace: false,
    });
    
    setLoading(true);
    try {
      const allProperties = await searchProperties();
      setProperties(allProperties);
      toast.success(t('search.filtersReset'));
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error(t('search.errorFetchingProperties'));
    } finally {
      setLoading(false);
    }

    if (showFilters && isMobile) {
      setShowFilters(false);
    }
  };

  const applyPricePreset = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, ''));
    
    if (!isNaN(numericValue)) {
      if (type === 'min') {
        setMinPrice(numericValue);
      } else {
        // Ensure max price doesn't exceed the limit from database
        setMaxPrice(Math.min(numericValue, maxPriceLimit));
      }
    }
  };

  const handleLivingAreaInputChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, ''));
    
    if (!isNaN(numericValue)) {
      if (type === 'min') {
        setMinLivingArea(numericValue);
      } else {
        // Ensure max living area doesn't exceed the limit from database
        setMaxLivingArea(Math.min(numericValue, maxLivingAreaLimit));
      }
    }
  };

  const toggleFilterSection = (section: string) => {
    if (activeFilterSection === section) {
      setActiveFilterSection(null);
    } else {
      setActiveFilterSection(section);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (propertyType.length > 0) count++;
    if (listingType.length > 0) count++;
    if (selectedCity !== 'any') count++;
    if (minPrice > 0) count++;
    if (maxPrice < maxPriceLimit) count++;
    if (minBeds > 0) count++;
    if (minBaths > 0) count++;
    if (minLivingArea > 0) count++;
    if (maxLivingArea < maxLivingAreaLimit) count++;
    
    const featuresSelected = Object.values(features).filter(v => v).length;
    if (featuresSelected > 0) count++;
    
    return count;
  };

  const togglePropertyType = (type: string) => {
    if (propertyType.includes(type)) {
      setPropertyType(propertyType.filter(t => t !== type));
    } else {
      setPropertyType([...propertyType, type]);
    }
  };

  const toggleListingType = (type: string) => {
    if (listingType.includes(type)) {
      setListingType(listingType.filter(t => t !== type));
    } else {
      setListingType([...listingType, type]);
    }
  };

  const getFilterSectionLabel = (section: string) => {
    switch (section) {
      case 'price':
        return minPrice > 0 || maxPrice < maxPriceLimit 
          ? `${t('search.priceRange')}: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`
          : t('search.priceRange');
      case 'livingArea':
        return minLivingArea > 0 || maxLivingArea < maxLivingAreaLimit
          ? `${t('search.livingSpaceRange')}: ${minLivingArea} - ${maxLivingArea} m²`
          : t('search.livingSpaceRange');
      case 'propertyType':
        return propertyType.length > 0
          ? `${t('search.propertyType')}: ${propertyType.length}`
          : t('search.propertyType');
      case 'listingType':
        return listingType.length > 0
          ? `${t('search.listingType')}: ${listingType.length}`
          : t('search.listingType');
      case 'bedsBaths':
        return (minBeds > 0 || minBaths > 0)
          ? `${t('search.bedsBaths')}: ${minBeds}+ ${t('search.beds')}, ${minBaths}+ ${t('search.baths')}`
          : t('search.bedsBaths');
      case 'features':
        const count = Object.values(features).filter(v => v).length;
        return count > 0
          ? `${t('search.features')}: ${count}`
          : t('search.features');
      case 'location':
        return selectedCity !== 'any'
          ? `${t('search.location')}: ${selectedCity}`
          : t('search.location');
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
            {/* Main search field */}
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
            
            {/* Filter toggle button */}
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

            {/* Search button */}
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
              /* Mobile filters */
              <div className="space-y-4">
                {/* Filter sections as accordion */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  {/* Location filter section */}
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

                  {/* Property Type filter section */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('propertyType')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('propertyType')}</span>
                      {activeFilterSection === 'propertyType' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'propertyType' && (
                      <div className="p-4 bg-gray-50 grid grid-cols-2 gap-2 animate-accordion-down">
                        {propertyTypes.map((type) => (
                          <Button
                            key={type.value}
                            variant={propertyType.includes(type.value) ? "active" : "filter"}
                            size="sm"
                            className="justify-start"
                            onClick={() => togglePropertyType(type.value)}
                          >
                            {type.icon}
                            <span className="ml-2 truncate">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Listing Type filter section */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('listingType')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('listingType')}</span>
                      {activeFilterSection === 'listingType' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'listingType' && (
                      <div className="p-4 bg-gray-50 grid grid-cols-2 gap-2 animate-accordion-down">
                        {listingTypes.map((type) => (
                          <Button
                            key={type.value}
                            variant={listingType.includes(type.value) ? "active" : "filter"}
                            size="sm"
                            className="justify-start"
                            onClick={() => toggleListingType(type.value)}
                          >
                            {type.icon}
                            <span className="ml-2">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range filter section */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('price')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('price')}</span>
                      {activeFilterSection === 'price' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'price' && (
                      <div className="p-4 bg-gray-50 space-y-4 animate-accordion-down">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="relative flex-1">
                            <Input
                              className={dir === 'rtl' ? 'arabic-text text-right pr-10' : 'pl-10'}
                              value={minPrice.toLocaleString()}
                              onChange={(e) => handlePriceInputChange('min', e.target.value)}
                              onBlur={() => {
                                if (minPrice > maxPrice) {
                                  setMinPrice(maxPrice);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                              DZD
                            </span>
                          </div>
                          <span>-</span>
                          <div className="relative flex-1">
                            <Input
                              className={dir === 'rtl' ? 'arabic-text text-right pr-10' : 'pl-10'}
                              value={maxPrice.toLocaleString()}
                              onChange={(e) => handlePriceInputChange('max', e.target.value)}
                              onBlur={() => {
                                if (maxPrice < minPrice) {
                                  setMaxPrice(minPrice);
                                } else if (maxPrice > maxPriceLimit) {
                                  setMaxPrice(maxPriceLimit);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                              DZD
                            </span>
                          </div>
                        </div>
                        <Slider 
                          min={0} 
                          max={maxPriceLimit} 
                          step={500000} 
                          value={[minPrice, maxPrice]}
                          onValueChange={([min, max]) => {
                            setMinPrice(min);
                            setMaxPrice(max);
                          }}
                          className="my-4"
                        />
                        
                        {/* Price presets */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {pricePresets.map((preset, index) => (
                            <Button 
                              key={index}
                              variant="filter"
                              size="sm"
                              onClick={() => applyPricePreset(preset.min, preset.max)}
                              className="text-xs"
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Beds & Baths filter section */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('bedsBaths')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('bedsBaths')}</span>
                      {activeFilterSection === 'bedsBaths' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'bedsBaths' && (
                      <div className="p-4 bg-gray-50 space-y-4 animate-accordion-down">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t('search.minimumBedrooms')}
                          </label>
                          <div className="flex space-x-2">
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <Button
                                key={num}
                                variant={minBeds === num ? "active" : "filter"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setMinBeds(num)}
                              >
                                {num === 0 ? t('search.any') : `${num}+`}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {t('search.minimumBathrooms')}
                          </label>
                          <div className="flex space-x-2">
                            {[0, 1, 2, 3, 4].map((num) => (
                              <Button
                                key={num}
                                variant={minBaths === num ? "active" : "filter"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setMinBaths(num)}
                              >
                                {num === 0 ? t('search.any') : `${num}+`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Living Space Range filter section */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('livingArea')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('livingArea')}</span>
                      {activeFilterSection === 'livingArea' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'livingArea' && (
                      <div className="p-4 bg-gray-50 space-y-4 animate-accordion-down">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="relative flex-1">
                            <Input
                              className={dir === 'rtl' ? 'arabic-text text-right pr-10' : 'pl-10'}
                              value={minLivingArea}
                              onChange={(e) => handleLivingAreaInputChange('min', e.target.value)}
                              onBlur={() => {
                                if (minLivingArea > maxLivingArea) {
                                  setMinLivingArea(maxLivingArea);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                              m²
                            </span>
                          </div>
                          <span>-</span>
                          <div className="relative flex-1">
                            <Input
                              className={dir === 'rtl' ? 'arabic-text text-right pr-10' : 'pl-10'}
                              value={maxLivingArea}
                              onChange={(e) => handleLivingAreaInputChange('max', e.target.value)}
                              onBlur={() => {
                                if (maxLivingArea < minLivingArea) {
                                  setMaxLivingArea(minLivingArea);
                                } else if (maxLivingArea > maxLivingAreaLimit) {
                                  setMaxLivingArea(maxLivingAreaLimit);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                            <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                              m²
                            </span>
                          </div>
                        </div>
                        <Slider 
                          min={0} 
                          max={maxLivingAreaLimit} 
                          step={10} 
                          value={[minLivingArea, maxLivingArea]}
                          onValueChange={([min, max]) => {
                            setMinLivingArea(min);
                            setMaxLivingArea(max);
                          }}
                          className="my-4"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Features filter section */}
                  <div className="border-b border-gray-200 last:border-b-0">
                    <button 
                      onClick={() => toggleFilterSection('features')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{getFilterSectionLabel('features')}</span>
                      {activeFilterSection === 'features' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {activeFilterSection === 'features' && (
                      <div className="p-4 bg-gray-50 grid grid-cols-2 gap-y-3 gap-x-4 animate-accordion-down">
                        {featuresList.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2 transition-all duration-200 hover:text-cta">
                            <Checkbox 
                              id={`mobile-${feature.id}`} 
                              checked={features[feature.id as keyof typeof features]} 
                              onCheckedChange={() => handleFeatureChange(feature.id as keyof typeof features)}
                              className="data-[state=checked]:bg-cta data-[state=checked]:border-cta"
                            />
                            <label htmlFor={`mobile-${feature.id}`} className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                              {feature.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Filter action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleReset} className="w-full">
                    <X size={16} className="mr-1" />
                    {t('search.resetFilters')}
                  </Button>
                  <Button variant="cta" onClick={handleSearch} className="w-full">
                    <Check size={16} className="mr-1" />
                    {t('search.applyFilters')}
                  </Button>
                </div>
              </div>
            ) : (
              /* Desktop filters */
              <div className="space-y-6">
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Quick filter buttons for Property Types */}
                  <div className="col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium mb-2">
                      {t('search.propertyType')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((type) => (
                        <Button
                          key={type.value}
                          variant={propertyType.includes(type.value) ? "active" : "filter"}
                          size="sm"
                          onClick={() => togglePropertyType(type.value)}
                          className="transition-all duration-200"
                        >
                          {type.icon}
                          <span className="ml-1">{type.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('search.location')}
                    </label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className={`${dir === 'rtl' ? 'arabic-text' : ''} border-2 h-10`}>
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
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
                  
                  {/* Sort options */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('search.sortBy')}
                    </label>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className={`${dir === 'rtl' ? 'arabic-text' : ''} border-2 h-10`}>
                        <SelectValue placeholder={t('search.sortBy')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sortOptions.map(option => (
                            <SelectItem key={option.value} value={option.value} className={dir === 'rtl' ? 'arabic-text' : ''}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        {t('search.priceRange')}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        DZD
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="relative flex-1">
                        <Input
                          className={dir === 'rtl' ? 'arabic-text text-right pr-10 border-2' : 'pl-10 border-2'}
                          value={minPrice.toLocaleString()}
                          onChange={(e) => handlePriceInputChange('min', e.target.value)}
                          onBlur={() => {
                            if (minPrice > maxPrice) {
                              setMinPrice(maxPrice);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                        <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                          DZD
                        </span>
                      </div>
                      <span>-</span>
                      <div className="relative flex-1">
                        <Input
                          className={dir === 'rtl' ? 'arabic-text text-right pr-10 border-2' : 'pl-10 border-2'}
                          value={maxPrice.toLocaleString()}
                          onChange={(e) => handlePriceInputChange('max', e.target.value)}
                          onBlur={() => {
                            if (maxPrice < minPrice) {
                              setMaxPrice(minPrice);
                            } else if (maxPrice > maxPriceLimit) {
                              setMaxPrice(maxPriceLimit);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                        <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                          DZD
                        </span>
                      </div>
                    </div>
                    <Slider 
                      min={0} 
                      max={maxPriceLimit} 
                      step={500000} 
                      value={[minPrice, maxPrice]}
                      onValueChange={([min, max]) => {
                        setMinPrice(min);
                        setMaxPrice(max);
                      }}
                      className="my-4"
                    />
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      {pricePresets.map((preset, index) => (
                        <Button 
                          key={index}
                          variant="filter"
                          size="sm"
                          onClick={() => applyPricePreset(preset.min, preset.max)}
                          className="text-xs"
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Living Space Range */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">
                        {t('search.livingSpaceRange')}
                      </label>
                      <span className="text-xs text-muted-foreground">
                        m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="relative flex-1">
                        <Input
                          className={dir === 'rtl' ? 'arabic-text text-right pr-10 border-2' : 'pl-10 border-2'}
                          value={minLivingArea}
                          onChange={(e) => handleLivingAreaInputChange('min', e.target.value)}
                          onBlur={() => {
                            if (minLivingArea > maxLivingArea) {
                              setMinLivingArea(maxLivingArea);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                        <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                          m²
                        </span>
                      </div>
                      <span>-</span>
                      <div className="relative flex-1">
                        <Input
                          className={dir === 'rtl' ? 'arabic-text text-right pr-10 border-2' : 'pl-10 border-2'}
                          value={maxLivingArea}
                          onChange={(e) => handleLivingAreaInputChange('max', e.target.value)}
                          onBlur={() => {
                            if (maxLivingArea < minLivingArea) {
                              setMaxLivingArea(minLivingArea);
                            } else if (maxLivingArea > maxLivingAreaLimit) {
                              setMaxLivingArea(maxLivingAreaLimit);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                        />
                        <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-muted-foreground text-sm">
                          m²
                        </span>
                      </div>
                    </div>
                    <Slider 
                      min={0} 
                      max={maxLivingAreaLimit} 
                      step={10} 
                      value={[minLivingArea, maxLivingArea]}
                      onValueChange={([min, max]) => {
                        setMinLivingArea(min);
                        setMaxLivingArea(max);
                      }}
                      className="my-4"
                    />
                  </div>
                  
                  {/* Beds & Baths */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('search.bedrooms')}
                      </label>
                      <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <Button
                            key={num}
                            variant={minBeds === num ? "active" : "filter"}
                            size="sm"
                            className="flex-1"
                            onClick={() => setMinBeds(num)}
                          >
                            {num === 0 ? t('search.any') : `${num}+`}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">
                        {t('search.bathrooms')}
                      </label>
                      <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map((num) => (
                          <Button
                            key={num}
                            variant={minBaths === num ? "active" : "filter"}
                            size="sm"
                            className="flex-1"
                            onClick={() => setMinBaths(num)}
                          >
                            {num === 0 ? t('search.any') : `${num}+`}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Feature checkboxes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('search.features')}
                    </label>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      {featuresList.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2 transition-all duration-200 hover:text-cta">
                          <Checkbox 
                            id={feature.id} 
                            checked={features[feature.id as keyof typeof features]} 
                            onCheckedChange={() => handleFeatureChange(feature.id as keyof typeof features)}
                            className="data-[state=checked]:bg-cta data-[state=checked]:border-cta"
                          />
                          <label htmlFor={feature.id} className={dir === 'rtl' ? 'arabic-text mr-2' : ''}>
                            {feature.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  {/* Listing Type filter buttons */}
                  <div className="flex space-x-2">
                    {listingTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={listingType.includes(type.value) ? "active" : "filter"}
                        size="sm"
                        onClick={() => toggleListingType(type.value)}
                      >
                        {type.icon}
                        <span className="ml-1">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleReset} size="sm">
                      <X size={16} className="mr-1" />
                      {t('search.resetFilters')}
                    </Button>
                    <Button variant="cta" onClick={handleSearch} size="sm">
                      <Check size={16} className="mr-1" />
                      {t('search.applyFilters')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {loading ? (
              <span>{t('ui.loading')}</span>
            ) : (
              <span>
                {properties.length} {t('search.propertiesFound')}
                {searchTerm && <span className="ml-1 text-muted-foreground font-normal text-lg">"{searchTerm}"</span>}
              </span>
            )}
          </h1>
          
          {/* Applied Filters Pills */}
          {getActiveFiltersCount() > 0 && filtersApplied.current && (
            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {selectedCity !== 'any' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <MapPin size={12} className="mr-1" />
                  {selectedCity}
                  <button 
                    onClick={() => setSelectedCity('any')} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {propertyType.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <Home size={12} className="mr-1" />
                  {propertyType.length === 1 ? 
                    propertyType[0] : 
                    t('search.multiplePropertyTypes', { count: propertyType.length })}
                  <button 
                    onClick={() => setPropertyType([])} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {listingType.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  {listingType[0] === 'sale' ? <DollarSign size={12} className="mr-1" /> : 
                   listingType[0] === 'rent' ? <Clock size={12} className="mr-1" /> : 
                   <Home size={12} className="mr-1" />}
                  {listingType.length === 1 ? 
                    (listingType[0] === 'sale' ? t('search.forSale') : 
                     listingType[0] === 'rent' ? t('search.forRent') : 
                     t('search.underConstruction')) : 
                    t('search.multipleListingTypes')}
                  <button 
                    onClick={() => setListingType([])} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {minBeds > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <Bed size={12} className="mr-1" />
                  {t('search.minBeds', { count: minBeds })}
                  <button 
                    onClick={() => setMinBeds(0)} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {minBaths > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <Bath size={12} className="mr-1" />
                  {t('search.minBaths', { count: minBaths })}
                  <button 
                    onClick={() => setMinBaths(0)} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {(minPrice > 0 || maxPrice < maxPriceLimit) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <DollarSign size={12} className="mr-1" />
                  {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} DZD
                  <button 
                    onClick={() => { setMinPrice(0); setMaxPrice(maxPriceLimit); }} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {(minLivingArea > 0 || maxLivingArea < maxLivingAreaLimit) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <Ruler size={12} className="mr-1" />
                  {minLivingArea} - {maxLivingArea} m²
                  <button 
                    onClick={() => { setMinLivingArea(0); setMaxLivingArea(maxLivingAreaLimit); }} 
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 border border-t-0 rounded-b-lg">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className={`text-xl font-semibold mb-2 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {t('search.noPropertiesFound')}
                </h3>
                <p className={`text-muted-foreground mb-4 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {t('search.adjustSearchCriteria')}
                </p>
                <Button onClick={handleReset} variant="cta" className={dir === 'rtl' ? 'arabic-text' : ''}>
                  {t('search.resetFilters')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
