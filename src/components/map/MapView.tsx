
import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSearch } from '@/contexts/search/SearchContext';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import { usePropertyMarkers } from './usePropertyMarkers';
import { usePropertyPopup } from './usePropertyPopup';
import { useCitySelection } from './useCitySelection';
import { usePropertiesWithOwners } from './usePropertiesWithOwners';
import { AlertTriangle } from 'lucide-react';

function MapView() {
  const navigate = useNavigate();
  const { mapContainer, map, mapLoaded, mapError } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
  const [mapUnavailable, setMapUnavailable] = useState(false);
  
  // Check if Mapbox is available
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.mapboxgl) {
        setMapUnavailable(true);
        console.error("Mapbox GL not available on window object");
      }
    } catch (e) {
      setMapUnavailable(true);
      console.error("Error accessing Mapbox GL:", e);
    }
  }, []);

  // Handle property save
  const handleSaveProperty = (propertyId: number) => {
    console.log('Saving property:', propertyId);
    toast.success('Property saved to favorites');
  };

  // Handle message to owner
  const handleMessageOwner = (ownerId: number) => {
    console.log('Messaging owner:', ownerId);
    toast.success('Message panel opened');
  };

  // Get properties with owner data
  const { propertiesWithOwners } = usePropertiesWithOwners(properties || []);

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
    properties: propertiesWithOwners || [],
    mapLoaded,
    loading,
    onMarkerClick: (property, coordinates) => {
      showPropertyPopup(property, coordinates, setActiveMarkerId, updateMarkerZIndex);
    }
  });

  // Handle city selection
  useCitySelection({ map, mapLoaded, selectedCity });

  // If map is unavailable, show a fallback UI
  if (mapUnavailable || mapError) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-8 bg-muted/20">
        <div className="bg-white dark:bg-card p-6 rounded-lg shadow-lg max-w-md text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Map unavailable</h3>
          <p className="text-muted-foreground mb-4">
            {mapError ? String(mapError) : "The map couldn't be loaded. This might be due to network issues or an unsupported browser."}
          </p>
          <p className="text-sm text-muted-foreground">
            Try using a different browser or check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full">
      {loading && <MapLoadingState show={loading} />}
      {!loading && propertiesWithOwners && propertiesWithOwners.length === 0 && (
        <MapEmptyState show={true} />
      )}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export default MapView;
