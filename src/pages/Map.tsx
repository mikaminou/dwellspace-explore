
import React from "react";
import { MainNav } from "@/components/MainNav";
import { MapView } from "@/components/map/MapView";
import { MapFilters } from "@/components/map/MapFilters";
import { SearchProvider } from "@/contexts/search/SearchContext";

export default function Map() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <MapFilters />
          <MapView />
        </div>
      </div>
    </SearchProvider>
  );
}
