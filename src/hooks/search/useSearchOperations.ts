
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
  // Use a single requestId to track current request
  const currentRequestId = useRef(0);
  const isRequestInProgress = useRef(false);

  // Define available amenities for validation
  const availableAmenities = [
    'pool', 'garden', 'garage', 'balcony', 'terrace', 'parking', 'furnished', 
    'air conditioning', 'wifi', 'elevator', 'security', 'gym', 'modern', 
    'fireplace', 'basement', 'storage', 'view', 'waterfront', 'mountain view'
  ];

  const handleSearch = useCallback(async () => {
    // If there's already a request in progress, skip this one
    if (isRequestInProgress.current) {
      console.log("Search request already in progress, skipping");
      return;
    }
    
    // Check if cities are selected
    if (!selectedCities || selectedCities.length === 0) {
      console.log("No cities selected, cannot search");
      setProperties([]);
      setLoading(false);
      return;
    }
    
    // Set loading state and lock request state
    setLoading(true);
    isRequestInProgress.current = true;
    filtersApplied.current = true;
    
    // Create a new request ID for this search
    const requestId = ++currentRequestId.current;
    
    try {
      console.log(`Starting search request #${requestId} for cities:`, selectedCities);
      
      let features: string[] = [];
      
      // Process amenities
      if (selectedAmenities && selectedAmenities.length > 0) {
        features = selectedAmenities.filter(amenity => 
          availableAmenities.includes(amenity.toLowerCase())
        );
      }
      
      // Process search term for additional features
      if (searchTerm) {
        const lowerQuery = searchTerm.toLowerCase();
        
        availableAmenities.forEach(amenity => {
          if (lowerQuery.includes(amenity.toLowerCase()) && !features.includes(amenity)) {
            features.push(amenity);
          }
        });
        
        const nearMatch = lowerQuery.match(/near\s+(.+?)(?:\s+in|$|\s+with|\s+under|\s+between)/i);
        if (nearMatch && nearMatch[1]) {
          features.push(`near ${nearMatch[1].trim()}`);
        }
      }
      
      // Build search parameters - only include non-empty arrays and non-zero values
      const searchParams = {
        city: selectedCities,
        propertyType: propertyType.length > 0 ? propertyType : undefined,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice,
        minBeds: minBeds > 0 ? minBeds : undefined,
        minBaths: minBaths > 0 ? minBaths : undefined,
        minLivingArea: minLivingArea > 0 ? minLivingArea : undefined,
        maxLivingArea,
        listingType: listingType.length > 0 ? listingType : undefined,
        features: features.length > 0 ? features : undefined,
      };
      
      console.log(`Search request #${requestId} params:`, searchParams);
      
      // Clean up search term
      let effectiveSearchTerm = "";
      if (searchTerm && searchTerm.trim().length > 2) {
        effectiveSearchTerm = searchTerm;
      }
      
      // Perform the search
      const results = await searchProperties(effectiveSearchTerm, searchParams);
      
      // Only update if this is still the current request
      if (requestId === currentRequestId.current) {
        console.log(`Search request #${requestId} completed with ${results.length} results`);
        setProperties(results);
      } else {
        console.log(`Search request #${requestId} ignored - newer request exists`);
      }
    } catch (error) {
      console.error(`Search request #${currentRequestId.current} failed:`, error);
      // Only show error for current request
      if (requestId === currentRequestId.current) {
        toast.error(t('search.searchFailed') || 'Search failed');
      }
    } finally {
      // Always update loading state and unlock request state for current request
      if (requestId === currentRequestId.current) {
        setLoading(false);
      }
      isRequestInProgress.current = false;
    }
  }, [
    searchTerm, selectedCities, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minBaths, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities
  ]);

  return { handleSearch };
}
