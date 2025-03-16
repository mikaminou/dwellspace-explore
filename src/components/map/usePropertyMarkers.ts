
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { generateCoordsFromLocation } from './mapUtils';
import ReactDOM from 'react-dom';
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

  // Update marker z-index based on active state
  const updateMarkerZIndex = (propertyId: number | null) => {
    // Reset all markers to default z-index
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const markerEl = marker.getElement();
      markerEl.style.zIndex = '1';
    });

    // Set the active marker to higher z-index
    if (propertyId !== null && markersRef.current[propertyId]) {
      const activeMarkerEl = markersRef.current[propertyId].getElement();
      activeMarkerEl.style.zIndex = '3';
    }
  };

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Remove all existing markers first
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;
    
    console.log('Properties to display on map:', propertiesWithOwners.map(p => ({
      id: p.id, 
      title: p.title, 
      lat: p.latitude, 
      lng: p.longitude
    })));

    propertiesWithOwners.forEach(property => {
      // Determine coordinates - first try to use actual lat/lng from database
      let coords;
      
      if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        // Use the actual coordinates from the database
        coords = {
          lat: property.latitude,
          lng: property.longitude
        };
        console.log(`Using actual coordinates for property ${property.id}: [${coords.lng}, ${coords.lat}]`);
      } else if (property.location) {
        // Fallback to generated coordinates only if necessary
        coords = generateCoordsFromLocation(property.location, property.id);
        console.log(`Using generated coordinates for property ${property.id}: [${coords.lng}, ${coords.lat}]`);
      } else {
        // No location data available
        console.log(`No coordinates available for property ${property.id}`);
        return;
      }

      if (!coords) return;

      // Add to bounds calculation
      bounds.extend([coords.lng, coords.lat]);
      propertiesWithCoords++;

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container';
      
      // Render React component to the marker element
      const handleMarkerClick = () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, [coords.lng, coords.lat]);
      };

      ReactDOM.render(
        <PropertyMarker 
          price={property.price} 
          isPremium={property.isPremium} 
          onClick={handleMarkerClick} 
        />, 
        markerEl
      );
      
      // Create and add marker to map
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10
      })
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current!);

      // Store marker reference
      markersRef.current[property.id] = marker;
    });

    // Fit map to bounds if we have properties with coordinates
    if (propertiesWithCoords > 0) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
