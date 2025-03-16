
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

export function useMapSetup() {
  console.log('useMapSetup hook called');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);
  const [mapboxAvailable, setMapboxAvailable] = useState<boolean>(true);
  
  // Add cleanup flag to prevent memory leaks
  const isMountedRef = useRef(true);

  // Check if mapboxgl is available at startup
  useEffect(() => {
    // Check if mapboxgl is globally available
    if (typeof mapboxgl === 'undefined' || !mapboxgl) {
      console.error('mapboxgl not available in the global scope');
      setMapboxAvailable(false);
      setMapError(new Error('Mapbox GL JS is not available. Please check your internet connection or try a different browser.'));
      return;
    }
    
    // Try to access a basic mapboxgl property to verify it's properly loaded
    try {
      const version = mapboxgl.version;
      console.log('Mapbox GL JS version:', version);
      setMapboxAvailable(true);
    } catch (e) {
      console.error('Error accessing mapboxgl:', e);
      setMapboxAvailable(false);
      setMapError(new Error('Mapbox GL JS failed to initialize properly. Please check your internet connection.'));
    }
  }, []);

  // Check for token in localStorage
  useEffect(() => {
    if (!mapboxAvailable) return;
    
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      try {
        mapboxgl.accessToken = savedToken;
        console.log('Using saved Mapbox token from localStorage');
      } catch (e) {
        console.error('Error setting Mapbox token from localStorage:', e);
      }
    } else if (!mapboxgl.accessToken || mapboxgl.accessToken.includes('undefined')) {
      try {
        // Fallback token - should be replaced with user's token
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtOGJoYnloaTF4ZXIyanIzcXkzdWRtY2UifQ.B_Yp40YHJP7UQeaPdBofaQ';
        console.log('Using fallback Mapbox token:', mapboxgl.accessToken);
      } catch (e) {
        console.error('Error setting Mapbox token:', e);
        setMapError(new Error('Invalid Mapbox token. Please provide a valid token.'));
      }
    }
  }, [mapboxAvailable]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (map.current) {
        console.log('Cleaning up map instance on unmount');
        try {
          map.current.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
        map.current = null;
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    console.log('useMapSetup effect running');
    console.log('Map container exists:', !!mapContainer.current);
    console.log('Map instance exists:', !!map.current);
    console.log('Mapbox available:', mapboxAvailable);
    
    if (!mapContainer.current || map.current || !mapboxAvailable) {
      console.log('Skipping map initialization - container not ready, map already initialized, or mapbox not available');
      return;
    }

    // Check if a valid token exists
    if (!mapboxgl.accessToken || 
        mapboxgl.accessToken === 'undefined' || 
        mapboxgl.accessToken.includes('undefined')) {
      setMapError(new Error('Mapbox token is missing or invalid. Please provide a valid token.'));
      return;
    }

    try {
      console.log('Initializing map with token:', mapboxgl.accessToken);
      
      // Create the map instance with error handling
      try {
        // Use a try-catch with a timeout to handle potential mapbox initialization issues
        const initMapWithTimeout = () => {
          return new Promise<mapboxgl.Map>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('Map initialization timed out. Please check your internet connection.'));
            }, 10000); // 10 seconds timeout
            
            try {
              const mapInstance = new mapboxgl.Map({
                container: mapContainer.current!,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [3.042048, 36.752887], // Default center (Algiers)
                zoom: 12,
                attributionControl: false,
                failIfMajorPerformanceCaveat: false, // Helps with some devices
                transformRequest: (url, resourceType) => {
                  console.log(`Loading resource: ${resourceType} - ${url}`);
                  return { url };
                }
              });
              
              clearTimeout(timeoutId);
              resolve(mapInstance);
            } catch (err) {
              clearTimeout(timeoutId);
              reject(err);
            }
          });
        };
        
        // Initialize the map with timeout handling
        initMapWithTimeout()
          .then(mapInstance => {
            map.current = mapInstance;
            console.log('Map instance created successfully');
            
            // Add controls with error handling
            try {
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
              
              console.log('Map controls added successfully');
            } catch (controlError) {
              console.error('Error adding map controls:', controlError);
              // Continue even if controls fail - not critical
            }

            // Set map loaded state when the map is ready
            map.current.on('load', () => {
              console.log('Map loaded successfully');
              if (isMountedRef.current) {
                setMapLoaded(true);
                setMapError(null); // Clear any previous errors
              }
            });

            // Handle map error
            map.current.on('error', (e) => {
              console.error('Map error:', e);
              if (isMountedRef.current) {
                setMapError(e.error || new Error('Unknown map error'));
              }
            });
          })
          .catch(err => {
            console.error('Error initializing map with timeout:', err);
            setMapError(err instanceof Error ? err : new Error(String(err)));
          });
        
      } catch (mapInitError) {
        console.error('Error initializing Mapbox map:', mapInitError);
        setMapError(mapInitError instanceof Error ? mapInitError : new Error(String(mapInitError)));
      }
    } catch (error) {
      console.error('Error in map setup effect:', error);
      setMapError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [mapboxAvailable]);

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    mapError,
    mapboxAvailable
  };
}
