
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createRoot } from 'react-dom/client';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';

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
  const popupRootRef = useRef<Record<number, any>>({});

  // Show property popup
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) return;
    
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Clean up any existing roots
    Object.values(popupRootRef.current).forEach(root => {
      try {
        root.unmount();
      } catch (e) {
        console.error('Error unmounting popup:', e);
      }
    });
    popupRootRef.current = {};

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    popupRef.current = new mapboxgl.Popup({ 
      closeOnClick: false,
      closeButton: false,
      maxWidth: '320px',
      className: 'property-popup-container'
    })
      .setLngLat(coordinates)
      .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
      .addTo(map.current);

    const popupElement = document.getElementById(`property-popup-${property.id}`);
    if (popupElement) {
      try {
        // Create a root using React 18's createRoot API instead of ReactDOM.render
        const root = createRoot(popupElement);
        popupRootRef.current[property.id] = root;
        
        root.render(
          <PropertyPopup 
            property={property} 
            onSave={onSaveProperty}
            onMessageOwner={onMessageOwner}
            onClick={() => navigate(`/property/${property.id}`)}
          />
        );
      } catch (error) {
        console.error('Error rendering property popup:', error);
      }
    }

    // Reset active marker when popup is closed
    ['dragstart', 'zoomstart', 'click'].forEach(event => {
      map.current?.once(event, () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
          setActiveMarkerId(null);
          updateMarkerZIndex(null);
          
          // Clean up roots
          Object.values(popupRootRef.current).forEach(root => {
            try {
              root.unmount();
            } catch (e) {
              console.error('Error unmounting popup:', e);
            }
          });
          popupRootRef.current = {};
        }
      });
    });
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
