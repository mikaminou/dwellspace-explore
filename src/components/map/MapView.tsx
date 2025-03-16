
import React, { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapViewContent } from './MapViewContent';
import { CriticalErrorFallback } from './fallbacks/MapFallbackStates';

function MapView() {
  console.log('[MapView] Rendering MapView component');
  
  // Error boundary state
  const [criticalError, setCriticalError] = useState<Error | null>(null);

  // Debug logging for the MapView component lifecycle
  useEffect(() => {
    console.log('[MapView] MapView component mounted');
    
    // Log Mapbox GL availability
    console.log('[MapView] mapboxgl available:', !!window.mapboxgl);
    if (window.mapboxgl) {
      console.log('[MapView] mapboxgl version:', window.mapboxgl.version);
    }
    
    // Log any mapboxgl token if present
    if (window.mapboxgl && window.mapboxgl.accessToken) {
      console.log('[MapView] mapboxgl token is set:', window.mapboxgl.accessToken.substring(0, 10) + '...');
    } else {
      console.log('[MapView] No mapboxgl token is set');
    }
    
    // Debug DOM elements
    setTimeout(() => {
      const mapContainer = document.querySelector('.mapboxgl-map');
      console.log('[MapView] Mapbox container element exists:', !!mapContainer);
      
      const markers = document.querySelectorAll('.mapboxgl-marker');
      console.log('[MapView] Number of marker elements in DOM:', markers.length);
      
      // Log viewport dimensions
      console.log('[MapView] Window dimensions:', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 2000);
    
    return () => {
      console.log('[MapView] MapView component unmounting');
    };
  }, []);

  // Catch any errors from child components
  try {
    return <MapViewContent />;
  } catch (error) {
    console.error("[MapView] Critical error in MapView:", error);
    return (
      <CriticalErrorFallback 
        error={error instanceof Error ? error : String(error)} 
        onRetry={() => window.location.reload()} 
      />
    );
  }
}

export default MapView;
