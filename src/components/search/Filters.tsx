
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
    <div className="bg-white border-t border-b border-gray-200 py-4 overflow-hidden transition-all duration-300 bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-4 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px"
          }}
        />
        
        {/* Actual filters */}
        <div className="relative z-10">
          {isMobile ? <MobileFilters /> : <DesktopFilters />}
        </div>
      </div>
    </div>
  );
}
