
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
  showPropertyPopup: (property: Property, marker: google.maps.Marker) => void
) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);
  const markerElements = useRef<{ [key: number]: HTMLDivElement }>({});

  const updateMarkerZIndex = (propertyId: number | null) => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setZIndex(1);
    });

    if (propertyId !== null && markersRef.current[propertyId]) {
      markersRef.current[propertyId].setZIndex(3);
    }
  };

  useEffect(() => {
    if (!map.current || !mapLoaded || loading || !window.google) return;
    
    // Clear any markers that are no longer in the properties list
    Object.keys(markersRef.current).forEach(id => {
      const numericId = parseInt(id);
      if (!propertiesWithOwners.some(p => p.id === numericId)) {
        markersRef.current[numericId].setMap(null);
        delete markersRef.current[numericId];
        
        // Also clean up any marker elements
        if (markerElements.current[numericId]) {
          delete markerElements.current[numericId];
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

    propertiesWithOwners.forEach(property => {
      let coords;
      
      if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        coords = {
          lat: property.latitude,
          lng: property.longitude
        };
        console.log(`Using actual coordinates for property ${property.id}: [${coords.lng}, ${coords.lat}]`);
      } else {
        console.log(`No coordinates available for property ${property.id}`);
        return;
      }
      
      if (!coords) return;
      
      // Only extend bounds for actual valid coordinates
      bounds.extend(new google.maps.LatLng(coords.lat, coords.lng));
      propertiesWithCoords++;
      
      // If marker already exists, update its position and skip recreation
      if (markersRef.current[property.id]) {
        markersRef.current[property.id].setPosition(new google.maps.LatLng(coords.lat, coords.lng));
        return;
      }
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container';
      markerElements.current[property.id] = markerEl;
      
      const handleMarkerClick = () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, markersRef.current[property.id]);
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
      
      // Create the AdvancedMarkerElement (once the library is loaded)
      const position = new google.maps.LatLng(coords.lat, coords.lng);
      
      // Create a custom overlay marker
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position,
        map: map.current,
        content: markerEl,
        title: property.title,
      });
      
      // Store the marker reference
      markersRef.current[property.id] = marker;
      
      // Add click event listener
      marker.addListener('click', () => {
        handleMarkerClick();
      });
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      map.current.fitBounds(bounds, {
        padding: 50,
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
