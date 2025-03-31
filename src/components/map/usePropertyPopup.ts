
import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';

export function usePropertyPopup(
  map: React.MutableRefObject<google.maps.Map | null>,
  updateMarkerZIndex: (propertyId: number | null) => void,
  setActiveMarkerId: (id: number | null) => void
) {
  const navigate = useNavigate();
  const popupRef = useRef<google.maps.InfoWindow | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);

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
  const showPropertyPopup = useCallback((property: Property, position: google.maps.LatLng) => {
    if (!map.current) return;
    
    // Close any existing popup
    if (popupRef.current) {
      popupRef.current.close();
      popupRef.current = null;
    }

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    // Create popup element if it doesn't exist
    if (!popupElementRef.current) {
      popupElementRef.current = document.createElement('div');
      popupElementRef.current.className = 'property-popup-container';
    }

    // Update popup content
    popupElementRef.current.innerHTML = `<div id="property-popup-${property.id}" class="property-popup"></div>`;
    const popupContentElement = popupElementRef.current.querySelector(`#property-popup-${property.id}`);
    
    if (popupContentElement) {
      popupContentElement.innerHTML = PropertyPopup({ 
        property, 
        onSave: handleSaveProperty,
        onMessageOwner: handleMessageOwner
      });

      // Create info window if it doesn't exist
      if (!popupRef.current) {
        popupRef.current = new google.maps.InfoWindow({
          disableAutoPan: false,
          pixelOffset: new google.maps.Size(0, -10)
        });

        // Close popup on map click
        map.current.addListener('click', () => {
          if (popupRef.current) {
            popupRef.current.close();
            popupRef.current = null;
            setActiveMarkerId(null);
            updateMarkerZIndex(null);
          }
        });

        // Close popup on map drag
        map.current.addListener('dragstart', () => {
          if (popupRef.current) {
            popupRef.current.close();
            popupRef.current = null;
            setActiveMarkerId(null);
            updateMarkerZIndex(null);
          }
        });
      }

      // Set info window content and open it
      popupRef.current.setContent(popupElementRef.current);
      popupRef.current.setPosition(position);
      popupRef.current.open(map.current);

      // Add click event listeners to popup elements
      const popupElement = document.getElementById(`property-popup-${property.id}`);
      if (popupElement) {
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
            // Navigate to property details
            e.preventDefault();
            e.stopPropagation();
            navigate(`/property/${property.id}`);
          }
        });
      }
    }
  }, [map, navigate, updateMarkerZIndex, setActiveMarkerId, handleSaveProperty, handleMessageOwner]);

  return { popupRef, showPropertyPopup };
}
