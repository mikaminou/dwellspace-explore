
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { createPortal } from 'react-dom';
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
  const popupRootRef = useRef<HTMLElement | null>(null);
  
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
    popupRootRef.current = document.getElementById(`property-popup-${property.id}`);

    // Force a rerender after a small delay to ensure the container is ready
    setTimeout(() => {
      if (popupRootRef.current) {
        // Create a React portal to render content inside the popup
        try {
          const popupContent = (
            <PropertyPopup 
              property={property} 
              onSave={onSaveProperty}
              onMessageOwner={onMessageOwner}
              onClick={() => navigate(`/property/${property.id}`)}
            />
          );
          
          // Use createPortal to mount the React component into the popup container
          const PopupPortal = () => createPortal(popupContent, popupRootRef.current!);
          
          // Create a temporary root and render the portal
          const tempRoot = document.createElement('div');
          popupRootRef.current.appendChild(tempRoot);
          
          const root = require('react-dom/client').createRoot(tempRoot);
          root.render(<PopupPortal />);
        } catch (error) {
          console.error('Error rendering property popup:', error);
        }
      }
    }, 0);

    // Reset active marker when popup is closed
    ['dragstart', 'zoomstart', 'click'].forEach(event => {
      map.current?.once(event, () => {
        if (popupRef.current) {
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
