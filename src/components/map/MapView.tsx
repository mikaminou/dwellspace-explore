
import React, { useEffect } from 'react';
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

function MapView() {
  console.log("MapView component rendering");
  
  const navigate = useNavigate();
  const { mapContainer, map, mapLoaded, mapError } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
  
  useEffect(() => {
    console.log("MapView mounted");
    console.log("Properties count:", properties?.length || 0);
    console.log("Selected city:", selectedCity);
    console.log("Map loaded:", mapLoaded);
    
    return () => {
      console.log("MapView unmounted");
    };
  }, [properties, selectedCity, mapLoaded]);
  
  // Show error if map failed to load
  useEffect(() => {
    if (mapError) {
      console.error("Map error:", mapError);
      toast.error("Failed to load map: " + mapError.message);
    }
  }, [mapError]);
  
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
      showPropertyPopup(property, coordinates, setActiveMarkerId, updateMarkerZIndex);
    }
  });

  // Handle city selection
  useCitySelection({ map, mapLoaded, selectedCity });

  // Fallback for errors
  if (mapError) {
    return (
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          <p>Failed to load map: {mapError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-sm"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export default MapView;
