
import React from "react";
import { MainNav } from "@/components/MainNav";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";

export default function Map() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <Filters />
          <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
            <div className="bg-white dark:bg-card p-6 rounded-lg shadow-lg max-w-md text-center">
              <h3 className="text-xl font-semibold mb-2">Map has been removed</h3>
              <p className="text-muted-foreground mb-4">
                The map functionality has been removed from this application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
