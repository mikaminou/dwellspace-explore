
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
import { Property } from '@/api/properties';

function MapView() {
  console.log('Rendering MapView component'); // Debug log
  const navigate = useNavigate();
  const { mapContainer, map, mapLoaded, mapError } = useMapSetup();
  const { properties, loading, selectedCity } = useSearch();
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  
  // Check if Mapbox is available
  useEffect(() => {
    const checkMapboxAvailability = () => {
      try {
        console.log('Checking Mapbox availability'); // Debug log
        
        if (typeof window === 'undefined') {
          console.error("Window is undefined");
          setMapUnavailable(true);
          return false;
        } 
        
        if (!window.mapboxgl) {
          console.error("Mapbox GL not available on window object");
          setMapUnavailable(true);
          
          // Only try to load mapboxgl if we're in a browser environment
          if (typeof window !== 'undefined') {
            // Try to load mapboxgl dynamically
            import('mapbox-gl').then(mapboxgl => {
              console.log('Mapbox GL loaded dynamically');
              window.mapboxgl = mapboxgl.default;
              setMapUnavailable(false);
            }).catch(err => {
              console.error('Failed to load Mapbox GL dynamically:', err);
            });
          }
          
          return false;
        }
        
        console.log('Mapbox GL is available on window'); // Debug log
        return true;
      } catch (e) {
        console.error("Error accessing Mapbox GL:", e);
        setMapUnavailable(true);
        return false;
      }
    };
    
    checkMapboxAvailability();
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

  // Safely update marker z-index
  const updateMarkerZIndex = (propertyId: number | null) => {
    if (!map.current) return;
    
    try {
      // Reset all markers to default z-index
      if (markersRef.current) {
        Object.entries(markersRef.current).forEach(([id, marker]) => {
          if (marker && typeof marker.getElement === 'function') {
            const markerEl = marker.getElement();
            if (markerEl) markerEl.style.zIndex = '1';
          }
        });
      }

      // Set the active marker to higher z-index
      if (propertyId !== null && markersRef.current && markersRef.current[propertyId]) {
        const activeMarkerEl = markersRef.current[propertyId].getElement();
        if (activeMarkerEl) activeMarkerEl.style.zIndex = '3';
      }
    } catch (error) {
      console.error('Error updating marker z-index:', error);
    }
  };

  // Handle marker click with property popup
  const handleMarkerClick = (property: Property, coordinates: [number, number]) => {
    if (!map.current || !mapLoaded) return;
    showPropertyPopup(property, coordinates, setActiveMarkerId, updateMarkerZIndex);
  };

  // Set up popup functionality
  const { popupRef, showPropertyPopup } = usePropertyPopup({
    map,
    onSaveProperty: handleSaveProperty,
    onMessageOwner: handleMessageOwner,
    navigate
  });

  // Set up property markers - only if map is loaded and available
  const { markersRef } = usePropertyMarkers({
    map,
    properties: propertiesWithOwners || [],
    mapLoaded,
    loading,
    onMarkerClick: handleMarkerClick
  });

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
