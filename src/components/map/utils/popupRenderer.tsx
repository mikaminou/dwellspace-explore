
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { PropertyPopup } from '../PropertyPopup';

// Creates and renders a React component into a Mapbox popup
export const renderPopupContent = (
  property: Property,
  popupElement: HTMLElement,
  popupRootRef: React.MutableRefObject<Record<number, any>>,
  options: {
    onSaveProperty: (propertyId: number) => void;
    onMessageOwner: (ownerId: number) => void;
    navigate: (path: string) => void;
  }
) => {
  try {
    // Create a root using React 18's createRoot API
    const root = createRoot(popupElement);
    popupRootRef.current[property.id] = root;
    
    root.render(
      <PropertyPopup 
        property={property} 
        onSave={options.onSaveProperty}
        onMessageOwner={options.onMessageOwner}
        onClick={() => options.navigate(`/property/${property.id}`)}
      />
    );
    
    return true;
  } catch (error) {
    console.error('Error rendering property popup:', error);
    return false;
  }
};

// Creates a Mapbox popup at the given coordinates
export const createPropertyPopup = (
  map: mapboxgl.Map,
  property: Property,
  coordinates: [number, number]
): mapboxgl.Popup => {
  const popup = new mapboxgl.Popup({ 
    closeOnClick: false,
    closeButton: false,
    maxWidth: '320px',
    className: 'property-popup-container'
  })
    .setLngLat(coordinates)
    .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
    .addTo(map);

  return popup;
};
