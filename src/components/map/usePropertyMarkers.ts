
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
  const markersProcessedRef = useRef(false);
  
  // Update marker z-index when active marker changes
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

  // Clear and reset markers when properties list changes
  useEffect(() => {
    // Only process if properties list has meaningfully changed
    const currentPropertyIds = new Set(propertiesWithOwners.map(p => p.id));
    const previousPropertyIds = new Set(previousPropertiesRef.current.map(p => p.id));
    
    // Check if property sets are different by comparing IDs
    let isDifferentSet = false;
    
    // Check if the length is different
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
    
    // Only reset if we have a new search result
    if (isDifferentSet) {
      console.log('Property set changed, resetting markers');
      
      // Clean up existing markers
      Object.keys(markersRef.current).forEach(id => {
        markersRef.current[parseInt(id)].remove();
        delete markersRef.current[parseInt(id)];
      });
      
      // Clear all marker tracking
      processedPropertiesRef.current = new Set();
      markersProcessedRef.current = false;
      
      // Store current properties for next comparison
      previousPropertiesRef.current = [...propertiesWithOwners];
      
      // Reset bounds flag to allow fitting to new property set
      setInitialBoundsSet(false);
    }
  }, [propertiesWithOwners]);

  // Only create markers once when properties and map are ready
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    if (propertiesWithOwners.length === 0) return;
    if (markersProcessedRef.current) return; // Skip if markers already processed
    
    console.log('Creating markers for properties:', propertiesWithOwners.length);
    
    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;
    
    // Process each property and create markers (only once)
    propertiesWithOwners.forEach(property => {
      // Skip properties without proper coordinates
      if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') {
        console.warn(`No valid coordinates for property ${property.id}`);
        return;
      }
      
      // Check if this property is already processed
      if (processedPropertiesRef.current.has(property.id)) {
        // Still include in bounds calculation
        bounds.extend([property.longitude, property.latitude]);
        propertiesWithCoords++;
        return;
      }
      
      // Create marker coordinates (longitude first, then latitude for mapbox)
      const lngLat: [number, number] = [property.longitude, property.latitude];
      
      // Include in bounds calculation
      bounds.extend(lngLat);
      propertiesWithCoords++;
      
      // Create the marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container';
      
      // Set up click handler
      const handleMarkerClick = () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, lngLat);
      };

      // Render React component into marker element
      const root = createRoot(markerEl);
      root.render(
        PropertyMarker({
          price: property.price,
          isPremium: property.isPremium,
          listingType: property.listing_type || 'sale',
          onClick: handleMarkerClick
        })
      );
      
      console.log(`Creating marker for property ${property.id} at [${lngLat[0]}, ${lngLat[1]}]`);
      
      // Create and add marker to map
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10
      })
        .setLngLat(lngLat)
        .addTo(map.current!);

      // Store reference to marker
      markersRef.current[property.id] = marker;
      
      // Mark as processed
      processedPropertiesRef.current.add(property.id);
    });

    // Only fit map bounds once for this set of properties
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        bearing: 0,
        pitch: 0, 
        duration: 1500,
        essential: true
      });
      setInitialBoundsSet(true);
    }
    
    // Mark all markers as processed to prevent recreation
    markersProcessedRef.current = true;
    
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
