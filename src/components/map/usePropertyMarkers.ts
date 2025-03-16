
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { generateCoordsFromLocation } from './mapUtils';
import { createRoot } from 'react-dom/client';
import { PropertyMarker } from './PropertyMarker';

export function usePropertyMarkers(
  map: React.MutableRefObject<mapboxgl.Map | null>,
  markersRef: React.MutableRefObject<{ [key: number]: mapboxgl.Marker }>,
  propertiesWithOwners: Property[],
  mapLoaded: boolean,
  loading: boolean,
  showPropertyPopup: (property: Property, coordinates: [number, number]) => void
) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  const updateMarkerZIndex = (propertyId: number | null) => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const markerEl = marker.getElement();
      markerEl.style.zIndex = '1';
    });

    if (propertyId !== null && markersRef.current[propertyId]) {
      const activeMarkerEl = markersRef.current[propertyId].getElement();
      activeMarkerEl.style.zIndex = '3';
    }
  };

  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;
    
    console.log('Properties to display on map:', propertiesWithOwners.map(p => ({
      id: p.id, 
      title: p.title, 
      city: p.city,
      lat: p.latitude, 
      lng: p.longitude
    })));

    propertiesWithOwners.forEach(property => {
      let coords;
      
      // First priority: Use actual coordinates from the database
      if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        coords = {
          lat: property.latitude,
          lng: property.longitude
        };
        console.log(`Using actual coordinates for property ${property.id}: [${coords.lng}, ${coords.lat}]`);
      } 
      // Second priority: Generate from location if coordinates not available
      else if (property.location) {
        coords = generateCoordsFromLocation(property.location + ', ' + property.city, property.id);
        console.log(`Using generated coordinates for property ${property.id} in ${property.city}: [${coords.lng}, ${coords.lat}]`);
      } else {
        console.log(`No coordinates available for property ${property.id}`);
        return;
      }

      if (!coords) return;

      // Use fixed LngLat for markers - never recalculate positions
      const lngLat: [number, number] = [coords.lng, coords.lat];
      bounds.extend(lngLat);
      propertiesWithCoords++;

      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container';
      
      const handleMarkerClick = () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, lngLat);
      };

      const root = createRoot(markerEl);
      root.render(
        PropertyMarker({
          price: property.price,
          isPremium: property.isPremium,
          listingType: property.listing_type || 'sale',
          onClick: handleMarkerClick
        })
      );
      
      // Create the marker with fixed position settings
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10
      })
        .setLngLat(lngLat)
        .addTo(map.current!);

      markersRef.current[property.id] = marker;
    });

    if (propertiesWithCoords > 0) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }

    // No map movement handlers needed since we're using fixed coordinates

    return () => {
      // No event listeners to remove
    };
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
