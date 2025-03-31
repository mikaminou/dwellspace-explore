
import React from "react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";

export function FeaturedProperties() {
  const { properties, isLoading, error } = useProperties({ limit: 6, featured: true });

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Properties</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-accent/20 rounded-lg h-[350px] animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load properties</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <a href="/search" className="text-primary font-medium hover:underline">
            View all properties →
          </a>
        </div>
      </div>
    </section>
  );
}
