
import { useCallback } from "react";
import { searchProperties } from "@/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { SearchFilters } from "./types";

export function useSearchOperations(
  searchTerm: string,
  selectedCity: string,
  propertyType: string[],
  listingType: string[],
  minPrice: number,
  maxPrice: number,
  minBeds: number,
  minLivingArea: number,
  maxLivingArea: number,
  setProperties: (properties: any[]) => void,
  setLoading: (loading: boolean) => void,
  filtersApplied: React.MutableRefObject<boolean>
) {
  const { t } = useLanguage();

  const handleSearch = useCallback(async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    filtersApplied.current = true;
    try {
      const results = await searchProperties(searchTerm, {
        city: selectedCity === 'any' ? undefined : selectedCity,
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
  }, [
    searchTerm, selectedCity, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t
  ]);

  return { handleSearch };
}
