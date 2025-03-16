
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PropertyMarker } from './PropertyMarker';
import { Property } from '@/api/properties';
import mapboxgl from 'mapbox-gl';

interface MarkerRenderOptions {
  property: Property;
  coordinates: { lng: number; lat: number };
  onMarkerClick: (property: Property, coordinates: [number, number]) => void;
}

export const renderPropertyMarker = (
  options: MarkerRenderOptions, 
  map: mapboxgl.Map
): mapboxgl.Marker => {
  const { property, coordinates, onMarkerClick } = options;
  
  // Create a container element for the marker
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker-container';
  
  // Create the mapbox marker with specific z-index
  const marker = new mapboxgl.Marker({
    element: markerEl,
    anchor: 'bottom',
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);

  // Set a high z-index to ensure visibility
  markerEl.style.zIndex = '10';
  
  // Create a separate container for the React component
  const reactContainer = document.createElement('div');
  reactContainer.className = 'marker-react-container';
  markerEl.appendChild(reactContainer);
  
  try {
    // Create React root and render the component
    const root = ReactDOM.createRoot(reactContainer);
    
    // Render the PropertyMarker component
    root.render(
      <PropertyMarker 
        price={property.price || 'N/A'}
        propertyType={property.type || undefined}
        beds={property.beds}
        baths={property.baths || undefined}
        area={property.living_area || undefined}
        onClick={() => {
          onMarkerClick(property, [coordinates.lng, coordinates.lat]);
        }}
      />
    );
  } catch (renderError) {
    console.error(`Error rendering React marker for property ${property.id}:`, renderError);
    
    // Fallback to simple HTML marker if React rendering fails
    const fallbackMarker = document.createElement('div');
    fallbackMarker.className = 'bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
    fallbackMarker.innerText = property.price || 'N/A';
    markerEl.appendChild(fallbackMarker);
    
    fallbackMarker.addEventListener('click', () => {
      onMarkerClick(property, [coordinates.lng, coordinates.lat]);
    });
  }

  return marker;
};
