
import { useCallback } from "react";
import { searchProperties } from "@/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Property } from "@/api/properties";

export function useSearchOperations(
  searchTerm: string,
  selectedCities: string[],
  propertyType: string[],
  listingType: string[],
  minPrice: number,
  maxPrice: number,
  minBeds: number,
  minBaths: number,
  minLivingArea: number,
  maxLivingArea: number,
  filtersApplied: React.MutableRefObject<boolean>,
  selectedAmenities: string[] = [],
  setProperties: (properties: Property[]) => void,
  setLoading: (loading: boolean) => void
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
      
      let features: string[] = [];
      
      // Only include valid amenities if they exist
      if (selectedAmenities && selectedAmenities.length > 0) {
        features = [...selectedAmenities];
      }
      
      // Process recognized features/amenities from natural language query
      if (searchTerm) {
        const lowerQuery = searchTerm.toLowerCase();
        
        // List of valid amenities to extract from query
        const validAmenities = [
          'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 
          'furnished', 'air conditioning', 'modern', 'elevator', 'security', 'gym', 
          'fireplace', 'basement', 'storage', 'view', 'waterfront', 'mountain view'
        ];
        
        // Only extract amenities that are actually in our valid list
        validAmenities.forEach(amenity => {
          if (lowerQuery.includes(amenity) && !features.includes(amenity)) {
            features.push(amenity);
          }
        });
        
        // Extract "near location" phrases
        const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
        if (nearMatch && nearMatch[1]) {
          features.push(`near ${nearMatch[1].trim()}`);
        }
      }
      
      // Build search parameters with validated values
      const searchParams = {
        city: selectedCities,
        propertyType: propertyType.length > 0 ? propertyType : undefined,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minBeds: minBeds,
        minBaths: minBaths,
        minLivingArea: minLivingArea,
        maxLivingArea: maxLivingArea,
        listingType: listingType.length > 0 ? listingType : undefined,
        features: features.length > 0 ? features : undefined,
      };
      
      console.log("Search params after validation:", searchParams);
      
      // Empty search term when it's just whitespace or nonsense
      let effectiveSearchTerm = "";
      if (searchTerm && searchTerm.trim().length > 2) {
        effectiveSearchTerm = searchTerm;
      }
      
      const results = await searchProperties(effectiveSearchTerm, searchParams);
      
      console.log(`Found ${results.length} properties for cities:`, selectedCities);
      
      // Update the properties with the search results
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
    minBeds, minBaths, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities
  ]);

  return { handleSearch };
}
