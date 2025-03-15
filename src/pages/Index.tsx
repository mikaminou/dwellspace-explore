
import React, { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import HeroSection from "@/components/home/HeroSection";
import LuxuryPropertiesSection from "@/components/home/LuxuryPropertiesSection";
import FeaturedPropertiesSection from "@/components/home/FeaturedPropertiesSection";
import CtaSection from "@/components/home/CtaSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/hooks/useProperties";
import { properties as mockProperties } from "@/data/properties";

export default function Index() {
  const {
    properties = [],
    loading = false,
    error: propertiesError = null
  } = useProperties() || {};
  
  const [error, setError] = useState<string | null>(null);

  // Ensure we have data to display even if the API fails
  const safeProperties = properties && properties.length > 0 
    ? properties 
    : mockProperties;

  useEffect(() => {
    // Handle any existing property errors
    if (propertiesError) {
      console.error("Properties error:", propertiesError);
      setError("There was a problem loading properties. Using fallback data.");
    }
  }, [propertiesError]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Main content with guaranteed fallbacks */}
      <HeroSection />
      
      <LuxuryPropertiesSection properties={safeProperties} loading={loading} />
      
      <FeaturedPropertiesSection properties={safeProperties} loading={loading} />
      
      <CtaSection />
    </div>
  );
}
