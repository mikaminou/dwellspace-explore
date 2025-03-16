
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface PopupManagementParams {
  map: React.MutableRefObject<mapboxgl.Map | null>;
}

export function usePopupManagement({ map }: PopupManagementParams) {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const popupRootRef = useRef<Record<number, any>>({});

  // Close popup and clean up roots
  const closePopup = () => {
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
  };

  // Setup popup closing on map interaction
  const setupPopupAutoClose = (
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) return;

    ['dragstart', 'zoomstart', 'click'].forEach(event => {
      map.current?.once(event, () => {
        closePopup();
        setActiveMarkerId(null);
        updateMarkerZIndex(null);
      });
    });
  };

  return {
    popupRef,
    popupRootRef,
    closePopup,
    setupPopupAutoClose
  };
}
