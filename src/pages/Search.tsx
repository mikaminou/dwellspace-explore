
import React, { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { MapView } from "@/components/map/MapView";
import { useSearch } from "@/contexts/search/SearchContext";
import { useLocation } from "react-router-dom";

// Create a SearchContent component to use context
function SearchContent() {
  const { showMap, searchTerm, setFiltersAppliedState } = useSearch();
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  
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
      }
    }
  }, [location.search, setFiltersAppliedState]);

  // Force resize when map visibility changes
  useEffect(() => {
    // Small delay to allow DOM to update
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [showMap]);

  return (
    <>
      <MainNav />
      <SearchHeader key={`search-header-${refreshKey}`} />
      <Filters />
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto">
        <div className={`${showMap ? 'lg:w-1/2' : 'w-full'} transition-all duration-300 ease-in-out`}>
          <SearchResults key={`search-results-${refreshKey}`} />
        </div>
        {showMap && (
          <div className="lg:w-1/2 h-[calc(100vh-216px)] lg:sticky lg:top-[216px] mt-16 pl-4 pr-4 pb-6">
            <div className="h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <MapView />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Main Search component that provides the context
export default function Search() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <SearchContent />
      </div>
    </SearchProvider>
  );
}
