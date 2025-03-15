
import React, { createContext, useContext } from "react";
import { useSearchProperties } from "@/hooks/useSearchProperties";
import { SearchHookResult } from "@/hooks/search/types";

// Create a context with a default empty value
const SearchContext = createContext<SearchHookResult | undefined>(undefined);

// Provider component that wraps parts of the app that need search data
export function SearchProvider({ children }: { children: React.ReactNode }) {
  // Use our hook to get all search state and functions
  const searchData = useSearchProperties();

  return (
    <SearchContext.Provider value={searchData}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook to use the search context
export function useSearch(): SearchHookResult {
  const context = useContext(SearchContext);
  
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  
  return context;
}
