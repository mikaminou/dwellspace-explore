
import React from 'react';
import { useSearch } from '@/contexts/search/SearchContext';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyOwners } from './usePropertyOwners';
import { usePropertyPopup } from './usePropertyPopup';
import { usePropertyMarkers } from './usePropertyMarkers';
import { useCityUpdate } from './useCityUpdate';
import { ShieldAlert, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MapView() {
  const { mapContainer, map, markersRef, mapLoaded, isLoaded, loadError, mapError } = useMapSetup();
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
        <div className="text-center max-w-md p-6 border rounded-lg shadow-md">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load Google Maps</h3>
          <p className="text-muted-foreground mb-4">{loadError.message}</p>
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm mb-4">
            <p className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Google Maps API requires:
            </p>
            <ul className="list-disc ml-5 mt-1 text-xs">
              <li>Valid API key with proper restrictions</li>
              <li>Billing enabled in Google Cloud Console</li>
              <li>Maps JavaScript API enabled</li>
            </ul>
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show API error if map initialization failed
  if (mapError) {
    return (
      <div className="relative flex-1 w-full flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md p-6 border rounded-lg shadow-md">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Google Maps Error</h3>
          <p className="text-muted-foreground mb-4">{mapError}</p>
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 text-sm mb-4">
            <p className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Common causes:
            </p>
            <ul className="list-disc ml-5 mt-1 text-xs">
              <li>"For development purposes only" watermark: Billing not enabled</li>
              <li>"This page can't load Google Maps correctly": API key restrictions may be too strict</li>
              <li>Ensure Maps JavaScript API, Places API, and Geocoding API are enabled</li>
            </ul>
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
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
