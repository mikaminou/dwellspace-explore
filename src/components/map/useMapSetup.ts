
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { Property } from '@/api/properties';

// Default Mapbox token - this should be replaced with a valid token
// Users should create their own token at https://account.mapbox.com/
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtOGJoYnloaTF4ZXIyanIzcXkzdWRtY2UifQ.B_Yp40YHJP7UQeaPdBofaQ';

// Use the token
mapboxgl.accessToken = MAPBOX_TOKEN;

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Initializing map with token:', mapboxgl.accessToken);
      
      // Create the map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Using a more recent style
        center: [3.042048, 36.752887], // Default center (Algiers)
        zoom: 12,
        attributionControl: false,
        failIfMajorPerformanceCaveat: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl());
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));

      // Add attribution control in the bottom-right
      map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

      // Set map loaded state when the map is ready
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      });

      // Handle map error
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(e.error?.message || 'An error occurred while loading the map');
        toast.error('Map error: ' + (e.error?.message || 'Unknown error'));
      });

      // Handle style loading error
      map.current.on('styledata', () => {
        const loaded = map.current?.isStyleLoaded();
        console.log('Map style loaded:', loaded);
        if (!loaded) {
          console.log('Retrying style load...');
          setTimeout(() => {
            map.current?.setStyle('mapbox://styles/mapbox/streets-v12');
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
      toast.error('Failed to initialize map');
    }

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
    mapLoaded,
    mapError
  };
}
