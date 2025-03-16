
import { useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';

export function usePropertyPopup(
  map: React.MutableRefObject<mapboxgl.Map | null>,
  updateMarkerZIndex: (propertyId: number | null) => void,
  setActiveMarkerId: (id: number | null) => void
) {
  const navigate = useNavigate();
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Handle property save
  const handleSaveProperty = useCallback((propertyId: number) => {
    console.log('Saving property:', propertyId);
    toast.success('Property saved to favorites');
  }, []);

  // Handle message to owner
  const handleMessageOwner = useCallback((ownerId: number) => {
    console.log('Messaging owner:', ownerId);
    toast.success('Message panel opened');
  }, []);

  // Show property popup
  const showPropertyPopup = useCallback((property: Property, coordinates: [number, number]) => {
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
      className: 'property-popup-container',
      focusAfterOpen: false, // Don't focus the popup after opening to prevent unintended keyboard interactions
      anchor: 'bottom', // Position the popup below the point
      offset: [0, -10] // Slight offset to position it better
    })
      .setLngLat(coordinates)
      .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
      .addTo(map.current);

    const popupElement = document.getElementById(`property-popup-${property.id}`);
    if (popupElement) {
      popupElement.innerHTML = PropertyPopup({ 
        property, 
        onSave: handleSaveProperty,
        onMessageOwner: handleMessageOwner
      });

      popupElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickedElement = target.closest('[data-action]');
        
        if (clickedElement) {
          const action = clickedElement.getAttribute('data-action');
          
          if (action === 'save') {
            e.stopPropagation();
            const propertyId = Number(clickedElement.getAttribute('data-property-id'));
            handleSaveProperty(propertyId);
          } else if (action === 'message') {
            e.stopPropagation();
            const ownerId = Number(clickedElement.getAttribute('data-owner-id'));
            handleMessageOwner(ownerId);
          }
        } else {
          // Navigate to property details without removing the popup first
          e.preventDefault();
          e.stopPropagation();
          navigate(`/property/${property.id}`);
        }
      });
    }

    // Close popup on map interactions
    ['dragstart'].forEach(event => {
      map.current?.once(event, () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
          setActiveMarkerId(null);
          updateMarkerZIndex(null);
        }
      });
    });
    
    // Removed the custom close button code that was here
  }, [map, navigate, updateMarkerZIndex, setActiveMarkerId, handleSaveProperty, handleMessageOwner]);

  return { popupRef, showPropertyPopup };
}
