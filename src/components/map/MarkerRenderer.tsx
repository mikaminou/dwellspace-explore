
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
  
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker-container';
  
  const marker = new mapboxgl.Marker({
    element: markerEl,
    anchor: 'bottom',
    offset: [0, 0],
    clickTolerance: 10
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);

  // Render React component for the marker
  try {
    const markerContainer = document.createElement('div');
    markerEl.appendChild(markerContainer);
    
    // Create root for React 18
    const root = ReactDOM.createRoot(markerContainer);
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
    
    // Fallback to simple HTML marker
    const priceElement = document.createElement('div');
    priceElement.className = 'bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
    priceElement.innerText = property.price || 'N/A';
    markerEl.appendChild(priceElement);
    
    priceElement.addEventListener('click', () => {
      onMarkerClick(property, [coordinates.lng, coordinates.lat]);
    });
  }

  return marker;
};
