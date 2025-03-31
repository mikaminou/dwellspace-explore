
import React from 'react';
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/api/properties";

export function FeaturedProperties() {
  const { t, dir } = useLanguage();
  const { properties, loading, error } = useProperties();
  
  const featuredProperties = properties.slice(0, 3);

  return (
    <section className="py-16 container mx-auto px-4 animate-fade-in">
      <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h2 className={`text-3xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          {t('featured.title')}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-destructive">Failed to load properties</p>
        </div>
      ) : featuredProperties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
