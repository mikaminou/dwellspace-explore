
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

export function useMapCreation({
  mapContainer,
  map,
  mapboxAvailable,
  setMapLoaded,
  setMapError,
  isMountedRef
}: {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
  mapboxAvailable: boolean;
  setMapLoaded: (loaded: boolean) => void;
  setMapError: (error: Error | null) => void;
  isMountedRef: React.MutableRefObject<boolean>;
}) {
  // Initialize map
  useEffect(() => {
    console.log('useMapCreation effect running');
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
  }, [mapboxAvailable, mapContainer, map, setMapLoaded, setMapError, isMountedRef]);
}
