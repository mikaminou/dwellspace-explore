
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';
import * as ReactDOM from 'react-dom/client';

export function usePropertyPopup({
  map,
  onSaveProperty,
  onMessageOwner,
  navigate
}: {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  onSaveProperty: (propertyId: number) => void;
  onMessageOwner: (ownerId: number) => void;
  navigate: (path: string) => void;
}) {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupRootRef = useRef<HTMLElement | null>(null);
  const reactRootRef = useRef<ReactDOM.Root | null>(null);
  
  // Show property popup
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) return;
    
    // Clean up previous popup if exists
    if (popupRef.current) {
      if (reactRootRef.current) {
        try {
          reactRootRef.current.unmount();
          reactRootRef.current = null;
        } catch (e) {
          console.error('Error unmounting React root:', e);
        }
      }
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    // Create a popup
    popupRef.current = new mapboxgl.Popup({ 
      closeOnClick: false,
      closeButton: false,
      maxWidth: '320px',
      className: 'property-popup-container'
    })
      .setLngLat(coordinates)
      .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
      .addTo(map.current);

    // Get or create popup root element
    setTimeout(() => {
      try {
        popupRootRef.current = document.getElementById(`property-popup-${property.id}`);
        
        if (popupRootRef.current) {
          // Create a React portal to render content inside the popup
          const popupContent = (
            <PropertyPopup 
              property={property} 
              onSave={onSaveProperty}
              onMessageOwner={onMessageOwner}
              onClick={() => navigate(`/property/${property.id}`)}
            />
          );
          
          // Use createRoot to mount the React component into the popup container
          reactRootRef.current = ReactDOM.createRoot(popupRootRef.current);
          reactRootRef.current.render(popupContent);
        }
      } catch (error) {
        console.error('Error rendering property popup:', error);
      }
    }, 0);

    // Reset active marker when popup is closed
    ['dragstart', 'zoomstart', 'click'].forEach(event => {
      map.current?.once(event, () => {
        if (popupRef.current) {
          if (reactRootRef.current) {
            try {
              reactRootRef.current.unmount();
              reactRootRef.current = null;
            } catch (e) {
              console.error('Error unmounting React root on map event:', e);
            }
          }
          popupRef.current.remove();
          popupRef.current = null;
          setActiveMarkerId(null);
          updateMarkerZIndex(null);
        }
      });
    });
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
