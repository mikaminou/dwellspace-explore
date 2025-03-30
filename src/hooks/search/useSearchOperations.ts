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
    
    // Set loading state first before any async operations
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
      
      // Build search parameters with proper checks
      const searchParams = {
        city: selectedCities,
        propertyType: Array.isArray(propertyType) && propertyType.length > 0 ? propertyType : undefined,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice,
        minBeds: minBeds > 0 ? minBeds : undefined,
        minBaths: minBaths > 0 ? minBaths : undefined,
        minLivingArea: minLivingArea > 0 ? minLivingArea : undefined,
        maxLivingArea: maxLivingArea,
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
      
      // Only update state if we have results or if there were no properties found
      // This prevents flickering during scrolling
      setProperties(results);
    } catch (error) {
      toast.error(t('search.searchFailed') || 'Search failed');
      console.error("Search failed:", error);
      // Keep the previous properties on error to prevent UI flickering
      // Only clear if explicitly needed
      setProperties([]);
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  }, [
    searchTerm, selectedCities, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minBaths, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities, availableAmenities
  ]);

  return { handleSearch };
}
