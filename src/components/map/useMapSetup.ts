
import { useRef, useState } from 'react';

export function useMapSetup() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<{ [key: number]: any }>({});
  const popupRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<Error | null>(
    new Error('Map functionality has been temporarily disabled')
  );

  // No actual map is initialized
  console.log('Map feature disabled: useMapSetup called');

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    mapError
  };
}
