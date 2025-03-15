import { useState, useEffect, useRef } from "react";
import { searchProperties } from "@/api";
import { Property } from "@/api/properties";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { getMaxPropertyPrice, getMaxLivingArea, getAllCities } from "@/integrations/supabase/client";

export function useSearchProperties() {
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
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);
  
  const { t } = useLanguage();
  const filtersApplied = useRef(false);

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

  const handleFilterRemoval = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'city':
        setSelectedCity('any');
        break;
      case 'propertyType':
        if (value) {
          setPropertyType(propertyType.filter(type => type !== value));
        }
        break;
      case 'listingType':
        if (value) {
          setListingType(listingType.filter(type => type !== value));
        }
        break;
      case 'beds':
        setMinBeds(0);
        break;
      case 'baths':
        setMinBaths(0);
        break;
      case 'livingArea':
        setMinLivingArea(0);
        setMaxLivingArea(maxLivingAreaLimit);
        break;
      default:
        break;
    }
    
    setTimeout(() => {
      handleSearch();
    }, 0);
  };

  return {
    searchTerm,
    setSearchTerm,
    properties,
    loading,
    showFilters,
    setShowFilters,
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
    cities,
    maxPriceLimit,
    maxLivingAreaLimit,
    activeFilterSection,
    setActiveFilterSection,
    filtersApplied,
    handleSearch,
    handleReset,
    getActiveFiltersCount,
    handleFilterRemoval
  };
}
