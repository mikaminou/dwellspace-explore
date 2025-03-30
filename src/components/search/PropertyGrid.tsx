import React, { useEffect, useRef } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/api/properties";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  handleReset: () => void;
  selectedCities: string[];
}

export function PropertyGrid({ properties, loading, handleReset, selectedCities }: PropertyGridProps) {
  const { t } = useLanguage();
  const prevPropertiesRef = useRef<Property[]>([]);
  const hasLoadedBefore = useRef(false);
  
  useEffect(() => {
    if (!loading && properties.length > 0) {
      prevPropertiesRef.current = properties;
      hasLoadedBefore.current = true;
    }
  }, [properties, loading]);
  
  if (loading && !hasLoadedBefore.current) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (loading && hasLoadedBefore.current && prevPropertiesRef.current.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prevPropertiesRef.current.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    if (selectedCities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SearchIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">{t('search.selectCity') || 'Please select a city'}</h3>
          <p className="text-muted-foreground mb-4">{t('search.noPropertiesWithoutCity') || 'You need to select at least one city to view properties'}</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <SearchIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium mb-2">{t('search.noPropertiesFound') || 'No properties found'}</h3>
        <p className="text-muted-foreground mb-4">
          {t('search.tryAdjustingFilters') || 'Try adjusting your filters to find more properties'}
        </p>
        <Button onClick={handleReset} variant="outline">
          {t('search.resetFilters') || 'Reset Filters'}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
