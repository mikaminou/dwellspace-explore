
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
    
    // Skip if it's the same city as before
    if (selectedCity === prevCityRef.current) {
      return;
    }
    
    const cityCoords = getCityCoordinates(selectedCity);
    if (cityCoords) {
      console.log(`Flying to ${selectedCity}: [${cityCoords.lng}, ${cityCoords.lat}]`);
      
      map.current.flyTo({
        center: [cityCoords.lng, cityCoords.lat],
        zoom: 12,
        essential: true,
        duration: 1500, // Smoother transition
        bearing: 0,
        pitch: 45, // Add some pitch for better 3D perspective
        curve: 1.5, // Use a more natural easing curve
        speed: 0.8, // Slightly slower for more control
        minZoom: 5, // Maintain a minimum zoom level during transitions
        screenSpeed: 0.8 // Consistent screen speed during transitions
      });
      
      // Update the previous city reference
      prevCityRef.current = selectedCity;
    }
  }, [selectedCity, mapLoaded, map]);
}
