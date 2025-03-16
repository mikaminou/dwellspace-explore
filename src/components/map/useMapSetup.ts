
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

    // Create the map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Updated to latest style
      center: [3.042048, 36.752887], // Default center (Algiers)
      zoom: 12,
      attributionControl: false,
      pitchWithRotate: true, // Enable pitch with rotate
      antialias: true // Enable antialiasing for smoother rendering
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: true // Show accuracy circle
    }));

    // Add attribution control in the bottom-right
    map.current.addControl(new mapboxgl.AttributionControl({
      customAttribution: 'Property Listings'
    }), 'bottom-right');

    // Set map loaded state when the map is ready
    map.current.on('load', () => {
      console.log('Map loaded successfully with Mapbox GL version:', mapboxgl.version);
      setMapLoaded(true);
    });

    // Handle map error
    map.current.on('error', (e) => {
      console.error('Map error:', e);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        console.log('Cleaning up map instance');
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
