
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
  
  console.log('usePropertyMarkers rendering', { 
    mapLoaded, 
    loading, 
    propertiesCount: properties?.length || 0,
    mapExists: !!map.current
  });

  // Update marker z-index based on active state
  const updateMarkerZIndex = (propertyId: number | null) => {
    try {
      // Reset all markers to default z-index
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const markerEl = marker.getElement();
        markerEl.style.zIndex = '1';
      });

      // Set the active marker to higher z-index
      if (propertyId !== null && markersRef.current[propertyId]) {
        const activeMarkerEl = markersRef.current[propertyId].getElement();
        activeMarkerEl.style.zIndex = '3';
      }
    } catch (error) {
      console.error('Error updating marker z-index:', error);
    }
  };

  // Update markers when properties change
  useEffect(() => {
    console.log('usePropertyMarkers effect triggered', { 
      mapLoaded, 
      loading, 
      propertiesCount: properties?.length || 0,
      mapExists: !!map.current
    });
    
    if (!map.current || !mapLoaded || loading) {
      console.log('Skipping marker update - map not ready or loading');
      return;
    }
    
    try {
      // Remove existing markers
      console.log('Removing existing markers');
      Object.values(markersRef.current).forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.error('Error removing marker:', e);
        }
      });
      markersRef.current = {};

      if (!properties || properties.length === 0) {
        console.log('No properties to display on map');
        return;
      }

      const bounds = new mapboxgl.LngLatBounds();
      let propertiesWithCoords = 0;
      let missingCoords = 0;

      console.log(`Creating markers for ${properties.length} properties`);
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

          console.log(`Creating marker for property ${property.id} at [${coords.lng}, ${coords.lat}]`);
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
          priceElement.innerText = property.price || '$0';
          markerEl.appendChild(priceElement);

          // Add city name as data attribute for debugging
          const cityMatch = property.location.match(/,\s*([^,]+)$/);
          if (cityMatch && cityMatch[1]) {
            priceElement.setAttribute('data-city', cityMatch[1].trim());
          }

          // Add click event with better error handling
          priceElement.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
              console.log(`Marker clicked for property ${property.id}`);
              onMarkerClick(property, [coords.lng, coords.lat]);
            } catch (error) {
              console.error('Error in marker click handler:', error);
            }
          });

          markersRef.current[property.id] = marker;
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      if (propertiesWithCoords > 0) {
        try {
          console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        } catch (boundsError) {
          console.error('Error fitting bounds:', boundsError);
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
  }, [properties, mapLoaded, loading, onMarkerClick]);

  return {
    markersRef,
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
