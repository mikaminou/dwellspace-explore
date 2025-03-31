
import { useEffect, useRef } from 'react';
import { getCityCoordinates } from './mapUtils';

export function useCityUpdate(
  map: React.MutableRefObject<google.maps.Map | null>,
  mapLoaded: boolean,
  selectedCity: string | null
) {
  const prevCityRef = useRef<string | null>(null);

  // Update map center when selected city changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedCity) return;
    
    // Skip if it's the same city as before
    if (selectedCity === prevCityRef.current) {
      return;
    }
    
    const cityCoords = getCityCoordinates(selectedCity);
    if (cityCoords) {
      console.log(`Flying to ${selectedCity}: [${cityCoords.lng}, ${cityCoords.lat}]`);
      
      map.current.panTo(new google.maps.LatLng(cityCoords.lat, cityCoords.lng));
      map.current.setZoom(12);
      
      // Update the previous city reference
      prevCityRef.current = selectedCity;
    }
  }, [selectedCity, mapLoaded, map]);
}
