
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
    
    // Add repeated checking for marker visibility (to fix potential timing issues)
    const checkMarkers = () => {
      const mapContainer = document.querySelector('.mapboxgl-map');
      console.log('[MapView] Mapbox container element exists:', !!mapContainer);
      
      // Force mapboxgl-markers container to be visible if it exists
      const markersContainer = document.querySelector('.mapboxgl-markers');
      if (markersContainer instanceof HTMLElement) {
        markersContainer.style.display = 'block';
        markersContainer.style.visibility = 'visible';
        markersContainer.style.opacity = '1';
        markersContainer.style.zIndex = '99999';
        console.log('[MapView] Applied visibility fixes to mapboxgl-markers container');
      }
      
      const markers = document.querySelectorAll('.mapboxgl-marker');
      console.log('[MapView] Number of marker elements in DOM:', markers.length);
      
      if (markers.length > 0) {
        console.log('[MapView] Force-fixing all markers...');
        markers.forEach((marker, index) => {
          if (marker instanceof HTMLElement) {
            // Force every marker to be visible
            marker.style.display = 'block';
            marker.style.visibility = 'visible';
            marker.style.opacity = '1';
            marker.style.zIndex = '99999';
            marker.style.transform = 'scale(2.0)';
            
            const rect = marker.getBoundingClientRect();
            console.log(`[MapView] Marker ${index} position:`, {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              display: window.getComputedStyle(marker).display,
              visibility: window.getComputedStyle(marker).visibility,
              opacity: window.getComputedStyle(marker).opacity,
              zIndex: window.getComputedStyle(marker).zIndex
            });
            
            // Check if the marker is in the viewport
            const isInViewport = (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= window.innerHeight &&
              rect.right <= window.innerWidth
            );
            console.log(`[MapView] Marker ${index} in viewport:`, isInViewport);
          }
        });
      }
      
      const customMarkers = document.querySelectorAll('.custom-marker-container');
      console.log('[MapView] Number of custom marker containers:', customMarkers.length);
      
      if (customMarkers.length > 0) {
        customMarkers.forEach((marker, index) => {
          if (marker instanceof HTMLElement) {
            // Force every custom marker to be visible
            marker.style.display = 'block';
            marker.style.visibility = 'visible';
            marker.style.opacity = '1';
            marker.style.zIndex = '99999';
            
            const rect = marker.getBoundingClientRect();
            console.log(`[MapView] Custom marker ${index} position:`, {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height
            });
          }
        });
      }
      
      const priceBubbles = document.querySelectorAll('.price-bubble');
      console.log('[MapView] Number of price bubbles:', priceBubbles.length);
      
      if (priceBubbles.length > 0) {
        priceBubbles.forEach((bubble, index) => {
          if (bubble instanceof HTMLElement) {
            // Force every price bubble to be visible
            bubble.style.display = 'inline-flex';
            bubble.style.visibility = 'visible';
            bubble.style.opacity = '1';
            bubble.style.zIndex = '99999';
            bubble.style.backgroundColor = 'red';
            bubble.style.transform = 'scale(2.0)';
            bubble.style.border = '4px solid white';
            
            const rect = bubble.getBoundingClientRect();
            console.log(`[MapView] Price bubble ${index} position:`, {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height
            });
          }
        });
      }
      
      // Log viewport dimensions
      console.log('[MapView] Window dimensions:', {
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Get the map center and bounds if available
      const mapInstance = document.querySelector('.mapboxgl-map') as any;
      if (mapInstance && mapInstance._mapboxgl && mapInstance._mapboxgl.getCenter) {
        try {
          const center = mapInstance._mapboxgl.getCenter();
          const bounds = mapInstance._mapboxgl.getBounds();
          const zoom = mapInstance._mapboxgl.getZoom();
          
          console.log('[MapView] Map state:', { center, bounds, zoom });
        } catch (e) {
          console.error('[MapView] Error getting map state:', e);
        }
      }
    };
    
    // Perform the marker visibility check multiple times with increasing delays
    setTimeout(checkMarkers, 1000);
    setTimeout(checkMarkers, 3000);
    setTimeout(checkMarkers, 5000);
    setTimeout(checkMarkers, 10000);
    
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
