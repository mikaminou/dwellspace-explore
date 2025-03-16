
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, ExternalLink } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MapTokenInputProps {
  onTokenSet: () => void;
  isVisible: boolean;
}

export function MapTokenInput({ onTokenSet, isVisible }: MapTokenInputProps) {
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const validateToken = (inputToken: string): boolean => {
    if (!inputToken.trim()) {
      setValidationError('Token cannot be empty');
      return false;
    }
    
    if (!inputToken.startsWith('pk.')) {
      setValidationError('Token must start with "pk." (public key)');
      return false;
    }
    
    if (inputToken.length < 20) {
      setValidationError('Token appears to be too short');
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const handleSetToken = () => {
    if (!validateToken(token)) return;
    
    setIsLoading(true);
    
    try {
      // Set token for mapboxgl
      mapboxgl.accessToken = token;
      
      // Save to localStorage for persistence
      localStorage.setItem('mapbox_token', token);
      
      // Notify parent component
      setTimeout(() => {
        setIsLoading(false);
        onTokenSet();
      }, 1000);
    } catch (error) {
      console.error('Error setting Mapbox token:', error);
      setValidationError('Failed to set token: ' + (error instanceof Error ? error.message : String(error)));
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
      
      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Invalid Token</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="mapbox-token" className="text-sm font-medium mb-1 block">
            Mapbox Public Token
          </label>
          <Input
            id="mapbox-token"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              if (validationError) validateToken(e.target.value);
            }}
            placeholder="pk.eyJ1Ijoi..."
            className="w-full font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tokens always start with "pk." followed by a series of letters and numbers
          </p>
        </div>
        <div className="flex justify-between items-center">
          <a 
            href="https://account.mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline flex items-center"
          >
            Get a token from Mapbox
            <ExternalLink className="ml-1 h-3 w-3" />
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
