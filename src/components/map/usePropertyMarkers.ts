
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { generateCoordsFromLocation } from './mapUtils';

export function usePropertyMarkers(
  map: React.MutableRefObject<mapboxgl.Map | null>,
  markersRef: React.MutableRefObject<{ [key: number]: mapboxgl.Marker }>,
  propertiesWithOwners: Property[],
  mapLoaded: boolean,
  loading: boolean,
  showPropertyPopup: (property: Property, coordinates: [number, number]) => void
) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  // Update marker z-index based on active state
  const updateMarkerZIndex = (propertyId: number | null) => {
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
  };

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;

    propertiesWithOwners.forEach(property => {
      // Determine coordinates - first try to use actual lat/lng from database
      let coords;
      
      if (typeof property.longitude === 'number' && typeof property.latitude === 'number') {
        // Use the actual coordinates from the database
        coords = {
          lng: property.longitude,
          lat: property.latitude
        };
      } else if (property.location) {
        // Fallback to generated coordinates only if necessary
        coords = generateCoordsFromLocation(property.location, property.id);
      } else {
        // No location data available
        return;
      }

      if (!coords) return;

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
      priceElement.innerText = property.price;
      markerEl.appendChild(priceElement);

      priceElement.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveMarkerId(property.id);
        showPropertyPopup(property, [coords.lng, coords.lat]);
      });

      markersRef.current[property.id] = marker;
    });

    if (propertiesWithCoords > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
