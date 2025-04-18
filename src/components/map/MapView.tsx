
import React, { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSearch } from '@/contexts/search/SearchContext';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyOwners } from './usePropertyOwners';
import { usePropertyPopup } from './usePropertyPopup';
import { usePropertyMarkers } from './usePropertyMarkers';
import { useCityUpdate } from './useCityUpdate';

export function MapView() {
  const { mapContainer, map, markersRef, mapLoaded } = useMapSetup();
  const { properties, loading, selectedCities, hoveredPropertyId } = useSearch();
  const { t } = useLanguage();
  
  // Use our hooks in the correct order to avoid circular references
  const { propertiesWithOwners } = usePropertyOwners(properties);
  
  // First initialize the popup functionality with marker-based implementation
  const { popupRef, showPropertyPopup } = usePropertyPopup(map, 
    (propertyId) => updateMarkerZIndex(propertyId),
    (id) => setActiveMarkerId(id)
  );
  
  // Then use the showPropertyPopup in the markers hook
  const { activeMarkerId, setActiveMarkerId, updateMarkerZIndex, setHoveredMarkerId } = usePropertyMarkers(
    map, 
    markersRef, 
    propertiesWithOwners, 
    mapLoaded, 
    loading,
    showPropertyPopup
  );
  
  // Handle city updates - pass the first city from selectedCities array
  useCityUpdate(map, mapLoaded, selectedCities.length > 0 ? selectedCities[0] : null);

  // Force map resize when it becomes visible
  useEffect(() => {
    if (map.current && mapLoaded) {
      // Small delay to ensure map container is properly sized
      const resizeTimeout = setTimeout(() => {
        map.current?.resize();
      }, 100);
      return () => clearTimeout(resizeTimeout);
    }
  }, [mapLoaded]);

  // Update the hovered marker when property card is hovered
  useEffect(() => {
    setHoveredMarkerId(hoveredPropertyId);
  }, [hoveredPropertyId, setHoveredMarkerId]);

  return (
    <div className="relative flex-1 w-full h-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full rounded-xl shadow-lg overflow-hidden" />
    </div>
  );
}
