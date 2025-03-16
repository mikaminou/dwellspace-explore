
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCityCoordinates } from './mapUtils';

export function useCityUpdate(
  map: React.MutableRefObject<mapboxgl.Map | null>,
  mapLoaded: boolean,
  selectedCity: string | null
) {
  const prevCityRef = useRef<string | null>(null);

  // Update map center when selected city changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedCity) return;
    
    // Skip if it's the same city as before or "any"
    if (selectedCity === 'any' || selectedCity === prevCityRef.current) {
      return;
    }
    
    const cityCoords = getCityCoordinates(selectedCity);
    if (cityCoords) {
      console.log(`Flying to ${selectedCity}: [${cityCoords.lng}, ${cityCoords.lat}]`);
      map.current.flyTo({
        center: [cityCoords.lng, cityCoords.lat],
        zoom: 12,
        essential: true
      });
      
      // Update the previous city reference
      prevCityRef.current = selectedCity;
    }
  }, [selectedCity, mapLoaded, map]);
}
