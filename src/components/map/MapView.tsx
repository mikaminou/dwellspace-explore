
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
  console.log('Rendering MapView component'); // Debug log
  const navigate = useNavigate();
  const { mapContainer, map, mapLoaded, mapError } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
  const [mapUnavailable, setMapUnavailable] = useState(false);
  
  // Check if Mapbox is available
  useEffect(() => {
    try {
      console.log('Checking Mapbox availability'); // Debug log
      if (typeof window === 'undefined') {
        console.error("Window is undefined");
        setMapUnavailable(true);
      } else if (!window.mapboxgl) {
        console.error("Mapbox GL not available on window object");
        setMapUnavailable(true);
        // Try to load mapboxgl dynamically
        import('mapbox-gl').then(mapboxgl => {
          console.log('Mapbox GL loaded dynamically');
          window.mapboxgl = mapboxgl.default;
          setMapUnavailable(false);
        }).catch(err => {
          console.error('Failed to load Mapbox GL dynamically:', err);
        });
      } else {
        console.log('Mapbox GL is available on window'); // Debug log
      }
    } catch (e) {
      console.error("Error accessing Mapbox GL:", e);
      setMapUnavailable(true);
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

  // Setup components with error handling
  let popupSetup = { popupRef: { current: null }, showPropertyPopup: () => {} };
  let markerSetup = { markersRef: { current: {} }, activeMarkerId: null, setActiveMarkerId: () => {}, updateMarkerZIndex: () => {} };

  try {
    // Set up popup functionality
    popupSetup = usePropertyPopup({
      map,
      onSaveProperty: handleSaveProperty,
      onMessageOwner: handleMessageOwner,
      navigate
    });

    // Set up property markers
    markerSetup = usePropertyMarkers({
      map,
      properties: propertiesWithOwners || [],
      mapLoaded,
      loading,
      onMarkerClick: (property, coordinates) => {
        popupSetup.showPropertyPopup(property, coordinates, markerSetup.setActiveMarkerId, markerSetup.updateMarkerZIndex);
      }
    });
  } catch (error) {
    console.error('Error setting up map components:', error);
    setMapUnavailable(true);
  }

  // Destructure safely after setup
  const { popupRef, showPropertyPopup } = popupSetup;
  const { markersRef, activeMarkerId, setActiveMarkerId, updateMarkerZIndex } = markerSetup;

  // Handle city selection
  try {
    useCitySelection({ map, mapLoaded, selectedCity });
  } catch (error) {
    console.error('Error in city selection:', error);
  }

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
