
import { useEffect, useState, useCallback } from 'react';
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
  const [propertyCoordinates, setPropertyCoordinates] = useState<{[key: number]: [number, number]}>({});

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

  // Get property coordinates (once and store them)
  const getPropertyCoordinates = useCallback((property: Property): [number, number] | null => {
    // Use stored coordinates if available
    if (propertyCoordinates[property.id]) {
      return propertyCoordinates[property.id];
    }
    
    // First priority: Use actual coordinates from the database
    if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
      if (property.longitude >= -15 && property.longitude <= 35 && 
          property.latitude >= 20 && property.latitude <= 38) {
        return [property.longitude, property.latitude];
      }
    }
    
    // Second priority: Generate from location if coordinates not available
    if (property.location) {
      const coords = generateCoordsFromLocation(property.location + ', ' + property.city, property.id);
      if (coords) {
        return [coords.lng, coords.lat];
      }
    }
    
    return null;
  }, [propertyCoordinates]);

  // Create markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let newPropertyCoordinates: {[key: number]: [number, number]} = {};
    let propertiesWithCoords = 0;
    
    console.log('Creating markers for', propertiesWithOwners.length, 'properties');

    propertiesWithOwners.forEach(property => {
      const coords = getPropertyCoordinates(property);
      
      if (!coords) {
        console.log(`No coordinates available for property ${property.id}`);
        return;
      }

      // Store coordinates for consistent positioning
      newPropertyCoordinates[property.id] = coords;
      
      bounds.extend(coords);
      propertiesWithCoords++;

      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container';
      markerEl.setAttribute('data-property-id', property.id.toString());
      
      const handleMarkerClick = () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, coords);
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

      // Create marker with fixed settings optimized for stability
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10,
        pitchAlignment: 'viewport',
        rotationAlignment: 'viewport',
      })
        .setLngLat(coords)
        .addTo(map.current!);

      markersRef.current[property.id] = marker;
    });

    setPropertyCoordinates(newPropertyCoordinates);

    if (propertiesWithCoords > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14
      });
    }

  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup, getPropertyCoordinates]);

  // Add single zoom handler to update marker positions
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Function to update marker positions after zoom/pan ends
    const updateAllMarkerPositions = () => {
      // Loop through all markers and reset their positions
      Object.entries(propertyCoordinates).forEach(([idStr, coords]) => {
        const id = parseInt(idStr, 10);
        if (markersRef.current[id]) {
          // Reset marker to its original position
          markersRef.current[id].setLngLat(coords);
        }
      });
    };
    
    // Add event handlers for zoom and movement
    map.current.on('zoomend', updateAllMarkerPositions);
    map.current.on('moveend', updateAllMarkerPositions);
    
    return () => {
      if (map.current) {
        map.current.off('zoomend', updateAllMarkerPositions);
        map.current.off('moveend', updateAllMarkerPositions);
      }
    };
  }, [mapLoaded, propertyCoordinates]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
