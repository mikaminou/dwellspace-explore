
import React, { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { MapView } from "@/components/map/MapView";
import { useSearch } from "@/contexts/search/SearchContext";
import { useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";

// Main Search component that provides the context first
export default function Search() {
  return (
    <SearchProvider>
      <SearchContent />
    </SearchProvider>
  );
}

// Create a SearchContent component that uses context AFTER it's provided
function SearchContent() {
  const { 
    showMap, 
    searchTerm, 
    setFiltersAppliedState, 
    selectedCities, 
    properties,
    loading,
    isNewSearch,
    filtersAppliedState
  } = useSearch();
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  const [manualNavigation, setManualNavigation] = useState(false);
  
  // Force re-layout on route changes to prevent stale UI
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Small delay to ensure everything is properly initialized
    const timeout = setTimeout(() => {
      // Force a layout update
      window.dispatchEvent(new Event('resize'));
      // Force a refresh of key components
      setRefreshKey(prevKey => prevKey + 1);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  // Check for query parameters when the page loads
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.get('q') || params.get('propertyType') || params.get('listingType')) {
        // If we have query parameters, set the filters as applied
        setFiltersAppliedState(true);
        setManualNavigation(false);
      }
    } else if (selectedCities.length === 0 && !searchTerm && !filtersAppliedState && isNewSearch) {
      // If there are no cities selected, no search term, and no filters applied,
      // the user probably navigated to the search page manually
      setManualNavigation(true);
    } else {
      setManualNavigation(false);
    }
  }, [location.search, setFiltersAppliedState, selectedCities, searchTerm, filtersAppliedState, isNewSearch]);

  // Force resize when map visibility changes
  useEffect(() => {
    // Small delay to allow DOM to update
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [showMap]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <SearchHeader key={`search-header-${refreshKey}`} />
      <Filters />
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto">
        <div className={`${showMap ? 'lg:w-1/2' : 'w-full'} transition-all duration-300 ease-in-out`}>
          {manualNavigation && !loading ? (
            <div className="container mx-auto py-20 px-4 text-center">
              <div className="bg-muted p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-3">No Search Criteria</h2>
                <p className="text-muted-foreground mb-6">
                  Please use the search bar above to find properties that match your criteria.
                </p>
              </div>
            </div>
          ) : (
            <SearchResults key={`search-results-${refreshKey}`} />
          )}
        </div>
        {showMap && (
          <div className="lg:w-1/2 h-[calc(100vh-216px)] lg:sticky lg:top-[216px] mt-16 pl-4 pr-4 pb-6">
            <div className="h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <MapView />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
