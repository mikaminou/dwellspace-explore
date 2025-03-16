
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
    
    const cityCoords = getCityCoordinates(selectedCity);
    if (cityCoords) {
      map.current.flyTo({
        center: [cityCoords.lng, cityCoords.lat],
        zoom: 12,
        essential: true
      });
    }
  }, [selectedCity, mapLoaded, map]);
}
