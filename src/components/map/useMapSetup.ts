
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';

// Default Mapbox token - users should replace this with their own
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtby1vc2tlbiIsImEiOiJjbHpwb2tud3Uxa2ZvMnFvNzk0NzM5Y21qIn0.9EeqezxzJfQNuQvuw-dPiA';

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [3.042048, 36.752887], // Default center (Algiers)
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded
  };
}
