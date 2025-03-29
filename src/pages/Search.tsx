
import React, { useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { SearchHeader } from "@/components/search/SearchHeader";
import { Filters } from "@/components/search/Filters";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  const propertyType = searchParams.get('propertyType');
  const listingType = searchParams.get('listingType');

  // Show notification for natural language queries
  useEffect(() => {
    if (searchQuery && (
      searchQuery.includes("bedroom") || 
      searchQuery.includes("with") || 
      searchQuery.includes("near") ||
      searchQuery.includes("under") ||
      searchQuery.toLowerCase().includes("modern")
    )) {
      setTimeout(() => {
        toast({
          title: "AI Search Activated",
          description: "We're analyzing your natural language query to find the perfect properties.",
          duration: 5000,
          icon: <Sparkles className="h-4 w-4 text-cta" />
        });
      }, 500);
    }
  }, [searchQuery]);

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
