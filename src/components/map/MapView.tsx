
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
  const navigate = useNavigate();
  const { mapContainer, map, mapLoaded } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
  
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

  // Set up popup functionality with improved handling
  const { popupRef, showPropertyPopup, cleanupPopup } = usePropertyPopup({
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
      // Close any existing popup before showing a new one
      if (popupRef.current) {
        cleanupPopup();
      }
      
      // Show the popup for the clicked property
      showPropertyPopup(property, coordinates, setActiveMarkerId, updateMarkerZIndex);
    }
  });

  // Handle city selection
  useCitySelection({ map, mapLoaded, selectedCity });
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up popup when component unmounts
      if (popupRef.current) {
        cleanupPopup();
      }
    };
  }, []);

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export default MapView;
