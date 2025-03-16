
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
  
  // Create a DOM element for the marker with EXTREME visibility settings
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker-container debug-marker'; // Add debug class
  markerEl.style.zIndex = '99999'; // Ultra high z-index
  markerEl.style.position = 'absolute';
  markerEl.style.cursor = 'pointer';
  markerEl.style.pointerEvents = 'auto';
  markerEl.style.visibility = 'visible';
  markerEl.style.opacity = '1';
  markerEl.style.display = 'block';
  markerEl.style.width = '200px'; // Much wider for visibility
  markerEl.style.height = '100px'; // Much taller for visibility
  markerEl.style.backgroundColor = 'rgba(255,0,0,0.2)'; // Add background for debugging
  markerEl.style.border = '3px dashed red'; // Add border for debugging
  
  console.log(`[MarkerRenderer] Created marker DOM element for property ${property.id}`, markerEl);
  
  // Create the mapbox marker with specific options
  const marker = new mapboxgl.Marker({
    element: markerEl,
    anchor: 'bottom',
    offset: [0, 0],
    pitchAlignment: 'auto',
    rotation: 0,
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);

  console.log(`[MarkerRenderer] Added Mapbox marker to map for property ${property.id}`, marker);

  // Create a separate container for the React component with EXTREME visibility settings
  const reactContainer = document.createElement('div');
  reactContainer.className = 'marker-react-container debug-marker'; // Add debug class
  reactContainer.style.pointerEvents = 'auto';
  reactContainer.style.zIndex = '99999'; // Very high z-index
  reactContainer.style.position = 'relative';
  reactContainer.style.cursor = 'pointer';
  reactContainer.style.visibility = 'visible';
  reactContainer.style.opacity = '1';
  reactContainer.style.display = 'block';
  reactContainer.style.backgroundColor = 'rgba(0,255,0,0.2)'; // Add background for debugging
  reactContainer.style.border = '3px dashed green'; // Add border for debugging
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
    
    // Add a delay to check marker visibility after rendering is complete
    setTimeout(() => {
      // Force marker element to be visible by adding direct styles to override any CSS
      if (markerEl.parentElement) {
        const parentEl = markerEl.parentElement;
        parentEl.style.display = 'block';
        parentEl.style.visibility = 'visible';
        parentEl.style.opacity = '1';
        parentEl.style.zIndex = '99999';
        
        // Log parent element details
        console.log(`[MarkerRenderer] Marker parent element for property ${property.id}:`, parentEl);
        
        const rect = parentEl.getBoundingClientRect();
        console.log(`[MarkerRenderer] Marker parent position for property ${property.id}:`, {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        });
      }
      
      // Check if mapboxgl-markers-container exists and force its visibility
      const markersContainer = document.querySelector('.mapboxgl-markers');
      if (markersContainer instanceof HTMLElement) {
        markersContainer.style.display = 'block';
        markersContainer.style.visibility = 'visible';
        markersContainer.style.opacity = '1';
        markersContainer.style.zIndex = '99999';
        console.log('[MarkerRenderer] Applied visibility fixes to mapboxgl-markers container');
      }
    }, 1000);
    
  } catch (renderError) {
    console.error(`[MarkerRenderer] Error rendering React marker for property ${property.id}:`, renderError);
    
    // Fallback to simple HTML marker with EXTREME visibility settings
    const fallbackMarker = document.createElement('div');
    fallbackMarker.className = 'fallback-price-bubble debug-marker'; // Add debug class
    fallbackMarker.innerText = property.price ? `$${Number(property.price).toLocaleString()}` : 'N/A';
    fallbackMarker.style.backgroundColor = 'red';
    fallbackMarker.style.color = 'white';
    fallbackMarker.style.padding = '15px 25px';
    fallbackMarker.style.borderRadius = '30px';
    fallbackMarker.style.fontWeight = 'bold';
    fallbackMarker.style.fontSize = '20px'; // Larger font
    fallbackMarker.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    fallbackMarker.style.border = '4px solid white';
    fallbackMarker.style.zIndex = '99999';
    fallbackMarker.style.position = 'relative';
    fallbackMarker.style.pointerEvents = 'auto';
    fallbackMarker.style.cursor = 'pointer';
    fallbackMarker.style.visibility = 'visible';
    fallbackMarker.style.opacity = '1';
    fallbackMarker.style.display = 'block';
    fallbackMarker.style.transform = 'scale(2.0)'; // Make it twice as large
    markerEl.appendChild(fallbackMarker);
    
    console.log(`[MarkerRenderer] Created fallback HTML marker for property ${property.id}`);
    
    fallbackMarker.addEventListener('click', () => {
      onMarkerClick(property, [coordinates.lng, coordinates.lat]);
    });
  }

  return marker;
};
