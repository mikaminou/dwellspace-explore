
import React from "react";
import { MainNav } from "@/components/MainNav";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import HeroSection from "@/components/home/HeroSection";
import LuxuryPropertiesSection from "@/components/home/LuxuryPropertiesSection";
import FeaturedPropertiesSection from "@/components/home/FeaturedPropertiesSection";
import CtaSection from "@/components/home/CtaSection";
import { Property } from "@/api/properties";

interface ErrorDisplayProps {
  error: string;
  mockProperties: Property[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, mockProperties }) => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
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
};
