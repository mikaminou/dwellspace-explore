
import { useEffect, useState, useRef } from 'react';
import { Property } from '@/api/properties';
import { createRoot } from 'react-dom/client';
import { PropertyMarker } from './PropertyMarker';

export function usePropertyMarkers(
  map: React.MutableRefObject<google.maps.Map | null>,
  markersRef: React.MutableRefObject<{ [key: number]: google.maps.Marker }>,
  propertiesWithOwners: Property[],
  mapLoaded: boolean,
  loading: boolean,
  showPropertyPopup: (property: Property, position: google.maps.LatLng) => void
) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);
  const markerElementsRef = useRef<{ [key: number]: HTMLDivElement }>({});

  const updateMarkerZIndex = (propertyId: number | null) => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setZIndex(1);
    });

    if (propertyId !== null && markersRef.current[propertyId]) {
      markersRef.current[propertyId].setZIndex(3);
    }
  };

  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Clear any markers that are no longer in the properties list
    Object.keys(markersRef.current).forEach(id => {
      const numericId = parseInt(id);
      if (!propertiesWithOwners.some(p => p.id === numericId)) {
        if (markersRef.current[numericId]) {
          markersRef.current[numericId].setMap(null);
          delete markersRef.current[numericId];
        }
      }
    });
    
    if (propertiesWithOwners.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    let propertiesWithCoords = 0;
    
    // Add custom map styling for a cleaner look
    if (map.current) {
      try {
        map.current.setOptions({
          styles: [
            {
              featureType: "administrative",
              elementType: "labels",
              stylers: [{ visibility: "on" }]
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "transit",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#e9f1f7" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f5f7fa" }]
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#e6e6e6" }]
            }
          ]
        });
      } catch (error) {
        console.warn("Could not apply map styles:", error);
      }
    }

    // Filter out properties that are too close to each other to avoid cluttering
    const visibleProperties = propertiesWithOwners.filter(property => {
      if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') {
        return false;
      }
      return true;
    });

    // Process each property and create/update markers
    visibleProperties.forEach(property => {
      // Skip properties without proper coordinates
      if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') {
        return;
      }
      
      // Create LatLng coordinates for Google Maps
      const position = new google.maps.LatLng(property.latitude, property.longitude);
      
      // Extend map bounds to include this property
      bounds.extend(position);
      propertiesWithCoords++;
      
      // If marker already exists, update its position
      if (markersRef.current[property.id]) {
        markersRef.current[property.id].setPosition(position);
        return;
      }
      
      // Create a clean, modern marker instead of the default
      const marker = new google.maps.Marker({
        position,
        map: map.current,
        title: property.title,
        animation: google.maps.Animation.DROP,
        // Use a custom SVG marker for a cleaner look
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="18" fill="${property.isPremium ? '#CDA434' : property.listing_type === 'rent' ? '#3B82F6' : '#10B981'}" opacity="0.9"/>
              <circle cx="18" cy="18" r="8" fill="white" opacity="0.85"/>
              <circle cx="18" cy="18" r="6" fill="${property.isPremium ? '#CDA434' : property.listing_type === 'rent' ? '#3B82F6' : '#10B981'}"/>
            </svg>
          `),
          size: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 18),
          scaledSize: new google.maps.Size(36, 36)
        }
      });
      
      // Store the marker reference
      markersRef.current[property.id] = marker;
      
      // Add click event
      marker.addListener('click', () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, position);
      });
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      // Fix the padding issue by correctly using the fitBounds method
      map.current.fitBounds(bounds, { padding: 50 });
      
      // Set a reasonable zoom level to not be too zoomed in
      const currentZoom = map.current.getZoom() || 15;
      map.current.setZoom(Math.min(15, currentZoom));
      
      setInitialBoundsSet(true);
    }
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup, initialBoundsSet]);

  // Reset initialBoundsSet when properties are completely changed (like during a city change)
  useEffect(() => {
    if (propertiesWithOwners.length === 0) {
      setInitialBoundsSet(false);
    }
  }, [propertiesWithOwners]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
