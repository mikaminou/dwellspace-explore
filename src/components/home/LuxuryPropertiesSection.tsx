
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/api/properties";

interface LuxuryPropertiesSectionProps {
  properties: Property[];
  loading?: boolean;
}

export default function LuxuryPropertiesSection({ 
  properties = [], 
  loading = false 
}: LuxuryPropertiesSectionProps) {
  const { t, dir } = useLanguage();
  
  // Make sure properties is an array
  const safeProperties = Array.isArray(properties) ? properties : [];
  
  // Filter premium properties
  const premiumProperties = safeProperties
    .filter((p) => 
      p && (p.isPremium === true || 
      (p.owner && p.owner.role === 'seller'))
    )
    .slice(0, 3);

  return (
    <section className="py-16 bg-muted/30 dark:bg-muted/20">
      <div className="container mx-auto px-4">
        <div className={`flex justify-between items-center mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-3xl font-bold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {t('luxury.title')}
          </h2>
          <Button variant="outline" asChild>
            <Link to="/search" className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {t('luxury.viewAll')}
              <ArrowRightIcon className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : premiumProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No luxury properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
