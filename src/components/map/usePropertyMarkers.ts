
import { useEffect, useState } from 'react';
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
    
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;
    
    console.log('Properties to display on map:', propertiesWithOwners.map(p => ({
      id: p.id, 
      title: p.title, 
      street: p.street_name,
      city: p.city,
      lat: p.latitude, 
      lng: p.longitude
    })));

    propertiesWithOwners.forEach(property => {
      let coords;
      
      if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        coords = {
          lat: property.latitude,
          lng: property.longitude
        };
        console.log(`Using actual coordinates for property ${property.id}: [${coords.lng}, ${coords.lat}]`);
      } else {
        console.log(`No coordinates available for property ${property.id}`);
        return;
      }
      
      if (!coords) return;
      bounds.extend([coords.lng, coords.lat]);
      propertiesWithCoords++;
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container';
      
      const handleMarkerClick = () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, [coords.lng, coords.lat]);
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
      
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10
      })
        .setLngLat([coords.lng, coords.lat])
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
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
