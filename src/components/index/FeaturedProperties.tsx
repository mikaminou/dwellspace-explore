import React from 'react';
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Property } from "@/api/properties";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

interface FeaturedPropertiesProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ properties, loading, error }) => {
  const { t, dir } = useLanguage();

  return (
    <section className="py-16 container mx-auto px-4 animate-fade-in">
      <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h2 className={`text-3xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('featured.title')}
        </h2>
        <Button variant="outline" asChild>
          <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {t('featured.viewAll')}
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
          <p className="text-muted-foreground">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
};