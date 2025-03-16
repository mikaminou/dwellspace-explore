
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

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
      antialias: true, // Enable antialiasing for smoother rendering
      projection: { name: 'mercator' }, // Use mercator projection for consistency
      minZoom: 2, // Prevent zooming out too far to maintain visual consistency
      maxZoom: 18 // Limit maximum zoom to maintain performance
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
      
      // Add consistent fog effect to maintain visual style at all zoom levels
      map.current?.setFog({
        'color': 'rgb(220, 230, 240)', // Light blue fog color
        'high-color': 'rgb(36, 92, 223)', // Darker blue for higher areas
        'horizon-blend': 0.1, // Subtle horizon blend
        'space-color': 'rgb(11, 11, 25)', // Dark space color
        'star-intensity': 0.15 // Subtle stars in the background
      });
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
