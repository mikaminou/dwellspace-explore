
import React, { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import HeroSection from "@/components/home/HeroSection";
import LuxuryPropertiesSection from "@/components/home/LuxuryPropertiesSection";
import FeaturedPropertiesSection from "@/components/home/FeaturedPropertiesSection";
import CtaSection from "@/components/home/CtaSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/hooks/useProperties";
import { properties as mockPropertiesData } from "@/data/properties";
import { Property } from "@/api/properties";

// Function to transform mock data to match the API property type
const transformMockProperties = (mockProperties: any[]): Property[] => {
  return mockProperties.map(mock => ({
    id: mock.id,
    title: mock.title,
    price: mock.price,
    location: mock.location,
    city: mock.city,
    beds: mock.beds,
    baths: mock.baths || null,
    postal_code: null,
    living_area: mock.area || null,
    plot_area: null,
    type: mock.type,
    description: mock.description,
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
      first_name: mock.agent.name.split(' ')[0],
      last_name: mock.agent.name.split(' ')[1] || "",
      avatar_url: mock.agent.avatar,
      email: mock.agent.email || "",
      phone_number: mock.agent.phone || "",
      role: mock.agent.role || "agent",
      bio: "",
      agency: mock.agent.agency || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } : undefined
  }));
};

// Transform mock properties to match API type
const mockProperties: Property[] = transformMockProperties(mockPropertiesData);

export default function Index() {
  const {
    properties = [],
    loading = false,
    error: propertiesError = null
  } = useProperties() || {};
  
  const [error, setError] = useState<string | null>(null);

  // Ensure we have data to display even if the API fails
  const safeProperties: Property[] = properties && properties.length > 0 
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
