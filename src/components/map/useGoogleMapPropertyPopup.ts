
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
  const showPropertyPopup = useCallback((property: Property, marker: google.maps.Marker) => {
    if (!map.current || !window.google) return;
    
    if (popupRef.current) {
      popupRef.current.close();
      popupRef.current = null;
    }

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    // Create popup content
    const content = document.createElement('div');
    content.id = `property-popup-${property.id}`;
    content.className = 'property-popup';
    content.innerHTML = PropertyPopup({ 
      property, 
      onSave: handleSaveProperty,
      onMessageOwner: handleMessageOwner
    });

    // Create the info window
    popupRef.current = new google.maps.InfoWindow({
      content,
      maxWidth: 320,
      ariaLabel: property.title,
      pixelOffset: new google.maps.Size(0, -10)
    });

    // Open the info window
    popupRef.current.open({
      map: map.current,
      anchor: marker,
      shouldFocus: false,
    });

    // Add event listeners to the popup content
    content.addEventListener('click', (e) => {
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

    // Close popup when map is dragged
    google.maps.event.addListenerOnce(map.current, 'dragstart', () => {
      if (popupRef.current) {
        popupRef.current.close();
        popupRef.current = null;
        setActiveMarkerId(null);
        updateMarkerZIndex(null);
      }
    });
    
  }, [map, navigate, updateMarkerZIndex, setActiveMarkerId, handleSaveProperty, handleMessageOwner]);

  return { popupRef, showPropertyPopup };
}
