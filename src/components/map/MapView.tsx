
import React, { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/styles/map.css'; // Ensure map styles are imported
import { MapViewContent } from './MapViewContent';
import { CriticalErrorFallback } from './fallbacks/MapFallbackStates';

function MapView() {
  // Error boundary state
  const [criticalError, setCriticalError] = useState<Error | null>(null);

  // Ensure styles are loaded
  useEffect(() => {
    // Add mapbox CSS if not already present
    if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(link);
    }
  }, []);

  // Catch any errors from child components
  try {
    return <MapViewContent />;
  } catch (error) {
    console.error("Critical error in MapView:", error);
    return (
      <CriticalErrorFallback 
        error={error instanceof Error ? error : String(error)} 
        onRetry={() => window.location.reload()} 
      />
    );
  }
}

export default MapView;
