
import React from "react";
import { MainNav } from "@/components/MainNav";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { FilterChips } from "@/components/search/FilterChips";
import { PropertyGrid } from "@/components/search/PropertyGrid";
import { SortByControl } from "@/components/search/SortByControl";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { SearchResults } from "@/components/search/SearchResults";

export default function Search() {
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        <SearchHeader />
        <Filters />
        <SearchResults />
      </div>
    </SearchProvider>
  );
}
