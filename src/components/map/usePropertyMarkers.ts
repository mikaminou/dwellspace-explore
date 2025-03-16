
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { toast } from 'sonner';
import { generateCoordsFromLocation } from './utils/coordinateUtils';
import { renderPropertyMarker } from './MarkerRenderer';
import { useMarkerZIndex } from './hooks/useMarkerZIndex';
import { useMapBounds } from './hooks/useMapBounds';

export function usePropertyMarkers({
  map,
  properties,
  mapLoaded,
  loading,
  onMarkerClick
}: {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  properties: Property[];
  mapLoaded: boolean;
  loading: boolean;
  onMarkerClick: (property: Property, coordinates: [number, number]) => void;
}) {
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  
  // Get marker z-index management
  const { activeMarkerId, setActiveMarkerId, updateMarkerZIndex: updateZIndex } = useMarkerZIndex();
  
  // Get map bounds utilities
  const { initBounds, updateBounds, fitMapToBounds, setDefaultMapView } = useMapBounds();
  
  // Add cleanup flag to prevent memory leaks
  const isMountedRef = useRef(true);
  
  // Wrapper for updateZIndex that uses our markersRef
  const updateMarkerZIndex = (propertyId: number | null) => {
    updateZIndex(propertyId, markersRef);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Remove all markers on unmount
      try {
        Object.values(markersRef.current).forEach(marker => {
          if (marker && typeof marker.remove === 'function') {
            marker.remove();
          }
        });
        markersRef.current = {};
      } catch (e) {
        console.error('[usePropertyMarkers] Error cleaning up markers:', e);
      }
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    console.log(`[usePropertyMarkers] Properties or map changed. Properties: ${properties.length}, Map loaded: ${mapLoaded}, Loading: ${loading}`);
    
    if (!map.current || !mapLoaded || loading) {
      console.log('[usePropertyMarkers] Map not ready or loading. Skipping marker creation.');
      return;
    }
    
    try {
      console.log(`[usePropertyMarkers] Creating markers for ${properties.length} properties...`);
      console.log('[usePropertyMarkers] Map center:', map.current.getCenter());
      console.log('[usePropertyMarkers] Map zoom:', map.current.getZoom());
      
      // Remove existing markers
      Object.values(markersRef.current).forEach(marker => {
        if (marker && typeof marker.remove === 'function') {
          try {
            marker.remove();
          } catch (e) {
            console.error('[usePropertyMarkers] Error removing marker:', e);
          }
        }
      });
      markersRef.current = {};

      if (!properties || properties.length === 0) {
        console.log('[usePropertyMarkers] No properties to display on map');
        return;
      }

      // Initialize bounds and counters
      let bounds = initBounds();
      let propertiesWithCoords = 0;
      let missingCoords = 0;

      // Create markers for each property
      properties.forEach(property => {
        if (!property || !property.id) {
          console.warn('[usePropertyMarkers] Invalid property data:', property);
          return;
        }

        try {
          const coords = generateCoordsFromLocation(property.location || 'Algiers', property.id);
          if (!coords) {
            missingCoords++;
            console.warn(`[usePropertyMarkers] Missing coordinates for property ${property.id}`);
            return;
          }

          console.log(`[usePropertyMarkers] Creating marker for property ID ${property.id} at coordinates: lat=${coords.lat}, lng=${coords.lng}`);
          
          // Update bounds
          bounds = updateBounds(bounds, coords.lat, coords.lng);
          propertiesWithCoords++;

          // Create and add marker
          const marker = renderPropertyMarker(
            { 
              property, 
              coordinates: coords, 
              onMarkerClick 
            },
            map.current!
          );

          markersRef.current[property.id] = marker;
          console.log(`[usePropertyMarkers] Marker for property ${property.id} added to markersRef`);
          
          // Debug: Get marker element
          const markerEl = marker.getElement();
          console.log(`[usePropertyMarkers] Marker element for property ${property.id}:`, markerEl);
          
          // Check for marker element after a delay (in case of async rendering issues)
          setTimeout(() => {
            try {
              const markerElDelayed = marker.getElement();
              console.log(`[usePropertyMarkers] Marker element for property ${property.id} after 1s:`, markerElDelayed);
              
              // Check computed styles
              if (markerElDelayed) {
                const computedStyle = window.getComputedStyle(markerElDelayed);
                console.log(`[usePropertyMarkers] Marker computed style for property ${property.id}:`, {
                  display: computedStyle.display,
                  visibility: computedStyle.visibility,
                  zIndex: computedStyle.zIndex,
                  position: computedStyle.position,
                  opacity: computedStyle.opacity
                });
              }
            } catch (e) {
              console.error(`[usePropertyMarkers] Error checking delayed marker for property ${property.id}:`, e);
            }
          }, 1000);
        } catch (markerError) {
          console.error(`[usePropertyMarkers] Error creating marker for property ${property.id}:`, markerError);
        }
      });

      // Handle map positioning
      if (propertiesWithCoords > 0) {
        console.log(`[usePropertyMarkers] Fitting map to bounds with ${propertiesWithCoords} properties`);
        fitMapToBounds(map.current, bounds, propertiesWithCoords);
        
        // Log visible map area after fitting bounds
        setTimeout(() => {
          if (map.current) {
            console.log('[usePropertyMarkers] Map center after fit:', map.current.getCenter());
            console.log('[usePropertyMarkers] Map zoom after fit:', map.current.getZoom());
            console.log('[usePropertyMarkers] Map bounds after fit:', map.current.getBounds());
          }
        }, 1000);
      } else {
        console.log('[usePropertyMarkers] No valid coordinates, using default map view');
        setDefaultMapView(map.current);
      }

      // Show warnings for missing coordinates
      if (missingCoords > 0 && isMountedRef.current) {
        toast.warning(`${missingCoords} properties couldn't be displayed on the map`);
      }
      
      // Log all markers after everything is done
      setTimeout(() => {
        console.log(`[usePropertyMarkers] Total markers created: ${Object.keys(markersRef.current).length}`);
        
        // Debug: check for visible marker elements in the DOM
        const markerElements = document.querySelectorAll('.mapboxgl-marker');
        console.log(`[usePropertyMarkers] Total mapboxgl-marker elements in DOM: ${markerElements.length}`);
        
        const customMarkerElements = document.querySelectorAll('.custom-marker-container');
        console.log(`[usePropertyMarkers] Total custom-marker-container elements in DOM: ${customMarkerElements.length}`);
        
        const priceElements = document.querySelectorAll('.price-bubble');
        console.log(`[usePropertyMarkers] Total price-bubble elements in DOM: ${priceElements.length}`);
      }, 2000);
    } catch (error) {
      console.error('[usePropertyMarkers] Error updating property markers:', error);
      if (isMountedRef.current) {
        toast.error('Error displaying properties on map');
      }
    }
  }, [properties, mapLoaded, loading, onMarkerClick, map, fitMapToBounds, setDefaultMapView, initBounds, updateBounds]);

  return {
    markersRef,
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
