
import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useSearch } from '@/contexts/search/SearchContext';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyOwners } from './usePropertyOwners';
import { usePropertyPopup } from './usePropertyPopup';
import { usePropertyMarkers } from './usePropertyMarkers';
import { useCityUpdate } from './useCityUpdate';
import { defaultMapOptions } from './mapUtils';

export function MapView() {
  const { mapContainer, map, markersRef, mapLoaded, isLoaded, loadError } = useMapSetup();
  const { properties, loading, selectedCities } = useSearch();
  const { t } = useLanguage();
  
  // Use our hooks in the correct order to avoid circular references
  const { propertiesWithOwners } = usePropertyOwners(properties);
  
  // First initialize the popup functionality
  const { popupRef, showPropertyPopup } = usePropertyPopup(map, 
    (propertyId) => updateMarkerZIndex(propertyId),
    (id) => setActiveMarkerId(id)
  );
  
  // Then use the showPropertyPopup in the markers hook
  const { activeMarkerId, setActiveMarkerId, updateMarkerZIndex } = usePropertyMarkers(
    map, 
    markersRef, 
    propertiesWithOwners, 
    mapLoaded, 
    loading,
    showPropertyPopup
  );
  
  // Handle city updates - pass the first city from selectedCities array
  useCityUpdate(map, mapLoaded, selectedCities.length > 0 ? selectedCities[0] : null);

  // Show loading error if Google Maps failed to load
  if (loadError) {
    return (
      <div className="relative flex-1 w-full flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Failed to load Google Maps</p>
          <p className="text-muted-foreground">{loadError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading || !isLoaded} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading && isLoaded} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
