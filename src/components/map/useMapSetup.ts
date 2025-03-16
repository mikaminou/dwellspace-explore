
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { Property } from '@/api/properties';

// Default Mapbox token - users should replace this with their own
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtOGJoYnloaTF4ZXIyanIzcXkzdWRtY2UifQ.B_Yp40YHJP7UQeaPdBofaQ';

// Set token explicitly before any map is created
if (mapboxgl) {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
}

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Verify that mapboxgl is available
      if (!mapboxgl) {
        console.error('Mapbox GL JS is not available');
        setMapError(new Error('Mapbox GL JS is not properly loaded'));
        return;
      }

      // Ensure access token is set
      if (!mapboxgl.accessToken) {
        console.warn('Setting default Mapbox access token');
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      }
      
      console.log('Initializing map with token:', mapboxgl.accessToken);
      
      // Create the map instance with safe default values
      // Defer map creation to the next tick to ensure DOM is ready
      setTimeout(() => {
        try {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [3.042048, 36.752887], // Default center (Algiers)
            zoom: 12,
            attributionControl: false,
            failIfMajorPerformanceCaveat: false // Helps with some devices
          });

          // Safely add controls after ensuring map is created
          if (map.current) {
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
          }
        } catch (initError) {
          console.error('Error in map initialization:', initError);
          setMapError(initError instanceof Error ? initError : new Error(String(initError)));
          toast.error('Failed to initialize map');
        }
      }, 0);

      // Clean up on unmount
      return () => {
        if (map.current) {
          console.log('Cleaning up map instance');
          map.current.remove();
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
