
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
  const [markerElements, setMarkerElements] = useState<{[key: number]: HTMLElement}>({});

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

  // Create markers when properties or map changes
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

    // Create marker DOM elements first
    const newMarkerElements: {[key: number]: HTMLElement} = {};

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
      
      // Ensure coordinates are within valid range
      if (coords.lng < -180 || coords.lng > 180 || coords.lat < -85 || coords.lat > 85) {
        console.warn(`Invalid coordinates for property ${property.id}: [${coords.lng}, ${coords.lat}]`);
        return;
      }

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
      
      newMarkerElements[property.id] = markerEl;

      // Create the marker with optimized positioning settings
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10,
        pitchAlignment: 'viewport',  // Keep marker aligned with the viewport
        rotationAlignment: 'viewport',  // Align with viewport
      })
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current!);

      markersRef.current[property.id] = marker;
    });

    setMarkerElements(newMarkerElements);

    if (propertiesWithCoords > 0) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
    
    // Add zoom handler to prevent marker movement on zoom
    const handleZoom = () => {
      if (!map.current) return;
      
      // Reposition markers at their original coordinates after zoom
      propertiesWithOwners.forEach(property => {
        if (!markersRef.current[property.id]) return;
        
        let coords;
        if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
          coords = { lat: property.latitude, lng: property.longitude };
        } else if (property.location) {
          coords = generateCoordsFromLocation(property.location + ', ' + property.city, property.id);
        } else {
          return;
        }
        
        if (coords) {
          markersRef.current[property.id].setLngLat([coords.lng, coords.lat]);
        }
      });
    };
    
    // Listen for zoom events to ensure markers stay in place
    map.current.on('zoom', handleZoom);
    
    return () => {
      if (map.current) {
        map.current.off('zoom', handleZoom);
      }
    };
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
