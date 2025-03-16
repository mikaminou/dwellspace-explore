
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

export function useMapboxToken() {
  const [mapboxAvailable, setMapboxAvailable] = useState<boolean>(true);
  
  // Check if mapboxgl is available at startup
  useEffect(() => {
    // Check if mapboxgl is globally available
    if (typeof mapboxgl === 'undefined' || !mapboxgl) {
      console.error('mapboxgl not available in the global scope');
      setMapboxAvailable(false);
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
      }
    }
  }, [mapboxAvailable]);

  return { mapboxAvailable };
}
