
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
  
  console.log(`[MarkerRenderer] Starting to render marker for property ${property.id} at ${coordinates.lat}, ${coordinates.lng}`);
  
  // Create a DOM element for the marker
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker-container';
  markerEl.style.zIndex = '1000'; // Very high z-index
  markerEl.style.position = 'relative';
  markerEl.style.cursor = 'pointer';
  markerEl.style.pointerEvents = 'auto';
  markerEl.style.backgroundColor = 'transparent'; // Debug styling
  markerEl.style.width = '150px'; // Debug styling
  markerEl.style.height = '40px'; // Debug styling
  
  console.log(`[MarkerRenderer] Created marker DOM element for property ${property.id}`, markerEl);
  
  // Create the mapbox marker with specific options
  const marker = new mapboxgl.Marker({
    element: markerEl,
    anchor: 'bottom',
    offset: [0, 0]
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);

  console.log(`[MarkerRenderer] Added Mapbox marker to map for property ${property.id}`, marker);

  // Create a separate container for the React component
  const reactContainer = document.createElement('div');
  reactContainer.className = 'marker-react-container';
  reactContainer.style.pointerEvents = 'auto';
  reactContainer.style.zIndex = '1001'; // Very high z-index
  reactContainer.style.position = 'relative';
  reactContainer.style.cursor = 'pointer';
  reactContainer.style.backgroundColor = 'transparent'; // Debug styling
  markerEl.appendChild(reactContainer);
  
  console.log(`[MarkerRenderer] Created React container for property ${property.id}`, reactContainer);
  
  try {
    // Create React root and render the component
    const root = ReactDOM.createRoot(reactContainer);
    console.log(`[MarkerRenderer] Created React root for property ${property.id}`);
    
    // Render the PropertyMarker component
    root.render(
      <PropertyMarker 
        price={property.price || 'N/A'}
        propertyType={property.type || undefined}
        beds={property.beds}
        baths={property.baths || undefined}
        area={property.living_area || undefined}
        onClick={() => {
          console.log(`[MarkerRenderer] Marker clicked for property: ${property.id}`);
          onMarkerClick(property, [coordinates.lng, coordinates.lat]);
        }}
      />
    );

    console.log(`[MarkerRenderer] Successfully rendered React marker for property ${property.id}`);
    
    // DEBUG: Check if the marker element is visible in the DOM
    setTimeout(() => {
      const markerElements = document.querySelectorAll('.custom-marker-container');
      console.log(`[MarkerRenderer] Total marker elements in DOM: ${markerElements.length}`);
      
      const priceElements = document.querySelectorAll('.price-bubble');
      console.log(`[MarkerRenderer] Total price bubble elements in DOM: ${priceElements.length}`);
      
      // Check computed styles
      if (markerElements.length > 0) {
        const firstMarker = markerElements[0] as HTMLElement;
        const computedStyle = window.getComputedStyle(firstMarker);
        console.log(`[MarkerRenderer] First marker computed style:`, {
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          zIndex: computedStyle.zIndex,
          position: computedStyle.position,
          opacity: computedStyle.opacity
        });
      }
    }, 1000);
  } catch (renderError) {
    console.error(`[MarkerRenderer] Error rendering React marker for property ${property.id}:`, renderError);
    
    // Fallback to simple HTML marker if React rendering fails
    const fallbackMarker = document.createElement('div');
    fallbackMarker.className = 'bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
    fallbackMarker.innerText = property.price ? `$${Number(property.price).toLocaleString()}` : 'N/A';
    fallbackMarker.style.pointerEvents = 'auto';
    fallbackMarker.style.zIndex = '2000'; // Very high z-index for fallback
    fallbackMarker.style.position = 'relative';
    markerEl.appendChild(fallbackMarker);
    
    console.log(`[MarkerRenderer] Created fallback HTML marker for property ${property.id}`);
    
    fallbackMarker.addEventListener('click', () => {
      onMarkerClick(property, [coordinates.lng, coordinates.lat]);
    });
  }

  return marker;
};
