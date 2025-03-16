
import React from "react";
import { MainNav } from "@/components/MainNav";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";
import { MapFilters } from "@/components/map/MapFilters";

export default function Map() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <MapFilters />
          <Filters />
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="bg-white dark:bg-card p-8 rounded-lg shadow-lg max-w-md text-center">
              <h3 className="text-xl font-semibold mb-4">Map Temporarily Disabled</h3>
              <p className="text-muted-foreground">
                The map feature has been temporarily disabled for maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
