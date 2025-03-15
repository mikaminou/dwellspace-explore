
import { useEffect, useRef, useState, useCallback } from 'react';
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
  const markerClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update marker z-index based on active state - implemented as a memoized function
  const updateMarkerZIndex = useCallback((propertyId: number | null) => {
    try {
      // Reset all markers to default z-index and appearance
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const markerEl = marker.getElement();
        markerEl.style.zIndex = '1';
        
        // Reset appearance
        const priceBubble = markerEl.querySelector('.price-bubble');
        if (priceBubble) {
          priceBubble.classList.remove('bg-primary-dark', 'scale-110');
          priceBubble.classList.add('bg-primary');
        }
      });

      // Set the active marker to higher z-index and highlight it
      if (propertyId !== null && markersRef.current[propertyId]) {
        const activeMarkerEl = markersRef.current[propertyId].getElement();
        activeMarkerEl.style.zIndex = '3';
        
        // Highlight the active marker
        const activePriceBubble = activeMarkerEl.querySelector('.price-bubble');
        if (activePriceBubble) {
          activePriceBubble.classList.remove('bg-primary');
          activePriceBubble.classList.add('bg-primary-dark', 'scale-110');
        }
      }
    } catch (error) {
      console.error('Error updating marker z-index:', error);
    }
  }, []);

  // Handle marker click with debounce to prevent multiple triggers
  const handleMarkerClick = useCallback((property: Property, coordinates: [number, number]) => {
    // Clear any pending click timeout
    if (markerClickTimeoutRef.current) {
      clearTimeout(markerClickTimeoutRef.current);
    }
    
    // Debounce clicks to prevent double-firing
    markerClickTimeoutRef.current = setTimeout(() => {
      onMarkerClick(property, coordinates);
    }, 50);
  }, [onMarkerClick]);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Cleanup function for markers
    const cleanupMarkers = () => {
      // Clear any pending click timeout
      if (markerClickTimeoutRef.current) {
        clearTimeout(markerClickTimeoutRef.current);
        markerClickTimeoutRef.current = null;
      }
      
      // Remove existing markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
    };
    
    try {
      // Clean up existing markers
      cleanupMarkers();

      if (properties.length === 0) return;

      const bounds = new mapboxgl.LngLatBounds();
      let propertiesWithCoords = 0;

      // Create new markers for each property
      properties.forEach(property => {
        if (!property.location) return;

        try {
          const coords = generateCoordsFromLocation(property.location, property.id);
          if (!coords) return;

          bounds.extend([coords.lng, coords.lat]);
          propertiesWithCoords++;

          // Create DOM element for marker
          const markerEl = document.createElement('div');
          markerEl.className = 'custom-marker-container';
          
          // Create new marker
          const marker = new mapboxgl.Marker({
            element: markerEl,
            anchor: 'bottom',
            offset: [0, 0],
            clickTolerance: 10
          })
            .setLngLat([coords.lng, coords.lat])
            .addTo(map.current!);

          // Create price element
          const priceElement = document.createElement('div');
          priceElement.className = 'price-bubble bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
          priceElement.innerText = property.price;
          markerEl.appendChild(priceElement);

          // Add click handler with explicit coordinates to ensure consistency
          priceElement.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Use explicit coordinates from coords object for consistency
            handleMarkerClick(property, [coords.lng, coords.lat]);
          });

          // Store marker reference
          markersRef.current[property.id] = marker;
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      // Fit map to bounds if we have properties with coordinates
      if (propertiesWithCoords > 0) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 1000 // Smoother animation
        });
      }
    } catch (error) {
      console.error('Error updating property markers:', error);
      toast.error('Error displaying properties on map');
    }
    
    // Cleanup when component unmounts or properties change
    return cleanupMarkers;
  }, [properties, mapLoaded, loading, handleMarkerClick]);

  return {
    markersRef,
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
