
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

  // Define available amenities for validation
  const availableAmenities = [
    'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 'furnished', 
    'air conditioning', 'wifi', 'elevator', 'security', 'gym', 'modern', 
    'fireplace', 'basement', 'storage', 'view', 'waterfront', 'mountain view'
  ];

  const handleSearch = useCallback(async () => {
    if (!selectedCities || selectedCities.length === 0) {
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
      console.log("Property types:", propertyType);
      
      let features: string[] = [];
      
      // Only include valid amenities if they exist
      if (selectedAmenities && selectedAmenities.length > 0) {
        // Validate amenities against available options
        features = selectedAmenities.filter(amenity => 
          availableAmenities.includes(amenity.toLowerCase())
        );
        
        if (features.length !== selectedAmenities.length) {
          console.log("Some amenities were filtered out because they were invalid:", 
            selectedAmenities.filter(a => !availableAmenities.includes(a.toLowerCase())));
        }
      }
      
      if (searchTerm) {
        const lowerQuery = searchTerm.toLowerCase();
        
        // Extract and validate amenities from search term
        availableAmenities.forEach(amenity => {
          if (lowerQuery.includes(amenity.toLowerCase()) && !features.includes(amenity)) {
            features.push(amenity);
          }
        });
        
        // Extract "near" locations
        const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
        if (nearMatch && nearMatch[1]) {
          features.push(`near ${nearMatch[1].trim()}`);
        }
      }
      
      // Build search parameters with null checks
      const searchParams = {
        city: selectedCities,
        propertyType: Array.isArray(propertyType) && propertyType.length > 0 ? propertyType : undefined,
        minPrice: typeof minPrice === 'number' && minPrice > 0 ? minPrice : undefined,
        maxPrice: typeof maxPrice === 'number' ? maxPrice : undefined,
        minBeds: typeof minBeds === 'number' && minBeds > 0 ? minBeds : undefined,
        minBaths: typeof minBaths === 'number' && minBaths > 0 ? minBaths : undefined,
        minLivingArea: typeof minLivingArea === 'number' && minLivingArea > 0 ? minLivingArea : undefined,
        maxLivingArea: typeof maxLivingArea === 'number' ? maxLivingArea : undefined,
        listingType: Array.isArray(listingType) && listingType.length > 0 ? listingType : undefined,
        features: features.length > 0 ? features : undefined,
      };
      
      console.log("Search params:", searchParams);
      
      // Empty search term when it's just whitespace or nonsense
      let effectiveSearchTerm = "";
      if (searchTerm && searchTerm.trim().length > 2) {
        effectiveSearchTerm = searchTerm;
      }
      
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
      // Ensure loading is set to false regardless of success or failure
      setLoading(false);
    }
  }, [
    searchTerm, selectedCities, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minBaths, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities, availableAmenities
  ]);

  return { handleSearch };
}
