
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';

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
  const processedPropertiesRef = useRef<Set<number>>(new Set());
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);

  // Function to check if all properties have been processed
  const hasProcessedAllProperties = () => {
    return properties.every(property => processedPropertiesRef.current.has(property.id));
  };

  // Function to update the z-index of a marker
  const updateMarkerZIndex = (propertyId: number | null) => {
    if (!propertyId) {
      // Reset all markers to default z-index
      Object.values(markersRef.current).forEach(marker => {
        const element = marker.getElement();
        element.style.zIndex = '1';
      });
      return;
    }
    
    if (markersRef.current && markersRef.current[propertyId]) {
      // Reset all markers to default z-index
      Object.values(markersRef.current).forEach(marker => {
        const element = marker.getElement();
        element.style.zIndex = '1';
      });

      // Bring the selected marker to the front
      const selectedMarker = markersRef.current[propertyId];
      const element = selectedMarker.getElement();
      element.style.zIndex = '2';
    }
  };

  // Function to clear unused markers
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

  // Function to create a marker for a property
  const createMarkerForProperty = (property: Property, bounds: mapboxgl.LngLatBounds) => {
    if (
      !property.longitude ||
      !property.latitude ||
      isNaN(property.longitude) ||
      isNaN(property.latitude)
    ) {
      return;
    }

    const el = document.createElement('div');
    el.className = 'marker-container';
    el.innerHTML = `
      <div class="marker-icon">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="17" cy="17" r="17" fill="currentColor"/>
        </svg>
      </div>
      <div class="marker-price">${property.price}</div>
    `;

    // Add specific class based on listing type
    let markerTypeClass = 'default-marker';
    switch (property.listingType || property.listing_type) {
      case 'sale':
        markerTypeClass = 'sale-marker';
        break;
      case 'rent':
        markerTypeClass = 'rent-marker';
        break;
      case 'construction':
        markerTypeClass = 'construction-marker';
        break;
      case 'commercial':
        markerTypeClass = 'commercial-marker';
        break;
      case 'vacation':
        markerTypeClass = 'vacation-marker';
        break;
      default:
        break;
    }

    // Add premium class if isPremium is true
    if (property.isPremium) {
      markerTypeClass = 'premium-marker';
    }

    el.className = `marker-container ${markerTypeClass}`;

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([property.longitude, property.latitude])
      .addTo(map.current!);

    // Store the marker in the markersRef
    markersRef.current[property.id] = marker;

    // Extend bounds to include this marker's coordinates
    bounds.extend([property.longitude, property.latitude]);

    // Add click event to show popup
    el.addEventListener('click', () => {
      showPropertyPopup(property, marker);
      setActiveMarkerId(property.id);
      updateMarkerZIndex(property.id);
    });
  };

  // Process properties and create markers
  useEffect(() => {
    if (!map.current || !mapLoaded || loading || !properties.length) return;

    // Don't recreate markers if they've already been processed for these properties
    if (hasProcessedAllProperties()) {
      console.log("All properties already have markers, skipping");
      return;
    }

    console.log(`Creating markers for ${properties.length} properties`);
    
    // Clear any existing markers if we've received a new properties array
    clearUnusedMarkers();

    // Track the bounds of all markers to fit the map view
    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;

    // Create markers for properties that don't already have them
    properties.forEach(property => {
      if (processedPropertiesRef.current.has(property.id)) {
        // This property already has a marker
        if (
          property.longitude && 
          property.latitude && 
          !isNaN(property.longitude) && 
          !isNaN(property.latitude)
        ) {
          // Add to bounds calculation for existing markers too
          bounds.extend([property.longitude, property.latitude]);
          propertiesWithCoords++;
        }
        return;
      }

      createMarkerForProperty(property, bounds);
      
      // Mark this property as processed
      processedPropertiesRef.current.add(property.id);
    });

    // Only fit map bounds once for this set of properties and ensure all markers are visible
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      // Use a consistent padding to ensure all markers are visible
      map.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 80, right: 80 },
        maxZoom: 14, // Lower max zoom to show more context
        bearing: 0,
        pitch: 0, 
        duration: 1200,
        essential: true
      });
      setInitialBoundsSet(true);
    }
  }, [properties, mapLoaded, loading, map, markersRef, showPropertyPopup]);

  // Effect to handle active marker changes
  useEffect(() => {
    if (activeMarkerId) {
      updateMarkerZIndex(activeMarkerId);
    }
  }, [activeMarkerId]);

  return {
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
