
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
    
    console.log('Initializing map setup...'); // Debug log
    
    let mapboxgl: any;
    let isMounted = true;

    // Delay map initialization to ensure DOM and libraries are ready
    const initMap = async () => {
      try {
        // Wait for DOM to be fully ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (!isMounted) return;
        
        // Try to find mapboxgl on window first
        if (typeof window !== 'undefined' && window.mapboxgl) {
          console.log('Using mapboxgl from window');
          mapboxgl = window.mapboxgl;
        } else {
          // Dynamically import mapbox-gl if not available on window
          try {
            console.log('Importing mapbox-gl dynamically...');
            const mapboxModule = await import('mapbox-gl');
            mapboxgl = mapboxModule.default;
            
            // Make mapboxgl available on window
            if (typeof window !== 'undefined') {
              window.mapboxgl = mapboxgl;
            }
          } catch (importError) {
            console.error('Error importing mapbox-gl:', importError);
            if (isMounted) {
              setMapError(importError instanceof Error ? importError : new Error(String(importError)));
              toast.error('Failed to load map library');
            }
            return;
          }
        }

        // Verify mapboxgl was loaded successfully
        if (!mapboxgl) {
          const error = new Error('mapbox-gl not available after import');
          console.error(error);
          if (isMounted) {
            setMapError(error);
            toast.error('Map library could not be loaded');
          }
          return;
        }

        try {
          // Set the access token
          mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
          console.log('Initializing map with token:', MAPBOX_ACCESS_TOKEN.substring(0, 10) + '...');
          
          if (!mapContainer.current || !isMounted) return;
          
          // Create the map instance
          console.log('Creating map instance...');
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [3.042048, 36.752887], // Default center (Algiers)
            zoom: 12,
            attributionControl: false,
            failIfMajorPerformanceCaveat: false, // Helps with some devices
            preserveDrawingBuffer: true // Helps with screenshots and exports
          });

          console.log('Map instance created');

          // Add map controls after map is created
          if (map.current) {
            // Set up load handler first to catch early events
            map.current.on('load', () => {
              console.log('Map loaded successfully');
              if (isMounted) {
                setMapLoaded(true);
              }
            });

            // Add error handler early
            map.current.on('error', (e: any) => {
              console.error('Map error:', e);
              if (isMounted) {
                setMapError(e.error || new Error('Unknown map error'));
                toast.error('There was a problem loading the map');
              }
            });

            console.log('Adding map controls...');
            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            map.current.addControl(new mapboxgl.FullscreenControl());
            map.current.addControl(new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              trackUserLocation: true
            }));

            // Add attribution control
            map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
            
            console.log('Map controls added');
          }
        } catch (initError) {
          console.error('Error in map initialization:', initError);
          if (isMounted) {
            setMapError(initError instanceof Error ? initError : new Error(String(initError)));
            toast.error('Failed to initialize map');
          }
        }
      } catch (error) {
        console.error('Error in mapbox setup:', error);
        if (isMounted) {
          setMapError(error instanceof Error ? error : new Error(String(error)));
          toast.error('Failed to setup map');
        }
      }
    };
    
    // Start initialization
    initMap();
    
    // Clean up on unmount
    return () => {
      isMounted = false;
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
