
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

    // Only close popup on very specific events, not on map clicks
    // This prevents unwanted zoom resets when clicking on the map
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
    
    // Add a specific close button listener
    const closeButton = document.createElement('button');
    closeButton.className = 'popup-close-button';
    closeButton.innerHTML = '×';
    closeButton.style.cssText = 'position:absolute;top:5px;right:5px;background:white;border-radius:50%;width:22px;height:22px;border:none;cursor:pointer;font-size:16px;z-index:10;';
    
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
        setActiveMarkerId(null);
        updateMarkerZIndex(null);
      }
    });
    
    // Add the close button to the popup
    const popupContainer = document.querySelector('.property-popup-container');
    if (popupContainer) {
      popupContainer.appendChild(closeButton);
    }
    
  }, [map, navigate, updateMarkerZIndex, setActiveMarkerId, handleSaveProperty, handleMessageOwner]);

  return { popupRef, showPropertyPopup };
}
