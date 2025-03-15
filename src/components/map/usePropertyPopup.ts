
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
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
      popupElement.innerHTML = PropertyPopup({ 
        property, 
        onSave: onSaveProperty,
        onMessageOwner: onMessageOwner
      });

      popupElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickedElement = target.closest('[data-action]');
        
        if (clickedElement) {
          const action = clickedElement.getAttribute('data-action');
          
          if (action === 'save') {
            e.stopPropagation();
            const propertyId = Number(clickedElement.getAttribute('data-property-id'));
            onSaveProperty(propertyId);
          } else if (action === 'message') {
            e.stopPropagation();
            const ownerId = Number(clickedElement.getAttribute('data-owner-id'));
            onMessageOwner(ownerId);
          }
        } else {
          navigate(`/property/${property.id}`);
        }
      });
    }

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
