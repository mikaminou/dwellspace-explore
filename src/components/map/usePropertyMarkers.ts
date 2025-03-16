
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
  const markerCoordinates = useRef<{ [key: number]: [number, number] }>({});
  const isRepositioning = useRef(false);

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

  // Function to reset markers to their original coordinates
  const repositionMarkers = () => {
    if (!map.current || isRepositioning.current) return;
    
    isRepositioning.current = true;
    
    try {
      Object.entries(markerCoordinates.current).forEach(([id, coords]) => {
        const marker = markersRef.current[Number(id)];
        if (marker) {
          marker.setLngLat(coords);
        }
      });
    } finally {
      // Ensure we always reset the flag
      isRepositioning.current = false;
    }
  };

  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    markerCoordinates.current = {};

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

      // Store original coordinates for repositioning - crucial for stability
      const lngLat: [number, number] = [coords.lng, coords.lat];
      markerCoordinates.current[property.id] = lngLat;

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
      
      // Create the marker with enhanced stability settings
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],  // No offset to reduce positioning issues
        clickTolerance: 10,
        pitchAlignment: 'viewport',
        rotationAlignment: 'viewport'
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

    // Add a SINGLE event handler for all map movements
    // This is more efficient than multiple handlers
    const handleMapMove = () => {
      window.requestAnimationFrame(repositionMarkers);
    };

    // Add event listeners for repositioning markers
    map.current.on('zoom', handleMapMove);
    map.current.on('pitch', handleMapMove);
    map.current.on('rotate', handleMapMove);
    map.current.on('move', handleMapMove);

    // Additional reposition after movement ends
    map.current.on('moveend', repositionMarkers);
    map.current.on('zoomend', repositionMarkers);

    return () => {
      // Clean up event listeners when component unmounts
      if (map.current) {
        map.current.off('zoom', handleMapMove);
        map.current.off('pitch', handleMapMove);
        map.current.off('rotate', handleMapMove);
        map.current.off('move', handleMapMove);
        map.current.off('moveend', repositionMarkers);
        map.current.off('zoomend', repositionMarkers);
      }
    };
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
