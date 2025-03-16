
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import mapboxgl from 'mapbox-gl';

interface MapTokenInputProps {
  onTokenSet: () => void;
  isVisible: boolean;
}

export function MapTokenInput({ onTokenSet, isVisible }: MapTokenInputProps) {
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setToken(savedToken);
      mapboxgl.accessToken = savedToken;
      onTokenSet();
    }
  }, [onTokenSet]);

  const handleSetToken = () => {
    if (!token.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Set token for mapboxgl
      mapboxgl.accessToken = token;
      
      // Save to localStorage for persistence
      localStorage.setItem('mapbox_token', token);
      
      // Notify parent component
      onTokenSet();
    } catch (error) {
      console.error('Error setting Mapbox token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-background/95 p-6 rounded-lg shadow-lg z-50 max-w-md w-full mx-auto">
      <h3 className="text-xl font-medium mb-4">Mapbox Token Required</h3>
      <p className="text-muted-foreground mb-4">
        Please enter your Mapbox public token to enable the map. You can find this in your Mapbox account dashboard.
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="mapbox-token" className="text-sm font-medium mb-1 block">
            Mapbox Public Token
          </label>
          <Input
            id="mapbox-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="pk.eyJ1Ijoi..."
            className="w-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <a 
            href="https://account.mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline"
          >
            Get a token from Mapbox
          </a>
          <Button 
            onClick={handleSetToken} 
            disabled={!token.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Setting...
              </>
            ) : "Set Token"}
          </Button>
        </div>
      </div>
    </div>
  );
}
