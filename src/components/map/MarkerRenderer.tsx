
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
  markerEl.className = 'custom-marker-container';
  markerEl.style.zIndex = '9999'; // Extremely high z-index
  markerEl.style.position = 'absolute';
  markerEl.style.cursor = 'pointer';
  markerEl.style.pointerEvents = 'auto';
  markerEl.style.visibility = 'visible';
  markerEl.style.opacity = '1';
  markerEl.style.display = 'block';
  markerEl.style.width = '150px'; // Wider for visibility
  markerEl.style.height = '50px'; // Taller for visibility
  markerEl.style.backgroundColor = 'transparent';
  
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

  // Create a separate container for the React component with EXTREME visibility settings
  const reactContainer = document.createElement('div');
  reactContainer.className = 'marker-react-container';
  reactContainer.style.pointerEvents = 'auto';
  reactContainer.style.zIndex = '10000'; // Very high z-index
  reactContainer.style.position = 'relative';
  reactContainer.style.cursor = 'pointer';
  reactContainer.style.visibility = 'visible';
  reactContainer.style.opacity = '1';
  reactContainer.style.display = 'block';
  reactContainer.style.backgroundColor = 'transparent';
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
      
      // Force check visibility again after 5 seconds (to catch any delayed issues)
      setTimeout(() => {
        const markersAfterDelay = document.querySelectorAll('.mapboxgl-marker');
        console.log(`[MarkerRenderer] Markers after 5s delay: ${markersAfterDelay.length}`);
        
        if (markersAfterDelay.length > 0) {
          console.log('[MarkerRenderer] Marker positions after 5s:');
          markersAfterDelay.forEach((marker, index) => {
            const rect = marker.getBoundingClientRect();
            console.log(`Marker ${index}: left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`);
          });
        }
      }, 5000);
    }, 1000);
  } catch (renderError) {
    console.error(`[MarkerRenderer] Error rendering React marker for property ${property.id}:`, renderError);
    
    // Fallback to simple HTML marker with EXTREME visibility settings
    const fallbackMarker = document.createElement('div');
    fallbackMarker.className = 'fallback-price-bubble';
    fallbackMarker.innerText = property.price ? `$${Number(property.price).toLocaleString()}` : 'N/A';
    fallbackMarker.style.backgroundColor = 'red';
    fallbackMarker.style.color = 'white';
    fallbackMarker.style.padding = '10px 15px';
    fallbackMarker.style.borderRadius = '30px';
    fallbackMarker.style.fontWeight = 'bold';
    fallbackMarker.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    fallbackMarker.style.border = '2px solid white';
    fallbackMarker.style.zIndex = '10000';
    fallbackMarker.style.position = 'relative';
    fallbackMarker.style.pointerEvents = 'auto';
    fallbackMarker.style.cursor = 'pointer';
    fallbackMarker.style.visibility = 'visible';
    fallbackMarker.style.opacity = '1';
    fallbackMarker.style.display = 'block';
    markerEl.appendChild(fallbackMarker);
    
    console.log(`[MarkerRenderer] Created fallback HTML marker for property ${property.id}`);
    
    fallbackMarker.addEventListener('click', () => {
      onMarkerClick(property, [coordinates.lng, coordinates.lat]);
    });
  }

  return marker;
};
