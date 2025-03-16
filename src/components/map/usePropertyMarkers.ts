
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { toast } from 'sonner';
import { PropertyMarker } from './PropertyMarker';
import ReactDOM from 'react-dom';
import React from 'react';

// Helper function to generate coordinates from location with better error handling
const generateCoordsFromLocation = (location: string, id: string | number): { lat: number; lng: number } | null => {
  try {
    if (!location) {
      console.warn(`No location for property ${id}`);
      return null;
    }
    
    // Default coordinates based on property ID for testing
    // In production, you'd use real geocoding
    const seed = String(id).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const latVariance = (seed % 100) * 0.01;
    const lngVariance = ((seed * 2) % 100) * 0.01;
    
    // Base coordinates (Algiers)
    const baseLat = 36.752887;
    const baseLng = 3.042048;
    
    return {
      lat: baseLat + latVariance - 0.5,
      lng: baseLng + lngVariance - 0.5
    };
  } catch (error) {
    console.error(`Error generating coordinates for property ${id}:`, error);
    return null;
  }
};

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
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  
  // Add cleanup flag to prevent memory leaks
  const isMountedRef = useRef(true);
  
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

  // Update marker z-index based on active state
  const updateMarkerZIndex = (propertyId: number | null) => {
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
      
      // Create bounds manually since we're getting errors
      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
      let propertiesWithCoords = 0;
      let missingCoords = 0;

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
          minLat = Math.min(minLat, coords.lat);
          maxLat = Math.max(maxLat, coords.lat);
          minLng = Math.min(minLng, coords.lng);
          maxLng = Math.max(maxLng, coords.lng);
          
          propertiesWithCoords++;

          const markerEl = document.createElement('div');
          markerEl.className = 'custom-marker-container';
          
          const marker = new mapboxgl.Marker({
            element: markerEl,
            anchor: 'bottom',
            offset: [0, 0],
            clickTolerance: 10
          })
            .setLngLat([coords.lng, coords.lat])
            .addTo(map.current!);

          // Render React component for the marker
          try {
            const markerContainer = document.createElement('div');
            markerEl.appendChild(markerContainer);
            
            ReactDOM.render(
              React.createElement(PropertyMarker, { 
                price: property.price || 'N/A',
                onClick: () => {
                  onMarkerClick(property, [coords.lng, coords.lat]);
                }
              }),
              markerContainer
            );
          } catch (renderError) {
            console.error(`Error rendering React marker for property ${property.id}:`, renderError);
            
            // Fallback to simple HTML marker
            const priceElement = document.createElement('div');
            priceElement.className = 'bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
            priceElement.innerText = property.price || 'N/A';
            markerEl.appendChild(priceElement);
            
            priceElement.addEventListener('click', () => {
              onMarkerClick(property, [coords.lng, coords.lat]);
            });
          }

          markersRef.current[property.id] = marker;
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      if (propertiesWithCoords > 0) {
        try {
          console.log('Fitting map to bounds with', propertiesWithCoords, 'properties');
          
          // Only fit bounds if we have valid min/max values
          if (minLat <= maxLat && minLng <= maxLng) {
            map.current.fitBounds([
              [minLng, minLat], // Southwest corner
              [maxLng, maxLat]  // Northeast corner
            ], {
              padding: 50,
              maxZoom: 15
            });
          } else {
            console.warn('Invalid bounds calculated, using default view');
            map.current.setCenter([3.042048, 36.752887]);
            map.current.setZoom(12);
          }
        } catch (fitError) {
          console.error('Error fitting map to bounds:', fitError);
          // Try to center map on default location as fallback
          try {
            map.current.setCenter([3.042048, 36.752887]);
            map.current.setZoom(12);
          } catch (e) {
            console.error('Error setting default map center:', e);
          }
        }
      } else {
        console.warn('No properties with valid coordinates found');
        try {
          map.current.setCenter([3.042048, 36.752887]);
          map.current.setZoom(12);
        } catch (e) {
          console.error('Error setting default map center:', e);
        }
      }

      if (missingCoords > 0) {
        console.warn(`${missingCoords} properties are missing valid coordinates`);
        toast.warning(`${missingCoords} properties couldn't be displayed on the map`);
      }
    } catch (error) {
      console.error('Error updating property markers:', error);
      toast.error('Error displaying properties on map');
    }
  }, [properties, mapLoaded, loading, onMarkerClick, map]);

  return {
    markersRef,
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
