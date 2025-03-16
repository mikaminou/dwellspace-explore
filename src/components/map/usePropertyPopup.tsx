
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';
import React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';

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
  const popupNodeRef = useRef<HTMLDivElement | null>(null);
  
  // Clean up function
  const cleanupPopup = () => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  };
  
  // Ensure cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupPopup();
    };
  }, []);
  
  const showPropertyPopup = (
    property: Property, 
    coordinates: [number, number],
    setActiveMarkerId: (id: number | null) => void,
    updateMarkerZIndex: (id: number | null) => void
  ) => {
    if (!map.current) {
      console.log('Map not available');
      return;
    }

    try {
      // Clean up any existing popup
      cleanupPopup();
      
      // Update active marker state
      setActiveMarkerId(property.id);
      updateMarkerZIndex(property.id);
      
      // Create container for popup
      const popupNode = document.createElement('div');
      popupNodeRef.current = popupNode;
      
      // Create the popup
      popupRef.current = new mapboxgl.Popup({
        closeOnClick: false,
        closeButton: true,
        maxWidth: '320px',
        className: 'property-popup-container'
      })
        .setLngLat(coordinates)
        .setDOMContent(popupNode)
        .addTo(map.current);
      
      // Render React component to popup DOM node using plain React
      const popupContent = (
        <PropertyPopup 
          property={property} 
          onSave={onSaveProperty}
          onMessageOwner={onMessageOwner}
          onClick={() => navigate(`/property/${property.id}`)}
        />
      );
      
      // Use createRoot to render React component
      const root = createRoot(popupNode);
      root.render(popupContent);
      
      // Close popup and reset marker on map interaction
      ['dragstart', 'zoomstart', 'click'].forEach(event => {
        if (map.current) {
          map.current.once(event, () => {
            if (popupRef.current) {
              cleanupPopup();
              setActiveMarkerId(null);
              updateMarkerZIndex(null);
            }
          });
        }
      });
      
      // Close handler
      popupRef.current.on('close', () => {
        setActiveMarkerId(null);
        updateMarkerZIndex(null);
      });
      
    } catch (error) {
      console.error('Error showing property popup:', error);
      cleanupPopup();
      setActiveMarkerId(null);
      updateMarkerZIndex(null);
    }
  };

  return {
    popupRef,
    showPropertyPopup
  };
}
