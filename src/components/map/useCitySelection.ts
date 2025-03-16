
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCityCoordinates } from './mapUtils';

export function useCitySelection({
  map,
  mapLoaded,
  selectedCity
}: {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  mapLoaded: boolean;
  selectedCity: string;
}) {
  // Update map center when selected city changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedCity || selectedCity === 'any') return;
    
    try {
      const cityCoords = getCityCoordinates(selectedCity);
      if (cityCoords) {
        // Use the coordinates directly for flying to location
        map.current.flyTo({
          center: cityCoords,
          zoom: 12,
          essential: true
        });
      }
    } catch (error) {
      console.error(`Error flying to city ${selectedCity}:`, error);
    }
  }, [selectedCity, mapLoaded, map]);
}
