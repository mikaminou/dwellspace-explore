
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
      
      // Create new marker element
      if (!markerElementsRef.current[property.id]) {
        markerElementsRef.current[property.id] = document.createElement('div');
        markerElementsRef.current[property.id].className = 'custom-marker-container';
        
        const root = createRoot(markerElementsRef.current[property.id]);
        root.render(
          PropertyMarker({
            price: property.price,
            isPremium: property.isPremium,
            listingType: property.listing_type || 'sale',
            onClick: () => {
              setActiveMarkerId(property.id);
              showPropertyPopup(property, position);
            }
          })
        );
      }
      
      console.log(`Creating new marker for property ${property.id} at position [${position.lat()}, ${position.lng()}]`);
      
      // Create and add the marker to the map
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        content: markerElementsRef.current[property.id],
        map: map.current
      });
      
      // Store the marker reference
      markersRef.current[property.id] = marker as unknown as google.maps.Marker;
      
      // Add click event
      marker.addListener('click', () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, position);
      });
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50
      });
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
