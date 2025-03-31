import { useCallback, useRef, useEffect } from "react";
import { searchProperties } from "@/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Property } from "@/api/properties";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  // Add a flag to track if a search is already in progress
  let searchInProgress = false;
  // Use localStorage to cache the last search results
  const [cachedResults, setCachedResults] = useLocalStorage<{
    results: Property[];
    searchParams: any;
    timestamp: number;
  } | null>("cached_search_results", null);
  
  // Keep track of the current search parameters for caching
  const currentSearchParams = useRef({
    searchTerm,
    selectedCities,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    selectedAmenities
  });
  
  // Update the current search parameters ref when they change
  useEffect(() => {
    currentSearchParams.current = {
      searchTerm,
      selectedCities,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      minBeds,
      minBaths,
      minLivingArea,
      maxLivingArea,
      selectedAmenities
    };
  }, [
    searchTerm, selectedCities, propertyType, listingType, 
    minPrice, maxPrice, minBeds, minBaths, minLivingArea, 
    maxLivingArea, selectedAmenities
  ]);

  const handleSearch = useCallback(async () => {
    // Prevent concurrent searches
    if (searchInProgress) {
      console.log("Search already in progress, skipping");
      return;
    }
    
    if (selectedCities.length === 0) {
      console.log("No cities selected, cannot search");
      setProperties([]);
      setLoading(false);
      return;
    }
    
    // Generate a cache key based on current search parameters
    const searchParams = {
      searchTerm,
      cities: selectedCities,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      minBeds,
      minBaths,
      minLivingArea,
      maxLivingArea,
      selectedAmenities
    };
    
    // Check if we have cached results for these exact search parameters
    if (cachedResults && 
        JSON.stringify(cachedResults.searchParams) === JSON.stringify(searchParams) && 
        cachedResults.results.length > 0 &&
        // Cache is valid for 5 minutes (300000 ms)
        Date.now() - cachedResults.timestamp < 300000) {
      console.log("Using cached search results");
      setProperties(cachedResults.results);
      setLoading(false);
      return;
    }
    
    // Set flag to indicate search is starting
    searchInProgress = true;
    
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
      const apiSearchParams = {
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
      
      console.log("Search params after validation:", apiSearchParams);
      
      // Empty search term when it's just whitespace or nonsense
      let effectiveSearchTerm = "";
      if (searchTerm && searchTerm.trim().length > 2) {
        effectiveSearchTerm = searchTerm;
      }
      
      const results = await searchProperties(effectiveSearchTerm, apiSearchParams);
      
      console.log(`Found ${results.length} properties for cities:`, selectedCities);
      
      // Update the properties with the search results
      setProperties(results);
      
      // Cache the results
      setCachedResults({
        results,
        searchParams,
        timestamp: Date.now()
      });
    } catch (error: any) {
      toast.error(t('search.searchFailed'));
      console.error("Search failed:", error.message);
      // Clear properties on error to prevent showing stale results
      setProperties([]);
    } finally {
      setLoading(false);
      // Reset the flag to allow future searches
      searchInProgress = false;
    }
  }, [
    searchTerm, selectedCities, propertyType, listingType, minPrice, maxPrice, 
    minBeds, minBaths, minLivingArea, maxLivingArea, setProperties, setLoading, 
    filtersApplied, t, selectedAmenities, cachedResults, setCachedResults
  ]);

  return { handleSearch };
}
