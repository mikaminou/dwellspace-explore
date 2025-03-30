
import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useSearch } from '@/contexts/search/SearchContext';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyOwners } from './usePropertyOwners';
import { usePropertyPopup } from './useGoogleMapPropertyPopup';
import { usePropertyMarkers } from './useGoogleMapPropertyMarkers';
import { useCityUpdate } from './useGoogleMapCityUpdate';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [showApiKeyForm, setShowApiKeyForm] = useState(!apiKey);
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  
  // Load the Google Maps JavaScript API
  const { isLoaded: isGoogleMapsLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries,
  });
  
  // Use our hooks in the correct order to avoid circular references
  const { propertiesWithOwners } = usePropertyOwners(properties);
  
  // Initialize the map
  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('Google Maps loaded successfully');
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

  // Handle saving API key
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempApiKey.trim()) {
      toast.error("Please enter a valid Google Maps API key");
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('google_maps_api_key', tempApiKey);
    setShowApiKeyForm(false);
    toast.success("Google Maps API key set successfully");
    
    // Reload the page to apply the new API key
    window.location.reload();
  };

  // Handle map loading error
  if (loadError) {
    return (
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-semibold mb-2">Error loading Google Maps</h3>
          <p className="mb-2">{loadError.message}</p>
          <p className="text-sm">Your API key may be invalid or restricted. Please check your API key settings.</p>
          <Button 
            variant="destructive" 
            className="mt-3"
            onClick={() => setShowApiKeyForm(true)}
          >
            Update API Key
          </Button>
        </div>
      </div>
    );
  }

  if (showApiKeyForm) {
    return (
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-md w-full">
          <h3 className="text-xl font-semibold mb-4">Google Maps API Key Required</h3>
          <p className="text-muted-foreground mb-4">
            To use the map functionality, please enter your Google Maps API key. 
            Make sure your API key has the Maps JavaScript API enabled and has no domain restrictions.
          </p>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter your Google Maps API key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <div className="flex justify-end">
              <Button type="submit">
                Save API Key
              </Button>
            </div>
          </form>
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
