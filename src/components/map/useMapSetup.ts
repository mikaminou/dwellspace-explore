
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';

// Default Mapbox token - users should replace this with their own
mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtOGJoYnloaTF4ZXIyanIzcXkzdWRtY2UifQ.B_Yp40YHJP7UQeaPdBofaQ';

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create the map instance with optimized settings for performance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [3.042048, 36.752887], // Default center (Algiers)
      zoom: 12,
      attributionControl: false,
      renderWorldCopies: false,
      fadeDuration: 0,
      maxZoom: 16,
      minZoom: 5,
      trackResize: true,
      maxBounds: [[-20, 15], [40, 40]], // Restrict to North Africa region
      antialias: true
    });

    // Add only essential controls to improve performance
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: false
    }), 'top-right');
    
    // Add attribution control in the bottom-right
    map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

    // Set map loaded state when the map is ready
    map.current.on('load', () => {
      console.log('Map loaded successfully');
      setMapLoaded(true);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded
  };
}
