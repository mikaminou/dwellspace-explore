
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
  
  // Create a DOM element for the marker
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker-container';
  markerEl.style.zIndex = '100'; // Explicitly set high z-index
  markerEl.style.position = 'relative';
  markerEl.style.cursor = 'pointer';
  markerEl.style.pointerEvents = 'auto';
  
  // Create the mapbox marker with specific options
  const marker = new mapboxgl.Marker({
    element: markerEl,
    anchor: 'bottom',
    offset: [0, 0]
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);

  // Create a separate container for the React component
  const reactContainer = document.createElement('div');
  reactContainer.className = 'marker-react-container';
  reactContainer.style.pointerEvents = 'auto';
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
          console.log('Marker clicked for property:', property.id);
          onMarkerClick(property, [coordinates.lng, coordinates.lat]);
        }}
      />
    );

    // Add debug element to verify marker is created
    console.log(`Marker created for property ${property.id} at ${coordinates.lat}, ${coordinates.lng}`);
  } catch (renderError) {
    console.error(`Error rendering React marker for property ${property.id}:`, renderError);
    
    // Fallback to simple HTML marker if React rendering fails
    const fallbackMarker = document.createElement('div');
    fallbackMarker.className = 'bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
    fallbackMarker.innerText = property.price ? `$${Number(property.price).toLocaleString()}` : 'N/A';
    fallbackMarker.style.pointerEvents = 'auto';
    markerEl.appendChild(fallbackMarker);
    
    fallbackMarker.addEventListener('click', () => {
      onMarkerClick(property, [coordinates.lng, coordinates.lat]);
    });
  }

  return marker;
};
