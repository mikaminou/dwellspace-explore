
import { useEffect } from 'react';

export function useCitySelection({
  map,
  mapLoaded,
  selectedCity
}: {
  map: React.MutableRefObject<any | null>;
  mapLoaded: boolean;
  selectedCity: string;
}) {
  // No-op function that doesn't actually use mapbox
  console.log('Map feature disabled: useCitySelection called with city', selectedCity);
  
  // This hook doesn't do anything now
  return;
}
