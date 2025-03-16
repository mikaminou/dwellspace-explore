
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

// Default Mapbox token - users should replace this with their own
// Check if token exists and is valid
if (!mapboxgl.accessToken || mapboxgl.accessToken.includes('undefined')) {
  try {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNsbTlqaTdxejExbmozcnBpdnU5bDNqd3gifQ.8fRJBmQTgZBCBeZrHtYNcw';
    console.log('Using fallback Mapbox token:', mapboxgl.accessToken);
  } catch (e) {
    console.error('Error setting Mapbox token:', e);
  }
}

// Check for Mapbox GL JS availability
try {
  console.log('Checking Mapbox GL JS availability');
  console.log('mapboxgl version:', mapboxgl.version);
} catch (e) {
  console.error('Error accessing mapboxgl:', e);
}

export function useMapSetup() {
  console.log('useMapSetup hook called');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(null);
  
  // Add cleanup flag to prevent memory leaks
  const isMountedRef = useRef(true);

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
    
    if (!mapContainer.current || map.current) {
      console.log('Skipping map initialization - container not ready or map already initialized');
      return;
    }

    // Check if mapboxgl is available
    if (!window.mapboxgl) {
      console.error('mapboxgl not available on window object');
      setMapError(new Error('Mapbox GL JS is not available. Please check your internet connection.'));
      return;
    }

    try {
      console.log('Initializing map with token:', mapboxgl.accessToken);
      
      // Create the map instance with error handling
      try {
        // Create the map instance
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [3.042048, 36.752887], // Default center (Algiers)
          zoom: 12,
          attributionControl: false,
          failIfMajorPerformanceCaveat: false // Helps with some devices
        });
        
        console.log('Map instance created successfully');
      } catch (mapInitError) {
        console.error('Error initializing Mapbox map:', mapInitError);
        setMapError(mapInitError instanceof Error ? mapInitError : new Error(String(mapInitError)));
        toast.error('Failed to initialize map. Please check your internet connection.');
        return;
      }

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
        }
      });

      // Handle map error
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        if (isMountedRef.current) {
          setMapError(e.error || new Error('Unknown map error'));
        }
        toast.error('There was a problem with the map');
      });

    } catch (error) {
      console.error('Error in map setup effect:', error);
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
