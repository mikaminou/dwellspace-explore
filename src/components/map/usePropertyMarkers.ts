
import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
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
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);
  const processedPropertiesRef = useRef<Set<number>>(new Set());
  const previousPropertiesRef = useRef<Property[]>([]);

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

  // Reset processed properties when the properties list changes
  useEffect(() => {
    // Compare with previous properties to check if it's a new set
    const currentPropertyIds = new Set(propertiesWithOwners.map(p => p.id));
    const previousPropertyIds = new Set(previousPropertiesRef.current.map(p => p.id));
    
    // Check if property sets are different
    let isDifferentSet = false;
    
    // If length is different, it's definitely a different set
    if (currentPropertyIds.size !== previousPropertyIds.size) {
      isDifferentSet = true;
    } else {
      // Check if any property IDs are different
      for (const id of currentPropertyIds) {
        if (!previousPropertyIds.has(id)) {
          isDifferentSet = true;
          break;
        }
      }
    }
    
    // Only reset if we have a different set of properties
    if (isDifferentSet) {
      console.log('Property set changed, resetting processed properties');
      processedPropertiesRef.current = new Set();
      previousPropertiesRef.current = [...propertiesWithOwners];
      
      // Clear all existing markers when property set changes
      Object.keys(markersRef.current).forEach(id => {
        markersRef.current[parseInt(id)].remove();
        delete markersRef.current[parseInt(id)];
      });
      
      // Reset initial bounds
      setInitialBoundsSet(false);
    }
  }, [propertiesWithOwners]);

  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
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
      
      // Skip if we've already processed this property
      if (processedPropertiesRef.current.has(property.id)) {
        // Still extend bounds for this property
        bounds.extend([property.longitude, property.latitude]);
        propertiesWithCoords++;
        return;
      }
      
      // Create LngLat coordinates for mapbox (longitude first, then latitude)
      const lngLat: [number, number] = [property.longitude, property.latitude];
      
      // Extend map bounds to include this property
      bounds.extend(lngLat);
      propertiesWithCoords++;
      
      // If marker already exists, just update its position
      if (markersRef.current[property.id]) {
        console.log(`Updating existing marker for property ${property.id} to position:`, lngLat);
        markersRef.current[property.id].setLngLat(lngLat);
        
        // Mark as processed
        processedPropertiesRef.current.add(property.id);
        return;
      }
      
      // Create new marker element
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
      
      console.log(`Creating new marker for property ${property.id} at position [${lngLat[0]}, ${lngLat[1]}]`);
      
      // Create and add the marker to the map
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10
      })
        .setLngLat(lngLat)
        .addTo(map.current!);

      markersRef.current[property.id] = marker;
      
      // Mark as processed
      processedPropertiesRef.current.add(property.id);
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        bearing: 0,
        pitch: 0, // Keep flat top-down view
        duration: 1500, // Smooth animation
        essential: true
      });
      setInitialBoundsSet(true);
    }
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
