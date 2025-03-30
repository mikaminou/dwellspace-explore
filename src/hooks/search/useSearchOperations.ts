
import { useCallback } from "react";
import { searchProperties } from "@/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";

export function useSearchOperations(
  searchTerm: string,
  selectedCities: string[],
  propertyType: string[],
  listingType: string[],
  minPrice: number,
  maxPrice: number,
  minBeds: number,
  minLivingArea: number,
  maxLivingArea: number,
  setProperties: (properties: any[]) => void,
  setLoading: (loading: boolean) => void,
  filtersApplied: React.MutableRefObject<boolean>,
  selectedAmenities: string[] = []
) {
  const { t } = useLanguage();

  const handleSearch = useCallback(async () => {
    if (selectedCities.length === 0) {
      console.log("No cities selected, cannot search");
      setProperties([]);
      setLoading(false);
      return;
    }
    
    // Set loading state first
    setLoading(true);
    filtersApplied.current = true;
    
    try {
      console.log("Searching with cities:", selectedCities);
      
      let features: string[] = [...selectedAmenities];
      
      if (searchTerm) {
        const lowerQuery = searchTerm.toLowerCase();
        
        const amenities = ['pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 
          'furnished', 'air conditioning', 'modern', 'elevator', 'security'];
          
        amenities.forEach(amenity => {
          if (lowerQuery.includes(amenity) && !features.includes(amenity)) {
            features.push(amenity);
          }
        });
        
        const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
        if (nearMatch && nearMatch[1]) {
          features.push(`near ${nearMatch[1].trim()}`);
        }
      }
      
      const searchParams = {
        city: selectedCities,
        propertyType: propertyType.length > 0 ? propertyType : undefined,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minBeds: minBeds,
        minLivingArea: minLivingArea,
        maxLivingArea: maxLivingArea,
        listingType: listingType.length > 0 ? listingType : undefined,
        features: features.length > 0 ? features : undefined,
      };
      
      console.log("Search params:", searchParams);
      
      // Use empty string for searchTerm if it's been cleared
      const effectiveSearchTerm = searchTerm || "";
      const results = await searchProperties(effectiveSearchTerm, searchParams);
      
      console.log(`Found ${results.length} properties for cities:`, selectedCities);
      
      // Ensure we're still in the current search call before updating state
      setProperties(results);
    } catch (error: any) {
      toast.error(t('search.searchFailed'));
      console.error("Search failed:", error.message);
      // Clear properties on error to prevent showing stale results
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm, selectedCities, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities
  ]);

  return { handleSearch };
}
