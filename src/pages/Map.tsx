
import React, { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { MapView } from "@/components/map/MapView";
import { MapFilters } from "@/components/map/MapFilters";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Map() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <MapFilters />
          {showFilters && <Filters />}
          <div className="relative flex-1">
            <MapView />
            {!showFilters && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-white shadow-md"
                onClick={() => setShowFilters(true)}
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Filters
              </Button>
            )}
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-white shadow-md"
                onClick={() => setShowFilters(false)}
              >
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
