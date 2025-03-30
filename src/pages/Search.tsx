
import React, { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { MapView } from "@/components/map/MapView";

export default function Search() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMap, setShowMap] = useState(false);
  
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
  
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <SearchHeader key={`search-header-${refreshKey}`} />
        <Filters />
        <div className="flex flex-col lg:flex-row">
          <div className={`${showMap ? 'lg:w-1/2' : 'w-full'}`}>
            <SearchResults key={`search-results-${refreshKey}`} />
          </div>
          {showMap && (
            <div className="lg:w-1/2 h-[calc(100vh-64px)] sticky top-16">
              <MapView />
            </div>
          )}
        </div>
      </div>
    </SearchProvider>
  );
}
