
import React, { Suspense } from "react";
import { MainNav } from "@/components/MainNav";
import { MapFilters } from "@/components/map/MapFilters";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";
import { Loader2 } from "lucide-react";

// Lazy load the MapView component to prevent issues with Mapbox initialization
const MapViewLazy = React.lazy(() => import("@/components/map/MapView"));

export default function Map() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <MapFilters />
          <Filters />
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-primary">Loading map...</span>
            </div>
          }>
            <MapViewLazy />
          </Suspense>
        </div>
      </div>
    </SearchProvider>
  );
}
