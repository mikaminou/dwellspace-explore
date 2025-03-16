
import { useMapboxToken } from './hooks/useMapboxToken';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapCreation } from './hooks/useMapCreation';

export function useMapSetup() {
  console.log('useMapSetup hook called');
  
  // Get mapbox availability state
  const { mapboxAvailable } = useMapboxToken();
  
  // Initialize map references and state
  const {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    mapError,
    setMapLoaded,
    setMapError,
    isMountedRef
  } = useMapInitialization(mapboxAvailable);
  
  // Set up map creation and configuration
  useMapCreation({
    mapContainer,
    map,
    mapboxAvailable,
    setMapLoaded,
    setMapError,
    isMountedRef
  });

  return {
    mapContainer,
    map,
    markersRef,
    popupRef,
    mapLoaded,
    mapError,
    mapboxAvailable
  };
}
