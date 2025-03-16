
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function useMapBounds() {
  // Function to fit map to calculated bounds
  const fitMapToBounds = (
    map: mapboxgl.Map, 
    bounds: Bounds,
    propertiesWithCoords: number
  ) => {
    try {
      console.log('Fitting map to bounds with', propertiesWithCoords, 'properties');
      
      const { minLat, maxLat, minLng, maxLng } = bounds;
      
      // Only fit bounds if we have valid min/max values
      if (minLat <= maxLat && minLng <= maxLng) {
        map.fitBounds([
          [minLng, minLat], // Southwest corner
          [maxLng, maxLat]  // Northeast corner
        ], {
          padding: 50,
          maxZoom: 15
        });
      } else {
        console.warn('Invalid bounds calculated, using default view');
        setDefaultMapView(map);
      }
    } catch (fitError) {
      console.error('Error fitting map to bounds:', fitError);
      // Try to center map on default location as fallback
      setDefaultMapView(map);
    }
  };

  // Set default map view as fallback
  const setDefaultMapView = (map: mapboxgl.Map) => {
    try {
      map.setCenter([3.042048, 36.752887]);
      map.setZoom(12);
    } catch (e) {
      console.error('Error setting default map center:', e);
    }
  };

  // Initialize bounds object
  const initBounds = (): Bounds => ({
    minLat: 90,
    maxLat: -90,
    minLng: 180,
    maxLng: -180
  });

  // Update bounds based on new coordinates
  const updateBounds = (bounds: Bounds, lat: number, lng: number): Bounds => ({
    minLat: Math.min(bounds.minLat, lat),
    maxLat: Math.max(bounds.maxLat, lat),
    minLng: Math.min(bounds.minLng, lng),
    maxLng: Math.max(bounds.maxLng, lng)
  });

  return {
    initBounds,
    updateBounds,
    fitMapToBounds,
    setDefaultMapView
  };
}
