
import React from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/api/properties";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  handleReset: () => void;
  selectedCities: string[];
}

export function PropertyGrid({ properties, loading, handleReset, selectedCities }: PropertyGridProps) {
  const { t } = useLanguage();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  // Handle smooth transitions between loading states
  React.useEffect(() => {
    if (loading) {
      setIsTransitioning(true);
    } else {
      // Delay removing the transition state slightly for smoother UI
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading || isTransitioning) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-100 animate-pulse rounded-lg h-[300px] flex items-center justify-center text-gray-400"
          >
            <span className="text-lg">{t('search.loading')}</span>
          </div>
        ))}
      </div>
    );
  }

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
