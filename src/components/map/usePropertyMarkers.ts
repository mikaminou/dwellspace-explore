
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
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
    if (!map.current || !mapLoaded || loading) return;
    
    try {
      // Remove existing markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};

      if (properties.length === 0) return;

      const bounds = new mapboxgl.LngLatBounds();
      let propertiesWithCoords = 0;
      let missingCoords = 0;

      properties.forEach(property => {
        try {
          // Use the stored longitude and latitude from the database
          if (property.longitude === undefined || property.latitude === undefined) {
            console.warn(`Property ${property.id} has no coordinates in the database`);
            missingCoords++;
            return;
          }

          const lng = Number(property.longitude);
          const lat = Number(property.latitude);
          
          // Validate coordinates are valid numbers
          if (isNaN(lng) || isNaN(lat)) {
            console.warn(`Property ${property.id} has invalid coordinates: [${lng}, ${lat}]`);
            missingCoords++;
            return;
          }

          // Extend map bounds to include this property
          bounds.extend([lng, lat]);
          propertiesWithCoords++;

          const markerEl = document.createElement('div');
          markerEl.className = 'custom-marker-container';
          
          const marker = new mapboxgl.Marker({
            element: markerEl,
            anchor: 'bottom',
            offset: [0, 0],
            clickTolerance: 10
          })
            .setLngLat([lng, lat])
            .addTo(map.current!);

          const priceElement = document.createElement('div');
          priceElement.className = 'price-bubble bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
          priceElement.innerText = property.price;
          markerEl.appendChild(priceElement);

          // Add city name as data attribute for debugging
          if (property.city) {
            priceElement.setAttribute('data-city', property.city);
          }

          priceElement.addEventListener('click', (e) => {
            e.stopPropagation();
            onMarkerClick(property, [lng, lat]);
          });

          markersRef.current[property.id] = marker;
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      if (propertiesWithCoords > 0) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
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
