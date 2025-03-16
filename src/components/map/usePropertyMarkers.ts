
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
  console.log('usePropertyMarkers hook called');
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
        console.error('Error cleaning up markers:', e);
      }
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    console.log('usePropertyMarkers effect running');
    console.log('Map exists:', !!map.current);
    console.log('Map loaded:', mapLoaded);
    console.log('Loading state:', loading);
    console.log('Properties count:', properties?.length || 0);
    
    if (!map.current || !mapLoaded || loading) {
      console.log('Skipping marker update - conditions not met');
      return;
    }
    
    try {
      // Remove existing markers
      console.log('Removing existing markers:', Object.keys(markersRef.current).length);
      Object.values(markersRef.current).forEach(marker => {
        if (marker && typeof marker.remove === 'function') {
          try {
            marker.remove();
          } catch (e) {
            console.error('Error removing marker:', e);
          }
        }
      });
      markersRef.current = {};

      if (!properties || properties.length === 0) {
        console.log('No properties to display markers for');
        return;
      }

      console.log('Creating markers for', properties.length, 'properties');
      
      // Initialize bounds and counters
      let bounds = initBounds();
      let propertiesWithCoords = 0;
      let missingCoords = 0;

      // Create markers for each property
      properties.forEach(property => {
        if (!property || !property.location) {
          console.warn(`Property ${property?.id} has no location information`);
          return;
        }

        try {
          const coords = generateCoordsFromLocation(property.location, property.id);
          if (!coords) {
            console.warn(`Could not generate coordinates for property ${property.id} at location "${property.location}"`);
            missingCoords++;
            return;
          }

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
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      // Handle map positioning
      if (propertiesWithCoords > 0) {
        fitMapToBounds(map.current, bounds, propertiesWithCoords);
      } else {
        console.warn('No properties with valid coordinates found');
        setDefaultMapView(map.current);
      }

      // Show warnings for missing coordinates
      if (missingCoords > 0) {
        console.warn(`${missingCoords} properties are missing valid coordinates`);
        toast.warning(`${missingCoords} properties couldn't be displayed on the map`);
      }
    } catch (error) {
      console.error('Error updating property markers:', error);
      toast.error('Error displaying properties on map');
    }
  }, [properties, mapLoaded, loading, onMarkerClick, map, fitMapToBounds, setDefaultMapView, initBounds, updateBounds]);

  return {
    markersRef,
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
