
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { usePopupManagement } from './hooks/usePopupManagement';
import { createPropertyPopup, renderPopupContent } from './utils/popupRenderer';

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
  const { popupRef, popupRootRef, closePopup, setupPopupAutoClose } = usePopupManagement({ map });

  // Show property popup
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) return;
    
    // Close any existing popup
    closePopup();

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    // Create new popup
    popupRef.current = createPropertyPopup(map.current, property, coordinates);

    // Render React component inside popup
    const popupElement = document.getElementById(`property-popup-${property.id}`);
    if (popupElement) {
      renderPopupContent(property, popupElement, popupRootRef, {
        onSaveProperty,
        onMessageOwner,
        navigate
      });
    }

    // Set up auto-close on map interaction
    setupPopupAutoClose(setActiveMarkerId, updateMarkerZIndex);
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
