
import { useRef, useState, useEffect } from 'react';
import { LoadScriptProps } from '@react-google-maps/api';

// Default Google Maps API key - users should replace this with their own
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Define type for Google Maps markers
type MarkerRef = google.maps.Marker;
type MapRef = google.maps.Map;
type InfoWindowRef = google.maps.InfoWindow;

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapRef | null>(null);
  const markersRef = useRef<{ [key: number]: MarkerRef }>({});
  const popupRef = useRef<InfoWindowRef | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Google Maps options
  const mapOptions: google.maps.MapOptions = {
    center: { lat: 36.752887, lng: 3.042048 }, // Default center (Algiers)
    zoom: 12,
    fullscreenControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    zoomControl: true,
    mapId: 'DEMO_MAP_ID', // Optional: replace with your custom map ID if you have one
    mapTypeId: 'roadmap',
    tilt: 45, // Similar to pitch in Mapbox
  };

  // Google Maps libraries to load
  const libraries: LoadScriptProps['libraries'] = ['places', 'geometry', 'visualization'];

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    setMapLoaded,
    mapOptions,
    apiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  };
}
