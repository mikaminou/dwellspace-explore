import React from 'react';
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Property } from "@/api/properties";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StarIcon, ArrowRightIcon } from "lucide-react";

interface LuxuryPropertiesProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

export const LuxuryProperties: React.FC<LuxuryPropertiesProps> = ({ properties, loading, error }) => {
  const { t, dir } = useLanguage();

  return (
    <section className="py-16 bg-gray-50 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-3xl font-bold flex items-center gap-2 ${dir === 'rtl' ? 'arabic-text flex-row-reverse' : ''}`}>
            <StarIcon className="h-6 w-6 text-luxury" />
            {t('luxury.title')}
          </h2>
          <Button variant="luxury" asChild>
            <Link to="/search?luxury=true" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {t('luxury.viewAll')}
              <ArrowRightIcon className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load properties</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No luxury properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};