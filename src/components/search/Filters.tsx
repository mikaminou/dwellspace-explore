
import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { MobileFilters } from "./filters/MobileFilters";
import { DesktopFilters } from "./filters/DesktopFilters";
import { useSearch } from "@/contexts/search/SearchContext";

export function Filters() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { showFilters } = useSearch();

  if (!showFilters) return null;

  return (
    <div className="bg-white border-t border-b border-gray-200 py-4 overflow-hidden transition-all duration-300">
      <div className="container mx-auto px-4">
        {isMobile ? <MobileFilters /> : <DesktopFilters />}
      </div>
    </div>
  );
}
