
import { useRef } from 'react';
import { Property } from '@/api/properties';

export function usePropertyPopup({
  map,
  onSaveProperty,
  onMessageOwner,
  navigate
}: {
  map: React.MutableRefObject<any | null>;
  onSaveProperty: (propertyId: number) => void;
  onMessageOwner: (ownerId: number) => void;
  navigate: (path: string) => void;
}) {
  const popupRef = useRef<any | null>(null);
  
  // Simplified no-op function that matches the signature but doesn't use mapbox
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    console.log('Map feature disabled: showPropertyPopup called with property', property.id);
    setActiveMarkerId(property.id);
    // No actual popup shown
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
