
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

// Interface for location data
interface LocationData {
  city: string;
  state?: string;
  country: string;
  streetName: string;
  location: string;
  longitude?: number;
  latitude?: number;
}

interface GoogleLocationPickerProps {
  onLocationSelect: (data: LocationData) => void;
  initialLocation?: {
    longitude?: number;
    latitude?: number;
    city?: string;
    state?: string;
    country?: string;
    streetName?: string;
    location?: string;
  };
  name: string;
}

export function GoogleLocationPicker({ onLocationSelect, initialLocation }: GoogleLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Initialize Google Maps
  useEffect(() => {
    // Clean up function for when component unmounts
    const cleanupFunc = () => {
      // Remove any event listeners or markers if needed
      if (marker) {
        marker.setMap(null);
      }
      
      // Only remove the script if we created it in this component instance
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        try {
          document.body.removeChild(scriptRef.current);
        } catch (e) {
          console.error("Error removing script element:", e);
        }
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      try {
        const script = document.createElement('script');
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
        
        if (!apiKey) {
          setMapLoadError("Google Maps API key is missing");
          return cleanupFunc;
        }
        
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          setMapLoadError("Failed to load Google Maps API");
          console.error("Google Maps script failed to load");
        };
        
        // Store the script element reference
        scriptRef.current = script;
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error adding Google Maps script:", error);
        setMapLoadError("Failed to load Google Maps");
      }
    } else {
      initMap();
    }

    return cleanupFunc;
  }, []);

  // Initialize map
  const initMap = () => {
    if (!mapRef.current) return;
    
    try {
      // Set default location or use the initial location if provided
      const initialCoordinates = initialLocation?.latitude && initialLocation?.longitude
        ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
        : { lat: 36.7538, lng: 3.0588 }; // Default: Algiers

      // Create the map
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: initialCoordinates,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false
      });

      // Create marker
      const markerInstance = new google.maps.Marker({
        position: initialCoordinates,
        map: mapInstance,
        draggable: true,
        animation: google.maps.Animation.DROP
      });

      // Set up search input with autocomplete
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current);
        autocomplete.bindTo('bounds', mapInstance);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) {
            return;
          }

          // Update marker position
          markerInstance.setPosition(place.geometry.location);
          
          // Center map on the selected place
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(16);

          // Extract location data from place result
          getLocationDetailsFromPlace(place);
        });
      }

      // Set up click event on map to place marker
      mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        
        markerInstance.setPosition(e.latLng);
        getLocationDetailsFromCoordinates(e.latLng.lat(), e.latLng.lng());
      });

      // Set up drag end event for marker
      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        if (position) {
          getLocationDetailsFromCoordinates(position.lat(), position.lng());
        }
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setIsMapLoaded(true);
      setMapLoadError(null);

      // If initial location is provided, fetch its details
      if (initialLocation?.latitude && initialLocation?.longitude) {
        getLocationDetailsFromCoordinates(initialLocation.latitude, initialLocation.longitude);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapLoadError("Failed to initialize map");
    }
  };

  // Get location details from coordinates using Geocoding
  const getLocationDetailsFromCoordinates = (lat: number, lng: number) => {
    if (!window.google) {
      console.error("Google Maps not loaded");
      return;
    }
    
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        processGeocoderResults(results, lat, lng);
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  };

  // Get location details from place result
  const getLocationDetailsFromPlace = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;
    
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    
    if (place.address_components) {
      let streetName = '';
      let city = '';
      let state = '';
      let country = '';
      let neighborhood = '';
      
      place.address_components.forEach(component => {
        const types = component.types;
        
        if (types.includes('route')) {
          streetName = component.long_name;
        } else if (types.includes('locality') || types.includes('postal_town')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (types.includes('country')) {
          country = component.long_name;
        } else if (types.includes('neighborhood') || types.includes('sublocality')) {
          neighborhood = component.long_name;
        }
      });
      
      // Fallback for street name if not found
      if (!streetName && place.name) {
        streetName = place.name;
      }
      
      // Use formatted address as fallback for missing fields
      if (!city && place.formatted_address) {
        const addressParts = place.formatted_address.split(',');
        if (addressParts.length > 1) {
          city = addressParts[1].trim();
        }
      }
      
      onLocationSelect({
        city: city || 'Unknown',
        state,
        country: country || 'Algeria',
        streetName: streetName || place.formatted_address || 'Unknown',
        location: neighborhood || city || 'Unknown',
        longitude: lng,
        latitude: lat
      });
    }
  };

  // Process geocoder results to extract location information
  const processGeocoderResults = (results: google.maps.GeocoderResult[], lat: number, lng: number) => {
    let streetName = '';
    let city = '';
    let state = '';
    let country = '';
    let neighborhood = '';
    
    // Extract address components from results
    results.forEach(result => {
      result.address_components.forEach(component => {
        const types = component.types;
        
        if (types.includes('route')) {
          streetName = component.long_name;
        } else if (types.includes('locality') || types.includes('postal_town')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (types.includes('country')) {
          country = component.long_name;
        } else if (types.includes('neighborhood') || types.includes('sublocality')) {
          neighborhood = component.long_name;
        }
      });
    });
    
    // Fallback for street name
    if (!streetName && results[0].formatted_address) {
      const addressParts = results[0].formatted_address.split(',');
      if (addressParts.length > 0) {
        streetName = addressParts[0].trim();
      }
    }
    
    // Pass location data to parent component
    onLocationSelect({
      city: city || 'Unknown',
      state,
      country: country || 'Algeria',
      streetName: streetName || results[0].formatted_address || 'Unknown',
      location: neighborhood || city || 'Unknown',
      longitude: lng,
      latitude: lat
    });
  };

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission
  const handleSearch = () => {
    const searchQuery = searchInputRef.current?.value;
    if (!searchQuery?.trim() || !window.google) return;
    
    // Use Places API for geocoding the search query
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        
        if (map && marker) {
          marker.setPosition(location);
          map.setCenter(location);
          map.setZoom(16);
          
          processGeocoderResults(results, location.lat(), location.lng());
        }
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const searchPlaceholder = t('property.searchLocation') || "Search for a location...";
  const loadingMapText = t('property.loadingMap') || "Loading map...";

  return (
    <div className="space-y-4">
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-[300px] rounded-md border relative mb-4"
      >
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            {mapLoadError ? (
              <p className="text-red-500">{mapLoadError}</p>
            ) : (
              <p>{loadingMapText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
