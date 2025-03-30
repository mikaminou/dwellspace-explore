
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
      
      // Create the standard Marker instead of AdvancedMarkerElement
      const position = new google.maps.LatLng(coords.lat, coords.lng);
      
      // Create a standard Google Maps marker
      const marker = new google.maps.Marker({
        position,
        map: map.current,
        title: property.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"></svg>'),
          anchor: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(1, 1)
        }
      });
      
      // Add our custom element as an overlay
      const overlay = new google.maps.OverlayView();
      overlay.setMap(map.current);
      
      overlay.onAdd = function() {
        const pane = this.getPanes()!.overlayMouseTarget;
        pane.appendChild(markerEl);
      };
      
      overlay.draw = function() {
        const projection = this.getProjection();
        const point = projection.fromLatLngToDivPixel(position)!;
        
        markerEl.style.position = 'absolute';
        markerEl.style.left = (point.x - 20) + 'px'; // Adjust for marker width
        markerEl.style.top = (point.y - 40) + 'px'; // Adjust for marker height
        markerEl.style.zIndex = '1';
      };
      
      // Store the marker reference
      markersRef.current[property.id] = marker;
      
      // Add click event listener
      marker.addListener('click', () => {
        handleMarkerClick();
      });
      
      // Also add click event to our custom element
      markerEl.addEventListener('click', handleMarkerClick);
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      console.log(`Fitting map to bounds with ${propertiesWithCoords} properties`);
      // Fix the padding issue by using the correct format
      const boundsOptions = { 
        top: 50, 
        right: 50, 
        bottom: 50, 
        left: 50 
      };
      map.current.fitBounds(bounds, boundsOptions);
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
