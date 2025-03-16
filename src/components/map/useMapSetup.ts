
import { useRef, useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from 'sonner';

// Default Mapbox token - users should replace this with their own
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtOGJoYnloaTF4ZXIyanIzcXkzdWRtY2UifQ.B_Yp40YHJP7UQeaPdBofaQ';

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const popupRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Delay map initialization to ensure DOM and libraries are ready
    const timer = setTimeout(() => {
      try {
        // Safely import mapboxgl
        import('mapbox-gl').then(mapboxgl => {
          try {
            // Ensure access token is set
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            
            console.log('Initializing map with token:', mapboxgl.accessToken);
            
            if (mapContainer.current) {
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
            }
          } catch (initError) {
            console.error('Error in map initialization:', initError);
            setMapError(initError instanceof Error ? initError : new Error(String(initError)));
            toast.error('Failed to initialize map');
          }
        }).catch(importError => {
          console.error('Error importing mapbox-gl:', importError);
          setMapError(importError);
        });
      } catch (error) {
        console.error('Error in mapbox setup:', error);
        setMapError(error instanceof Error ? error : new Error(String(error)));
        toast.error('Failed to setup map');
      }
    }, 500); // Delay to ensure DOM is ready
    
    // Clean up on unmount
    return () => {
      clearTimeout(timer);
      if (map.current) {
        console.log('Cleaning up map instance');
        try {
          map.current.remove();
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
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
