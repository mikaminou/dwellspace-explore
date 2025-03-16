
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';
import { createRoot } from 'react-dom/client';

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
  const reactRootRef = useRef<ReturnType<typeof createRoot> | null>(null);
  
  // Cleanup function for React root and popup
  const cleanupPopup = () => {
    if (reactRootRef.current) {
      try {
        reactRootRef.current.unmount();
      } catch (e) {
        console.error('Error unmounting React root:', e);
      }
      reactRootRef.current = null;
    }
    
    if (popupRef.current) {
      try {
        popupRef.current.remove();
      } catch (e) {
        console.error('Error removing popup:', e);
      }
      popupRef.current = null;
    }
  };
  
  // Ensure cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupPopup();
    };
  }, []);
  
  // Show property popup
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) return;
    
    // Clean up previous popup if exists
    cleanupPopup();

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    try {
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

      // Get or create popup root element with a delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Make sure the popupRef is still valid
          if (!popupRef.current) return;
          
          const popupElement = document.getElementById(`property-popup-${property.id}`);
          
          if (!popupElement) {
            console.warn(`Popup element for property ${property.id} not found`);
            return;
          }
          
          popupRootRef.current = popupElement;
          
          // Create a React root using the modern API
          reactRootRef.current = createRoot(popupElement);
          
          // Render the React component into the root
          const popupContent = (
            <PropertyPopup 
              property={property} 
              onSave={onSaveProperty}
              onMessageOwner={onMessageOwner}
              onClick={() => navigate(`/property/${property.id}`)}
            />
          );
          
          // Make sure the reactRootRef is still valid
          if (reactRootRef.current) {
            reactRootRef.current.render(popupContent);
          }
        } catch (error) {
          console.error('Error rendering property popup:', error);
          cleanupPopup();
        }
      }, 100); // Longer delay to ensure DOM is ready in sandbox environments

      // Reset active marker when popup is closed
      ['dragstart', 'zoomstart', 'click'].forEach(event => {
        map.current?.once(event, () => {
          if (popupRef.current) {
            cleanupPopup();
            setActiveMarkerId(null);
            updateMarkerZIndex(null);
          }
        });
      });
    } catch (error) {
      console.error('Error creating property popup:', error);
      cleanupPopup();
      setActiveMarkerId(null);
      updateMarkerZIndex(null);
    }
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
