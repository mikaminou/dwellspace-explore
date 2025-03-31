import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { formatPrice } from './mapUtils';

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
    el.className = 'marker-container';
    
    el.innerHTML = `
      <div class="marker-bubble">
        <span class="marker-price">${formatPrice(property.price)}</span>
        <div class="marker-pointer"></div>
      </div>
    `;

    let markerTypeClass = 'default-marker';
    switch (property.listingType || property.listing_type) {
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
      case 'sale':
      default:
        markerTypeClass = 'sale-marker';
        break;
    }

    if (property.isPremium) {
      markerTypeClass = 'premium-marker';
    }

    el.className = `marker-container ${markerTypeClass}`;

    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([Number(property.longitude), Number(property.latitude)])
      .addTo(map.current!);

    markersRef.current[property.id] = marker;

    bounds.extend([Number(property.longitude), Number(property.latitude)]);

    el.addEventListener('click', () => {
      showPropertyPopup(property, marker);
      setActiveMarkerId(property.id);
      updateMarkerZIndex(property.id);
    });
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

  return {
    activeMarkerId,
    setActiveMarkerId,
    updateMarkerZIndex
  };
}
