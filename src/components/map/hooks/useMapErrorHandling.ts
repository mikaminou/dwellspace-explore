
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useMapErrorHandling(mapError: Error | null, mapboxAvailable: boolean) {
  const [mapInitError, setMapInitError] = useState<Error | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Show error if map failed to load or Mapbox is not available
  useEffect(() => {
    if (!mapboxAvailable) {
      console.error("Mapbox GL JS is not available");
      setMapInitError(new Error("Mapbox GL JS is not available. Please check your internet connection or try a different browser."));
      return;
    }
    
    if (mapError) {
      console.error("Map error:", mapError);
      setMapInitError(mapError);
      
      // Check if it's a token-related error
      if (mapError.message.includes('token') || mapError.message.includes('access') || 
          mapError.message.includes('401') || mapError.message.includes('unauthorized')) {
        setShowTokenInput(true);
      } else {
        toast.error("Failed to load map: " + mapError.message);
      }
    }
  }, [mapError, mapboxAvailable]);

  const handleTokenSet = () => {
    setShowTokenInput(false);
    window.location.reload(); // Reload to reinitialize map with new token
  };

  const handleRetry = () => {
    setRetryAttempts(prev => prev + 1);
    setMapInitError(null);
    setShowTokenInput(false);
    
    // Force reload of mapbox scripts
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.async = true;
    script.onload = () => {
      console.log('Mapbox script reloaded');
      window.location.reload();
    };
    document.head.appendChild(script);
  };

  return {
    mapInitError,
    showTokenInput,
    retryAttempts,
    handleTokenSet,
    handleRetry
  };
}
