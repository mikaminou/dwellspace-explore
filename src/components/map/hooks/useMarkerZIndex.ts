
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

export function useMarkerZIndex() {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  // Update marker z-index based on active state
  const updateMarkerZIndex = (
    propertyId: number | null, 
    markersRef: React.MutableRefObject<{ [key: number]: mapboxgl.Marker }>
  ) => {
    try {
      // Reset all markers to default z-index
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        if (marker) {
          const markerEl = marker.getElement();
          if (markerEl) {
            markerEl.style.zIndex = '1';
          }
        }
      });

      // Set the active marker to higher z-index
      if (propertyId !== null && markersRef.current[propertyId]) {
        const activeMarker = markersRef.current[propertyId];
        if (activeMarker) {
          const activeMarkerEl = activeMarker.getElement();
          if (activeMarkerEl) {
            activeMarkerEl.style.zIndex = '3';
          }
        }
      }
    } catch (error) {
      console.error('Error updating marker z-index:', error);
    }
  };

  return {
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
