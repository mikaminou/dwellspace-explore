
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
  
  // Cleanup function to properly dispose React roots and popups
  const cleanupPopup = () => {
    console.log("Cleaning up popup and React roots");
    
    // Remove popup
    if (popupRef.current) {
      try {
        popupRef.current.remove();
      } catch (e) {
        console.error('Error removing popup:', e);
      }
      popupRef.current = null;
    }
    
    // Unmount any React roots
    Object.entries(popupRootRef.current).forEach(([id, root]) => {
      try {
        console.log(`Unmounting popup root for property ${id}`);
        root.unmount();
      } catch (e) {
        console.error(`Error unmounting popup root for property ${id}:`, e);
      }
    });
    
    //Clear the roots reference
    popupRootRef.current = {};
  };

  // Show property popup
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    console.log(`Showing popup for property ${property.id}`);
    
    if (!map.current) {
      console.warn('Map not initialized');
      return;
    }
    
    try {
      // Clean up any existing popup and roots
      cleanupPopup();

      // Set active marker
      setActiveMarkerId(property.id);
      updateMarkerZIndex(property.id);

      // Create new popup
      popupRef.current = new mapboxgl.Popup({ 
        closeOnClick: false,
        closeButton: true,
        maxWidth: '320px',
        className: 'property-popup-container'
      })
        .setLngLat(coordinates)
        .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
        .addTo(map.current);

      const popupElement = document.getElementById(`property-popup-${property.id}`);
      if (!popupElement) {
        console.error(`Popup element not found for property ${property.id}`);
        return;
      }

      // Create React root and render popup content
      console.log(`Creating React root for property ${property.id}`);
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

      // Add cleanup for popup close
      popupRef.current.once('close', () => {
        console.log(`Popup closed for property ${property.id}`);
        cleanupPopup();
        setActiveMarkerId(null);
        updateMarkerZIndex(null);
      });

      // Add map event listeners
      ['dragstart', 'zoomstart', 'click'].forEach(event => {
        map.current?.once(event, () => {
          console.log(`Map ${event} triggered, cleaning up popup`);
          cleanupPopup();
          setActiveMarkerId(null);
          updateMarkerZIndex(null);
        });
      });
    } catch (error) {
      console.error('Error showing property popup:', error);
      cleanupPopup();
    }
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
