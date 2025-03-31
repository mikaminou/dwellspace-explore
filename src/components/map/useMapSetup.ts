
import { useRef, useState, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { defaultMapOptions } from './mapUtils';
import { toast } from 'sonner';

// Define the Libraries type correctly for Google Maps API
type Library = "places" | "drawing" | "geometry" | "visualization" | "marker";
type Libraries = Library[];

// List of libraries to load with Google Maps
const libraries: Libraries = ["places", "geometry", "marker"];

// Your Google Maps API key - in production, this should be in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyC3Csmx98gaGxSFzZ2aimsRIqalt4SuTMs'; // Replace with your actual API key

// Add a warning about Google Maps billing
console.warn('⚠️ Important: The Google Maps API key requires billing to be enabled and proper API restrictions in the Google Cloud Console. Without billing enabled and proper restrictions, the map may display errors, watermarks, or "For development purposes only" messages.');

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: number]: google.maps.marker.AdvancedMarkerElement | google.maps.Marker }>({});
  const popupRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    // Add version to ensure compatibility
    version: "weekly",
    // Add the Map ID parameter for advanced markers - this is important
    mapIds: ['YOUR_MAP_ID_HERE'] 
  });

  // Initialize map when the API is loaded
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing Google Maps...');

    try {
      // Create the map instance with realistic styling
      map.current = new google.maps.Map(mapContainer.current, {
        center: { lat: 36.752887, lng: 3.042048 }, // Default center (Algiers)
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        ...defaultMapOptions,
        // Additional map settings for a more polished look
        tilt: 0,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
      });

      // Set map loaded state when the map is ready
      google.maps.event.addListenerOnce(map.current, 'idle', () => {
        console.log('Google Maps loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      });

      // Add error handler for authentication errors
      google.maps.event.addListener(map.current, 'authfailure', () => {
        console.error('Google Maps authentication failed - check API key and restrictions');
        setMapError('API key authentication failed. Please check your API key configuration and restrictions in Google Cloud Console.');
        toast.error('Google Maps failed to load. Please check your API key configuration.');
      });

      // Handle other map errors 
      window.addEventListener('error', function(e) {
        // Check if the error is related to Google Maps
        if (e.message && (
          e.message.includes('Google Maps JavaScript API') || 
          e.message.includes('google is not defined') ||
          e.message.includes('maps is not defined')
        )) {
          console.error('Google Maps error:', e.message);
          setMapError(`Google Maps error: ${e.message}`);
          toast.error('Google Maps failed to load properly. Please check your console for details.');
        }
      });
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setMapError(`Failed to initialize Google Maps: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  // Initialize the map when the Google Maps API is loaded
  useEffect(() => {
    if (isLoaded && !map.current) {
      initializeMap();
    }
    
    if (loadError) {
      console.error('Error loading Google Maps:', loadError);
      setMapError(`Failed to load Google Maps API: ${loadError.message}`);
      toast.error('Failed to load Google Maps. Please try again later.');
    }
  }, [isLoaded, loadError, initializeMap]);

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    isLoaded,
    loadError,
    mapError
  };
}
