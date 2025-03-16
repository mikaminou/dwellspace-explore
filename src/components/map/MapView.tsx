
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSearch } from '@/contexts/search/SearchContext';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyOwners } from './usePropertyOwners';
import { usePropertyMarkers } from './usePropertyMarkers';
import { usePropertyPopup } from './usePropertyPopup';
import { useCityUpdate } from './useCityUpdate';

export function MapView() {
  const { mapContainer, map, markersRef, mapLoaded } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
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
  
  // Handle city updates
  useCityUpdate(map, mapLoaded, selectedCity);

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
