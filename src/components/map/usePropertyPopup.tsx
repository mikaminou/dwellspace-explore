
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
  
  // Cleanup function to safely unmount React roots and remove popups
  const cleanupPopup = () => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Safely unmount React roots
    Object.entries(popupRootRef.current).forEach(([id, root]) => {
      try {
        root.unmount();
      } catch (e) {
        console.error(`Error unmounting popup for property ${id}:`, e);
      }
    });
    
    // Reset roots object
    popupRootRef.current = {};
  };

  // Show property popup with improved error handling and cleanup
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) return;
    
    // Clean up any existing popup before creating a new one
    cleanupPopup();

    try {
      // Set active marker
      setActiveMarkerId(property.id);
      updateMarkerZIndex(property.id);

      // Create popup with specific options for better positioning and user interaction
      popupRef.current = new mapboxgl.Popup({ 
        closeOnClick: false,
        closeButton: true, // Added close button for better UX
        maxWidth: '320px',
        className: 'property-popup-container',
        offset: [0, -15], // Offset to position popup better above markers
        anchor: 'bottom' // Position popup above the marker
      })
        .setLngLat(coordinates)
        .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
        .addTo(map.current);

      // Render the React component into the popup
      const popupElement = document.getElementById(`property-popup-${property.id}`);
      if (popupElement) {
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
      }

      // Reset active marker when popup is closed by user clicking the close button
      popupRef.current.on('close', () => {
        setActiveMarkerId(null);
        updateMarkerZIndex(null);
        
        // Clean up React root when popup is closed
        if (popupRootRef.current[property.id]) {
          try {
            popupRootRef.current[property.id].unmount();
            delete popupRootRef.current[property.id];
          } catch (e) {
            console.error(`Error unmounting popup for property ${property.id}:`, e);
          }
        }
      });
      
      // Handle map interactions that should close popup
      // Using once() to avoid multiple event binding
      const mapEvents = ['dragstart', 'zoomstart'];
      mapEvents.forEach(event => {
        map.current?.once(event, cleanupPopup);
      });
      
    } catch (error) {
      console.error('Error showing property popup:', error);
      // Reset state on error
      setActiveMarkerId(null);
      updateMarkerZIndex(null);
      cleanupPopup();
    }
  };

  return {
    popupRef,
    showPropertyPopup,
    cleanupPopup // Export cleanup function for component unmount
  };
}
