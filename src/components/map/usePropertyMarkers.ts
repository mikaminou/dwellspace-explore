
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
  const [markerElements, setMarkerElements] = useState<{[key: number]: HTMLElement}>({});
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

  // Store property coordinates for consistent positioning
  const getPropertyCoordinates = useCallback((property: Property): [number, number] | null => {
    // First priority: Use actual coordinates from the database
    if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
      if (property.longitude >= -180 && property.longitude <= 180 && 
          property.latitude >= -85 && property.latitude <= 85) {
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
  }, []);

  // Function to update marker positions
  const updateMarkerPositions = useCallback(() => {
    if (!map.current) return;
    
    Object.entries(propertyCoordinates).forEach(([idStr, coords]) => {
      const id = parseInt(idStr, 10);
      if (markersRef.current[id]) {
        markersRef.current[id].setLngLat(coords);
      }
    });
  }, [propertyCoordinates]);

  // Create markers when properties or map changes
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let newPropertyCoordinates: {[key: number]: [number, number]} = {};
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
      const coords = getPropertyCoordinates(property);
      
      if (!coords) {
        console.log(`No coordinates available for property ${property.id}`);
        return;
      }
      
      console.log(`Using coordinates for property ${property.id}: [${coords[0]}, ${coords[1]}]`);
      
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
      
      newMarkerElements[property.id] = markerEl;

      // Create the marker with fixed positioning settings
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10,
        rotationAlignment: 'viewport',  // Keep marker aligned with viewport
        pitchAlignment: 'viewport',     // Keep marker aligned with viewport
      })
        .setLngLat(coords)
        .addTo(map.current!);

      markersRef.current[property.id] = marker;
    });

    setMarkerElements(newMarkerElements);
    setPropertyCoordinates(newPropertyCoordinates);

    if (propertiesWithCoords > 0) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup, getPropertyCoordinates]);

  // Add event listeners to maintain marker positions
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    const handleZoomEnd = () => {
      console.log("Zoom ended - updating marker positions");
      updateMarkerPositions();
    };
    
    const handleMoveEnd = () => {
      console.log("Move ended - updating marker positions");
      updateMarkerPositions();
    };
    
    const handleDragEnd = () => {
      console.log("Drag ended - updating marker positions");
      updateMarkerPositions();
    };
    
    map.current.on('zoomend', handleZoomEnd);
    map.current.on('moveend', handleMoveEnd);
    map.current.on('dragend', handleDragEnd);
    
    return () => {
      if (map.current) {
        map.current.off('zoomend', handleZoomEnd);
        map.current.off('moveend', handleMoveEnd);
        map.current.off('dragend', handleDragEnd);
      }
    };
  }, [mapLoaded, updateMarkerPositions]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
