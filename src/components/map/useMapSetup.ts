
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { Property } from '@/api/properties';

// Default Mapbox token - users should replace this with their own
mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtODZlMWQ3ZDAzeGcyaXNlemlmd2hyeDUifQ.ExxxOcYTr6vkVwBw6J_CYA';

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  // Initialize map only once
  useEffect(() => {
    // Debugging
    console.log('useMapSetup: Initializing map effect');
    
    if (!mapContainer.current || map.current) {
      console.log('useMapSetup: Skipping initialization - map already exists or container not ready');
      return;
    }

    try {
      console.log('Initializing map with token:', mapboxgl.accessToken.substring(0, 10) + '...');
      
      // Check if mapboxgl is available
      if (!mapboxgl) {
        console.error('Mapbox GL JS is not available');
        throw new Error('Mapbox GL JS is not available');
      }
      
      // Create the map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [3.042048, 36.752887], // Default center (Algiers)
        zoom: 12,
        attributionControl: false,
        failIfMajorPerformanceCaveat: false // Helps with some devices
      });

      console.log('useMapSetup: Map instance created');

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
      });

      // Handle map error
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(e.error || new Error('Unknown map error'));
        toast.error('There was a problem loading the map');
      });

      // Clean up on unmount
      return () => {
        console.log('useMapSetup: Cleaning up map instance');
        if (map.current) {
          try {
            map.current.remove();
          } catch (error) {
            console.error('Error removing map:', error);
          }
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(error instanceof Error ? error : new Error(String(error)));
      toast.error('Failed to initialize map');
    }
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
