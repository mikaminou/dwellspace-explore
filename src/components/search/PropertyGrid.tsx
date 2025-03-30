
import React, { useEffect } from "react";
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
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  // Improved transition logic between loading states
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (loading) {
      setIsTransitioning(true);
    } else {
      // Give a slight delay before removing skeleton for smoother transition
      timeoutId = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

  // Show skeletons when loading
  if (loading || isTransitioning) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state if no properties were found
  if (properties.length === 0) {
    if (selectedCities.length === 0) {
      return (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center animate-fade-in">
          <SearchIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">{t('search.selectCity') || 'Please select a city'}</h3>
          <p className="text-muted-foreground mb-4">{t('search.noPropertiesWithoutCity') || 'You need to select at least one city to view properties'}</p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <SearchIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium mb-2">{t('search.noPropertiesFound')}</h3>
        <p className="text-muted-foreground mb-4">
          {t('search.tryAdjustingFilters')}
        </p>
        <Button onClick={handleReset} variant="outline">
          {t('search.resetFilters')}
        </Button>
      </div>
    );
  }

  // Render property cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

// Extract the skeleton into a separate component for reuse
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
