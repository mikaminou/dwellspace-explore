
import React, { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { MapView } from "@/components/map/MapView";
import { MapFilters } from "@/components/map/MapFilters";
import { SearchProvider } from "@/contexts/search/SearchContext";
import { Filters } from "@/components/search/Filters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Map() {
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to get the API key from localStorage if available
    return localStorage.getItem('google_maps_api_key') || '';
  });
  
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [apiKeySet, setApiKeySet] = useState(!!apiKey);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempApiKey.trim()) {
      toast.error("Please enter a valid Google Maps API key");
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('google_maps_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setApiKeySet(true);
    toast.success("Google Maps API key set successfully");
    
    // Reload the page to apply the new API key
    window.location.reload();
  };
  
  return (
    <SearchProvider>
      <div className="min-h-screen bg-background">
        <MainNav />
        
        {!apiKeySet ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Google Maps API Key Required</h2>
              <p className="text-muted-foreground mb-4">
                To use the map functionality, please enter your Google Maps API key. 
                You can get one from the <a href="https://console.cloud.google.com/google/maps-apis" 
                  className="text-primary underline" 
                  target="_blank" 
                  rel="noopener noreferrer">
                  Google Cloud Console
                </a>.
              </p>
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <Input 
                  type="text"
                  placeholder="Enter your Google Maps API key"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Save API Key
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            <MapFilters />
            <Filters />
            <MapView />
          </div>
        )}
      </div>
    </SearchProvider>
  );
}
