
import React from 'react';
import { useSearch } from '@/contexts/search/SearchContext';
import { useMapSetup } from './useMapSetup';
import { usePropertyInteractions } from './hooks/usePropertyInteractions';
import { usePropertiesWithOwners } from './usePropertiesWithOwners';
import { usePropertyPopup } from './usePropertyPopup';
import { usePropertyMarkers } from './usePropertyMarkers';
import { useCitySelection } from './useCitySelection';
import { MapContainer } from './MapContainer';
import { 
  MapboxUnavailable, 
  TokenInputWrapper, 
  ErrorStateWrapper 
} from './fallbacks/MapFallbackStates';
import { useMapErrorHandling } from './hooks/useMapErrorHandling';

export function MapViewContent() {
  // Set up map
  const { mapContainer, map, mapLoaded, mapError, mapboxAvailable } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
  
  // Handle map errors
  const { 
    mapInitError, 
    showTokenInput, 
    retryAttempts, 
    handleTokenSet, 
    handleRetry 
  } = useMapErrorHandling(mapError, mapboxAvailable);
  
  // Set up property interactions
  const { navigate, handleSaveProperty, handleMessageOwner } = usePropertyInteractions();
  
  // Get properties with owner data
  const { propertiesWithOwners } = usePropertiesWithOwners(properties);
  
  // Set up popup functionality
  const { popupRef, showPropertyPopup } = usePropertyPopup({
    map,
    onSaveProperty: handleSaveProperty,
    onMessageOwner: handleMessageOwner,
    navigate
  });

  // Set up property markers
  const { markersRef, activeMarkerId, setActiveMarkerId, updateMarkerZIndex } = usePropertyMarkers({
    map,
    properties: propertiesWithOwners,
    mapLoaded,
    loading,
    onMarkerClick: (property, coordinates) => {
      try {
        showPropertyPopup(property, coordinates, setActiveMarkerId, updateMarkerZIndex);
      } catch (error) {
        console.error("Error showing property popup:", error);
      }
    }
  });

  // Handle city selection
  useCitySelection({ map, mapLoaded, selectedCity });
  
  // Fallback for Mapbox not available
  if (!mapboxAvailable) {
    return <MapboxUnavailable retryAttempts={retryAttempts} onRetry={handleRetry} />;
  }

  // Fallback for token errors
  if (showTokenInput) {
    return <TokenInputWrapper onTokenSet={handleTokenSet} />;
  }

  // Fallback for other errors
  if (mapError || mapInitError) {
    return (
      <ErrorStateWrapper 
        message={(mapError || mapInitError)?.message || "Unknown error loading map"} 
        onRetry={handleRetry} 
      />
    );
  }

  return (
    <MapContainer 
      loading={loading} 
      mapContainerRef={mapContainer} 
      propertiesCount={propertiesWithOwners.length} 
    />
  );
}
