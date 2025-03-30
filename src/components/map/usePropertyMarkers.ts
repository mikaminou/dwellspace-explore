
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Clear any markers that are no longer in the properties list
    Object.keys(markersRef.current).forEach(id => {
      const numericId = parseInt(id);
      if (!propertiesWithOwners.some(p => p.id === numericId)) {
        markersRef.current[numericId].remove();
        delete markersRef.current[numericId];
      }
    });
    
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
      
      // For Oran city, validate and fix coordinates if they appear to be in the water
      if (property.city === 'Oran') {
        // Check if latitude and longitude are likely swapped or in water
        // Golfe d'Oran approximate bounds check
        const inWater = property.longitude > -1.0 && property.longitude < 0.0 && 
                        property.latitude > 35.5 && property.latitude < 36.0;
        
        // If coordinates appear to be in water, get corrected ones from the city
        if (inWater) {
          console.warn(`Property ${property.id} appears to be in water. Using city center coordinates instead.`);
          // Use corrected coordinates for Oran (these are land coordinates from city center)
          property.latitude = 35.691544;  
          property.longitude = -0.642049;
        }
      }
      
      // Create LngLat coordinates for mapbox (longitude first, then latitude)
      const lngLat: [number, number] = [property.longitude, property.latitude];
      
      // Extend map bounds to include this property
      bounds.extend(lngLat);
      propertiesWithCoords++;
      
      // If marker already exists, update its position
      if (markersRef.current[property.id]) {
        console.log(`Updating existing marker for property ${property.id} to position:`, lngLat);
        markersRef.current[property.id].setLngLat(lngLat);
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
      
      console.log(`Creating new marker for property ${property.id} at position:`, lngLat);
      
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
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        pitch: 45, // Maintain consistent pitch for visual style
        bearing: 0,
        duration: 1500, // Smooth animation
        essential: true,
        linear: false // Use easing for smoother transitions
      });
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
