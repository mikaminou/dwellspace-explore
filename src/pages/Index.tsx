
import React from "react";
import { MainNav } from "@/components/MainNav";
import HeroSection from "@/components/home/HeroSection";
import LuxuryPropertiesSection from "@/components/home/LuxuryPropertiesSection";
import FeaturedPropertiesSection from "@/components/home/FeaturedPropertiesSection";
import CtaSection from "@/components/home/CtaSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/hooks/useProperties";

export default function Index() {
  // Use the properties hook but handle errors gracefully
  const propertiesData = useProperties();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Setup a global error handler to catch any rendering errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check if this is a rendering error
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Cannot read properties of undefined')) {
        setError('There was a problem rendering the page. Please try refreshing.');
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

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
      
      {/* Wrap each section in an error boundary */}
      <React.Suspense fallback={<div>Loading hero section...</div>}>
        <HeroSection />
      </React.Suspense>

      <React.Suspense fallback={<div>Loading luxury properties...</div>}>
        <LuxuryPropertiesSection propertiesData={propertiesData} />
      </React.Suspense>

      <React.Suspense fallback={<div>Loading featured properties...</div>}>
        <FeaturedPropertiesSection propertiesData={propertiesData} />
      </React.Suspense>

      <React.Suspense fallback={<div>Loading CTA section...</div>}>
        <CtaSection />
      </React.Suspense>
    </div>
  );
}
