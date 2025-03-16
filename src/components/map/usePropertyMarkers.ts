
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { generateCoordsFromLocation } from './mapUtils';
import { toast } from 'sonner';

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
      const bounds = new mapboxgl.LngLatBounds();
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

          bounds.extend([coords.lng, coords.lat]);
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

          const priceElement = document.createElement('div');
          priceElement.className = 'price-bubble bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
          priceElement.innerText = property.price || 'No price';
          markerEl.appendChild(priceElement);

          // Add city name as data attribute for debugging
          const cityMatch = property.location.match(/,\s*([^,]+)$/);
          if (cityMatch && cityMatch[1]) {
            priceElement.setAttribute('data-city', cityMatch[1].trim());
          }

          priceElement.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Delay the click handler slightly for stability
            setTimeout(() => {
              try {
                onMarkerClick(property, [coords.lng, coords.lat]);
              } catch (clickError) {
                console.error('Error in marker click handler:', clickError);
              }
            }, 10);
          });

          markersRef.current[property.id] = marker;
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      if (propertiesWithCoords > 0) {
        try {
          console.log('Fitting map to bounds with', propertiesWithCoords, 'properties');
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        } catch (fitError) {
          console.error('Error fitting map to bounds:', fitError);
        }
      } else {
        console.warn('No properties with valid coordinates found');
      }

      if (missingCoords > 0) {
        console.warn(`${missingCoords} properties are missing valid coordinates`);
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
