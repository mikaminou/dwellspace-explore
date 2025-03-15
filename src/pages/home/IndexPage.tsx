
import React, { useState, useEffect, Suspense } from "react";
import { MainNav } from "@/components/MainNav";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/hooks/useProperties";
import { properties as mockPropertiesData } from "@/data/properties";
import { Property } from "@/api/properties";
import { SectionLoader } from "./components/SectionLoader";
import { ErrorDisplay } from "./components/ErrorDisplay";
import HeroSection from "@/components/home/HeroSection";
import LuxuryPropertiesSection from "@/components/home/LuxuryPropertiesSection";
import FeaturedPropertiesSection from "@/components/home/FeaturedPropertiesSection";
import CtaSection from "@/components/home/CtaSection";
import { transformMockProperties } from "./utils/propertyTransformer";

// Transform mock properties to match API type with better error handling
let mockProperties: Property[] = [];
try {
  if (Array.isArray(mockPropertiesData)) {
    mockProperties = transformMockProperties(mockPropertiesData);
  } else {
    console.error("mockPropertiesData is not an array");
  }
} catch (err) {
  console.error("Failed to transform mock properties:", err);
}

export default function IndexPage() {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  
  // Setup error handler
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    const handleError = (err: any) => {
      console.error("Index page error:", err);
      setHasError(err.message || "Unknown error occurred");
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // Use the hook with error handling
  let properties: Property[] = [];
  let loading = true;
  let propertiesError = null;
  
  try {
    const result = useProperties();
    properties = result?.properties || [];
    loading = result?.loading || false;
    propertiesError = result?.error || null;
  } catch (err: any) {
    console.error("Error using useProperties hook:", err);
    propertiesError = err;
  }
  
  // Set error from properties hook
  useEffect(() => {
    if (propertiesError) {
      console.error("Properties error:", propertiesError);
      setHasError("There was a problem loading properties. Using fallback data.");
    }
  }, [propertiesError]);

  // Ensure we have data to display even if the API fails
  const safeProperties: Property[] = (Array.isArray(properties) && properties.length > 0)
    ? properties 
    : mockProperties;
    
  // Handle critical errors
  if (hasError) {
    return <ErrorDisplay error={hasError} mockProperties={mockProperties} />;
  }

  // Prevent hydration mismatch by not rendering on server
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Main content with guaranteed fallbacks */}
      <Suspense fallback={<SectionLoader />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <LuxuryPropertiesSection properties={safeProperties} loading={loading} />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <FeaturedPropertiesSection properties={safeProperties} loading={loading} />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CtaSection />
      </Suspense>
    </div>
  );
}
