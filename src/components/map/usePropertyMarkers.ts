
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { formatPrice } from './mapUtils';
import ReactDOM from 'react-dom';
import { PropertyMarker } from './PropertyMarker';
import React from 'react';

interface UsePropertyMarkersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  markersRef: React.MutableRefObject<{ [key: number]: mapboxgl.Marker }>;
  properties: Property[];
  mapLoaded: boolean;
  loading: boolean;
  showPropertyPopup: (property: Property, marker: mapboxgl.Marker) => void;
}

export function usePropertyMarkers(
  map: React.MutableRefObject<mapboxgl.Map | null>,
  markersRef: React.MutableRefObject<{ [key: number]: mapboxgl.Marker }>,
  properties: Property[],
  mapLoaded: boolean,
  loading: boolean,
  showPropertyPopup: (property: Property, marker: mapboxgl.Marker) => void
) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);
  const processedPropertiesRef = useRef<Set<number>>(new Set());
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);

  const hasProcessedAllProperties = () => {
    return properties.every(property => processedPropertiesRef.current.has(property.id));
  };

  const updateMarkerZIndex = (propertyId: number | null) => {
    if (!propertyId) {
      Object.values(markersRef.current).forEach(marker => {
        const element = marker.getElement();
        element.style.zIndex = '1';
      });
      return;
    }
    
    if (markersRef.current && markersRef.current[propertyId]) {
      Object.values(markersRef.current).forEach(marker => {
        const element = marker.getElement();
        element.style.zIndex = '1';
      });

      const selectedMarker = markersRef.current[propertyId];
      const element = selectedMarker.getElement();
      element.style.zIndex = '2';
    }
  };

  // New function to highlight a marker on property card hover
  const highlightMarker = (propertyId: number | null) => {
    // First reset all markers to normal state
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const element = marker.getElement();
      // Remove any highlight class
      element.classList.remove('marker-highlighted');
      // Reset transform scale
      element.style.transform = element.style.transform.replace(/scale\([^)]+\)/, '');
    });
    
    // If no property ID provided, we're just resetting all markers
    if (!propertyId) {
      setHoveredMarkerId(null);
      return;
    }
    
    // Set the hovered marker ID
    setHoveredMarkerId(propertyId);
    
    // Find and highlight the specific marker
    if (markersRef.current && markersRef.current[propertyId]) {
      const hoveredMarker = markersRef.current[propertyId];
      const element = hoveredMarker.getElement();
      
      // Apply highlight
      element.classList.add('marker-highlighted');
      
      // Make it slightly larger with transform scale
      // Get current transform and add scale
      const currentTransform = element.style.transform;
      if (!currentTransform.includes('scale')) {
        element.style.transform = `${currentTransform} scale(1.15)`;
      }
      
      // Ensure it's on top
      element.style.zIndex = '3';
    }
  };

  const clearUnusedMarkers = () => {
    Object.keys(markersRef.current).forEach(key => {
      const propertyId = parseInt(key);
      if (!properties.find(property => property.id === propertyId)) {
        markersRef.current[propertyId].remove();
        delete markersRef.current[propertyId];
        processedPropertiesRef.current.delete(propertyId);
      }
    });
  };

  const createMarkerForProperty = (property: Property, bounds: mapboxgl.LngLatBounds) => {
    if (
      !property.longitude ||
      !property.latitude ||
      isNaN(Number(property.longitude)) ||
      isNaN(Number(property.latitude))
    ) {
      return;
    }

    const el = document.createElement('div');
    el.className = 'mapbox-marker-container';

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([Number(property.longitude), Number(property.latitude)])
      .addTo(map.current!);

    // Render React component into the marker element
    const markerNode = document.createElement('div');
    el.appendChild(markerNode);

    ReactDOM.render(
      React.createElement(PropertyMarker, {
        price: property.price,
        isPremium: property.isPremium,
        listingType: property.listingType || property.listing_type,
        onClick: () => {
          showPropertyPopup(property, marker);
          setActiveMarkerId(property.id);
          updateMarkerZIndex(property.id);
        }
      }),
      markerNode
    );

    markersRef.current[property.id] = marker;
    bounds.extend([Number(property.longitude), Number(property.latitude)]);
  };

  useEffect(() => {
    if (!map.current || !mapLoaded || loading || !properties.length) return;

    if (hasProcessedAllProperties()) {
      console.log("All properties already have markers, skipping");
      return;
    }

    console.log(`Creating markers for ${properties.length} properties`);
    
    clearUnusedMarkers();

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;

    properties.forEach(property => {
      if (processedPropertiesRef.current.has(property.id)) {
        if (
          property.longitude && 
          property.latitude && 
          !isNaN(Number(property.longitude)) && 
          !isNaN(Number(property.latitude))
        ) {
          bounds.extend([Number(property.longitude), Number(property.latitude)]);
          propertiesWithCoords++;
        }
        return;
      }

      createMarkerForProperty(property, bounds);
      
      processedPropertiesRef.current.add(property.id);
    });

    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 80, right: 80 },
        maxZoom: 14,
        bearing: 0,
        pitch: 0, 
        duration: 1200,
        essential: true
      });
      setInitialBoundsSet(true);
    }
  }, [properties, mapLoaded, loading, map, markersRef, showPropertyPopup]);

  useEffect(() => {
    if (activeMarkerId) {
      updateMarkerZIndex(activeMarkerId);
    }
  }, [activeMarkerId]);

  // Add effect to handle hoveredMarkerId changes
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .marker-highlighted .marker-bubble {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25) !important;
        transition: all 0.2s ease-in-out !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return {
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex,
    hoveredMarkerId,
    setHoveredMarkerId,
    highlightMarker
  };
}
