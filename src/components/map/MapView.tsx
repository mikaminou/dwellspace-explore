
import React, { useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useSearch } from '@/contexts/search/SearchContext';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyOwners } from './usePropertyOwners';
import { usePropertyPopup } from './useGoogleMapPropertyPopup';
import { usePropertyMarkers } from './useGoogleMapPropertyMarkers';
import { useCityUpdate } from './useGoogleMapCityUpdate';

export function MapView() {
  const { 
    mapContainer, 
    map, 
    markersRef, 
    mapLoaded, 
    setMapLoaded,
    mapOptions,
    apiKey,
    libraries 
  } = useMapSetup();
  
  const { properties, loading, selectedCities } = useSearch();
  const { t } = useLanguage();
  
  // Load the Google Maps JavaScript API
  const { isLoaded: isGoogleMapsLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });
  
  // Use our hooks in the correct order to avoid circular references
  const { propertiesWithOwners } = usePropertyOwners(properties);
  
  // Initialize the map
  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('Google Maps loaded successfully');
    window.google = google; // Make google available globally for debugging
    setMapLoaded(true);
  }, [setMapLoaded]);
  
  // First initialize the popup functionality
  const { showPropertyPopup } = usePropertyPopup(
    map, 
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

  // Handle map loading error
  if (loadError) {
    return (
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading Google Maps: {loadError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading || !isGoogleMapsLoaded} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading && isGoogleMapsLoaded} />
      
      {isGoogleMapsLoaded ? (
        <div ref={mapContainer} className="absolute inset-0 w-full h-full">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={mapOptions}
            onLoad={onMapLoad}
            onUnmount={() => {
              map.current = null;
              setMapLoaded(false);
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p>Loading Google Maps API...</p>
        </div>
      )}
    </div>
  );
}
