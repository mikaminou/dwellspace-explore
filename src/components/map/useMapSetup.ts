
import { useRef, useState, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { defaultMapOptions } from './mapUtils';

// List of libraries to load with Google Maps
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places", "geometry"];

// Your Google Maps API key - in production, this should be in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyBtCGretTv8O2Fzf_Oh0Er9H27-EaO-itM'; // Replace with your actual API key

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: number]: google.maps.Marker }>({});
  const popupRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Initialize map when the API is loaded
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing Google Maps...');

    // Create the map instance
    map.current = new google.maps.Map(mapContainer.current, {
      center: { lat: 36.752887, lng: 3.042048 }, // Default center (Algiers)
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      ...defaultMapOptions
    });

    // Set map loaded state when the map is ready
    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      console.log('Google Maps loaded successfully');
      setMapLoaded(true);
    });

    // Add error handler
    google.maps.event.addListener(map.current, 'error', (e) => {
      console.error('Map error:', e);
    });

  }, []);

  // Initialize the map when the Google Maps API is loaded
  useEffect(() => {
    if (isLoaded && !map.current) {
      initializeMap();
    }
    
    if (loadError) {
      console.error('Error loading Google Maps:', loadError);
    }
  }, [isLoaded, loadError, initializeMap]);

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    isLoaded,
    loadError
  };
}
