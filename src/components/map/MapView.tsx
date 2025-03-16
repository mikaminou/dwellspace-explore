
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
import { Property } from '@/api/properties';
import { MapTokenInput } from './MapTokenInput';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function MapView() {
  console.log("MapView component rendering");
  const [mapInitError, setMapInitError] = useState<Error | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  const navigate = useNavigate();
  
  // Catch any errors from hooks
  try {
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
        setMapInitError(mapError);
        
        // Check if it's a token-related error
        if (mapError.message.includes('token') || mapError.message.includes('access') || 
            mapError.message.includes('GL JS') || mapError.message.includes('not available')) {
          setShowTokenInput(true);
        } else {
          toast.error("Failed to load map: " + mapError.message);
        }
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

    // Get properties with owner data - with error handling
    let propertiesWithOwners: Property[] = [];
    try {
      const { propertiesWithOwners: fetchedProps } = usePropertiesWithOwners(properties);
      propertiesWithOwners = fetchedProps;
    } catch (error) {
      console.error("Error in usePropertiesWithOwners:", error);
      propertiesWithOwners = properties || [];
    }

    // Set up popup functionality - with error handling
    let popupRef = { current: null };
    let showPropertyPopup: (property: Property, coordinates: [number, number], setId: (id: number | null) => void, updateZIndex: (id: number | null) => void) => void = 
      () => { console.log("Default showPropertyPopup function called"); };
    
    try {
      const popupResult = usePropertyPopup({
        map,
        onSaveProperty: handleSaveProperty,
        onMessageOwner: handleMessageOwner,
        navigate
      });
      popupRef = popupResult.popupRef;
      showPropertyPopup = popupResult.showPropertyPopup;
    } catch (error) {
      console.error("Error in usePropertyPopup:", error);
    }

    // Set up property markers - with error handling
    let markersRef = { current: {} };
    let activeMarkerId = null;
    let setActiveMarkerId: (id: number | null) => void = 
      (id) => { console.log("Default setActiveMarkerId function called with", id); };
    let updateMarkerZIndex: (id: number | null) => void = 
      (id) => { console.log("Default updateMarkerZIndex function called with", id); };
    
    try {
      const markersResult = usePropertyMarkers({
        map,
        properties: propertiesWithOwners,
        mapLoaded,
        loading,
        onMarkerClick: (property, coordinates) => {
          try {
            showPropertyPopup(property, coordinates, setActiveMarkerId, updateMarkerZIndex);
          } catch (error) {
            console.error("Error showing property popup:", error);
          }
        }
      });
      
      markersRef = markersResult.markersRef;
      activeMarkerId = markersResult.activeMarkerId;
      setActiveMarkerId = markersResult.setActiveMarkerId;
      updateMarkerZIndex = markersResult.updateMarkerZIndex;
    } catch (error) {
      console.error("Error in usePropertyMarkers:", error);
    }

    // Handle city selection - with error handling
    try {
      useCitySelection({ map, mapLoaded, selectedCity });
    } catch (error) {
      console.error("Error in useCitySelection:", error);
    }

    const handleTokenSet = () => {
      setShowTokenInput(false);
      window.location.reload(); // Reload to reinitialize map with new token
    };

    const handleReload = () => {
      window.location.reload();
    };

    // Fallback for token errors
    if (showTokenInput) {
      return (
        <div className="relative flex-1 w-full flex items-center justify-center">
          <MapTokenInput 
            onTokenSet={handleTokenSet}
            isVisible={true}
          />
        </div>
      );
    }

    // Fallback for other errors
    if (mapError || mapInitError) {
      return (
        <div className="relative flex-1 w-full flex items-center justify-center">
          <div className="bg-destructive/10 p-6 rounded-md text-destructive max-w-md w-full">
            <h3 className="font-semibold text-lg mb-2">Failed to load map</h3>
            <p className="mb-4">{(mapError || mapInitError)?.message || "Unknown error"}</p>
            <p className="text-sm text-muted-foreground mb-4">
              This might be due to network issues or Mapbox API unavailability.
            </p>
            <Button 
              onClick={handleReload}
              variant="default"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Map
            </Button>
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
  } catch (error) {
    console.error("Critical error in MapView:", error);
    // Show a fallback UI
    return (
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="bg-destructive/10 p-6 rounded-md text-destructive max-w-md w-full">
          <h3 className="font-semibold text-lg mb-2">An error occurred</h3>
          <p className="mb-4">{error instanceof Error ? error.message : String(error)}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="default"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
}

export default MapView;
