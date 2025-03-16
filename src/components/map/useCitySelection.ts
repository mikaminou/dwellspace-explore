
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
      // cityCoords is [lat, lng] but mapbox expects [lng, lat]
      map.current.flyTo({
        center: [cityCoords[1], cityCoords[0]],
        zoom: 12,
        essential: true
      });
    }
  }, [selectedCity, mapLoaded, map]);
}
