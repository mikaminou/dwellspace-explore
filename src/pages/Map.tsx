
import React, { Suspense, useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MapFilters } from "@/components/map/MapFilters";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy load the MapView component to prevent issues with Mapbox initialization
const MapViewLazy = React.lazy(() => import("@/components/map/MapView"));

export default function Map() {
  const [mapboxLoadError, setMapboxLoadError] = useState<Error | null>(null);

  // Try to load Mapbox script dynamically if not already available
  useEffect(() => {
    // Skip if Mapbox is already available
    if (window.mapboxgl) {
      console.log("Mapbox GL JS is already available");
      return;
    }

    console.log("Attempting to load Mapbox GL JS dynamically");
    
    const loadMapbox = () => {
      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.async = true;
      
      script.onload = () => {
        console.log("Mapbox GL JS loaded successfully");
        
        // Load CSS after script loads
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        document.head.appendChild(link);
        
        // Force a re-render
        setMapboxLoadError(null);
      };
      
      script.onerror = (error) => {
        console.error("Failed to load Mapbox GL JS:", error);
        setMapboxLoadError(new Error("Failed to load Mapbox GL JS. Please check your internet connection."));
      };
      
      document.head.appendChild(script);
    };
    
    loadMapbox();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <MapFilters />
          <Filters />
          
          {mapboxLoadError ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-destructive/10 p-6 rounded-md text-destructive max-w-md w-full">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-semibold text-lg">Failed to Load Map</h3>
                </div>
                <p className="mb-4">
                  {mapboxLoadError.message || "We couldn't load the map component. Please check your internet connection."}
                </p>
                <Button 
                  onClick={handleRetry}
                  variant="default"
                  className="w-full"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-primary">Loading map...</span>
              </div>
            }>
              <MapViewLazy />
            </Suspense>
          )}
        </div>
      </div>
    </SearchProvider>
  );
}
