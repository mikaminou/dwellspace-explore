
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
    
    console.log('Properties to display on map:', propertiesWithOwners.map(p => ({
      id: p.id, 
      title: p.title, 
      street: p.street_name,
      city: p.city,
      lat: p.latitude, 
      lng: p.longitude
    })));

    // Process each property and create/update markers
    propertiesWithOwners.forEach(property => {
      // Skip properties without proper coordinates
      if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') {
        console.warn(`No valid coordinates for property ${property.id}`);
        return;
      }
      
      // Create LatLng coordinates for Google Maps
      const position = new google.maps.LatLng(property.latitude, property.longitude);
      
      // Extend map bounds to include this property
      bounds.extend(position);
      propertiesWithCoords++;
      
      // If marker already exists, update its position
      if (markersRef.current[property.id]) {
        console.log(`Updating existing marker for property ${property.id} to position:`, position.toString());
        markersRef.current[property.id].setPosition(position);
        return;
      }
      
      // Create a standard marker instead of advanced marker
      const marker = new google.maps.Marker({
        position,
        map: map.current,
        title: property.title,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <rect x="2" y="2" width="20" height="20" rx="10" fill="${property.isPremium ? '#FFD700' : property.listing_type === 'rent' ? '#3B82F6' : '#10B981'}" />
              <text x="12" y="16" font-family="Arial" font-size="10" text-anchor="middle" fill="white" font-weight="bold">
                ${property.price ? (parseInt(property.price) / 1000000).toFixed(1) + 'M' : ''}
              </text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
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
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      // Fix the padding issue by correctly using the fitBounds method
      map.current.fitBounds(bounds);
      map.current.setZoom(Math.min(15, map.current.getZoom() || 15));
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
