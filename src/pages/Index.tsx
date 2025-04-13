import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { MainNav } from "@/components/MainNav";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/api/properties";
import { HeroSection } from "@/components/index/HeroSection";
import { LuxuryProperties } from "@/components/index/LuxuryProperties";
import { FeaturedProperties } from "@/components/index/FeaturedProperties";
import { CTASection } from "@/components/index/CTASection";
import { Footer } from "@/components/index/Footer";

export default function Index() {
  const { properties, loading, error } = useProperties();
  
  const allProperties = properties;
  
  const premiumProperties = allProperties.filter((p: Property) => 
    (p.isPremium === true) || 
    (p.owner && p.owner.role === 'seller')
  ).slice(0, 3);

  const featuredProperties = allProperties
    .filter((p: Property) => !premiumProperties.some(pp => pp.id === p.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />
      
      <main className="flex-grow">
        <HeroSection />
        <LuxuryProperties properties={premiumProperties} loading={loading} error={error} />
        <FeaturedProperties properties={featuredProperties} loading={loading} error={error} />
        <CTASection />
      </main>

      <Footer />

      <Toaster />
    </div>
  );
}