
import { useCallback } from "react";
import { searchProperties } from "@/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";

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
  filtersApplied: React.MutableRefObject<boolean>,
  selectedAmenities: string[] = [] // Add amenities parameter with default empty array
) {
  const { t } = useLanguage();

  const handleSearch = useCallback(async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    filtersApplied.current = true;
    try {
      // Get features from natural language query if it contains certain keywords
      let features: string[] = [...selectedAmenities]; // Start with selected amenities
      
      if (searchTerm) {
        const lowerQuery = searchTerm.toLowerCase();
        
        // Extract common amenities
        const amenities = ['pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 
          'furnished', 'air conditioning', 'modern', 'elevator', 'security'];
          
        amenities.forEach(amenity => {
          if (lowerQuery.includes(amenity) && !features.includes(amenity)) {
            features.push(amenity);
          }
        });
        
        // Extract "near" locations as features
        const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
        if (nearMatch && nearMatch[1]) {
          features.push(`near ${nearMatch[1].trim()}`);
        }
      }
      
      const results = await searchProperties(searchTerm, {
        city: selectedCity === 'any' ? undefined : selectedCity,
        propertyType: propertyType.length > 0 ? propertyType.join(',') : undefined,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minBeds: minBeds,
        minLivingArea: minLivingArea,
        maxLivingArea: maxLivingArea,
        listingType: listingType.length > 0 ? listingType.join(',') as any : undefined,
        features: features.length > 0 ? features : undefined,
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
    filtersApplied, t, selectedAmenities // Add selectedAmenities to dependencies
  ]);

  return { handleSearch };
}
