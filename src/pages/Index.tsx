
import React, { useState, useEffect, Suspense } from "react";
import { MainNav } from "@/components/MainNav";
import HeroSection from "@/components/home/HeroSection";
import LuxuryPropertiesSection from "@/components/home/LuxuryPropertiesSection";
import FeaturedPropertiesSection from "@/components/home/FeaturedPropertiesSection";
import CtaSection from "@/components/home/CtaSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/hooks/useProperties";
import { properties as mockPropertiesData } from "@/data/properties";
import { Property } from "@/api/properties";

// SectionLoader component for better UX
const SectionLoader = () => (
  <div className="py-16">
    <div className="container mx-auto px-4">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted/50 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg bg-muted/30 h-64"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Function to transform mock data to match the API property type
const transformMockProperties = (mockProperties: any[]): Property[] => {
  if (!Array.isArray(mockProperties)) {
    console.error("Mock properties is not an array:", mockProperties);
    return [];
  }
  
  return mockProperties.map(mock => {
    if (!mock) {
      console.error("Null or undefined mock property");
      return null;
    }
    
    try {
      return {
        id: mock.id || Math.random().toString(36).substring(7),
        title: mock.title || "Untitled Property",
        price: mock.price || "$0",
        location: mock.location || "",
        city: mock.city || "",
        beds: mock.beds || 0,
        baths: mock.baths || null,
        postal_code: null,
        living_area: mock.area || null,
        plot_area: null,
        type: mock.type || "house",
        description: mock.description || "",
        year_built: mock.yearBuilt || null,
        features: mock.features || [],
        additional_details: mock.additionalDetails || null,
        featured_image_url: mock.image || "",
        gallery_image_urls: mock.images || [],
        owner_id: "00000000-0000-0000-0000-000000000000", // Default owner ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        listing_type: 'sale',
        // Add compatibility with mock data
        image: mock.image || "",
        images: mock.images || [],
        isPremium: mock.isPremium || false,
        owner: mock.agent ? {
          id: "00000000-0000-0000-0000-000000000000",
          first_name: mock.agent?.name ? mock.agent.name.split(' ')[0] : "",
          last_name: mock.agent?.name ? (mock.agent.name.split(' ')[1] || "") : "",
          avatar_url: mock.agent?.avatar || "",
          email: mock.agent?.email || "",
          phone_number: mock.agent?.phone || "",
          role: mock.agent?.role || "agent",
          bio: "",
          agency: mock.agent?.agency || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } : undefined
      };
    } catch (err) {
      console.error("Error transforming mock property:", err, mock);
      return null;
    }
  }).filter(Boolean) as Property[];
};

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

// Error boundary component for this page
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading the page. {error.message}
            <button
              onClick={resetErrorBoundary}
              className="ml-2 underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export default function Index() {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);
  
  // Setup error handler
  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    const handleError = (err) => {
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
  } catch (err) {
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
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto px-4 py-16">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{hasError}</AlertDescription>
          </Alert>
          
          {/* Fall back to mock data */}
          <div className="my-8 text-center">
            <p>Showing fallback content</p>
          </div>
          
          <HeroSection />
          <LuxuryPropertiesSection properties={mockProperties} loading={false} />
          <FeaturedPropertiesSection properties={mockProperties} loading={false} />
          <CtaSection />
        </div>
      </div>
    );
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
