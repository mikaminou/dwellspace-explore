
import { useCallback, useRef } from "react";
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
  // Add a request in progress ref to prevent duplicate requests
  const requestInProgress = useRef(false);
  // Add a request counter to track the latest request
  const requestCounter = useRef(0);

  // Define available amenities for validation
  const availableAmenities = [
    'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 'furnished', 
    'air conditioning', 'wifi', 'elevator', 'security', 'gym', 'modern', 
    'fireplace', 'basement', 'storage', 'view', 'waterfront', 'mountain view'
  ];

  const handleSearch = useCallback(async () => {
    // If there's already a request in progress, don't start another one
    if (requestInProgress.current) {
      console.log("Search already in progress, skipping");
      return;
    }
    
    if (!selectedCities || selectedCities.length === 0) {
      console.log("No cities selected, cannot search");
      setProperties([]);
      setLoading(false);
      return;
    }
    
    // Set loading state and mark request as in progress
    setLoading(true);
    requestInProgress.current = true;
    filtersApplied.current = true;
    
    // Increment request counter for this specific request
    const currentRequestId = ++requestCounter.current;
    
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
        propertyType: propertyType && propertyType.length > 0 ? propertyType : undefined,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice,
        minBeds: minBeds > 0 ? minBeds : undefined,
        minBaths: minBaths > 0 ? minBaths : undefined,
        minLivingArea: minLivingArea > 0 ? minLivingArea : undefined,
        maxLivingArea,
        listingType: listingType && listingType.length > 0 ? listingType : undefined,
        features: features.length > 0 ? features : undefined,
      };
      
      console.log("Search params:", searchParams);
      
      // Empty search term when it's just whitespace or nonsense
      let effectiveSearchTerm = "";
      if (searchTerm && searchTerm.trim().length > 2) {
        effectiveSearchTerm = searchTerm;
      }
      
      console.log("Starting API request with term:", effectiveSearchTerm);
      const results = await searchProperties(effectiveSearchTerm, searchParams);
      console.log("API request completed");
      
      // Only proceed if this is still the most recent request
      if (currentRequestId === requestCounter.current) {
        console.log(`Found ${results.length} properties for cities:`, selectedCities);
        
        // Only update the UI once we have the final results
        setProperties(results);
        setLoading(false);
      } else {
        console.log("Ignoring outdated search results");
      }
    } catch (error) {
      console.error("Search failed:", error);
      // Only show error toast and update state if this is the most recent request
      if (currentRequestId === requestCounter.current) {
        toast.error(t('search.searchFailed') || 'Search failed');
        setLoading(false);
      }
      // Don't clear properties on error to prevent UI flickering
    } finally {
      // Reset request in progress flag regardless of outcome
      requestInProgress.current = false;
    }
  }, [
    searchTerm, selectedCities, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minBaths, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities, availableAmenities
  ]);

  return { handleSearch };
}
