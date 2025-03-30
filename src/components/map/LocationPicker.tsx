
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

// Default Google Maps API key - users should replace this with their own
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

interface LocationData {
  city: string;
  state?: string;
  country: string;
  streetName: string;
  location: string;
  longitude?: number;
  latitude?: number;
}

interface LocationPickerProps {
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
}

interface SearchResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: initialLocation?.latitude || 36.7538,
    lng: initialLocation?.longitude || 3.0588
  });
  
  // Google Maps libraries
  const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];
  
  // Load Google Maps API
  const { isLoaded: isGoogleMapsLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  
  // Set initial marker position from props
  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      setMarkerPosition({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
      });
    }
  }, [initialLocation]);

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2 && isGoogleMapsLoaded && window.google) {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: query,
          types: ['geocode', 'establishment'],
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSearchResults(predictions as any);
            setShowDropdown(true);
          } else {
            setSearchResults([]);
            setShowDropdown(false);
          }
        }
      );
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Handle map click to set marker
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPosition);
      getLocationDetails(newPosition);
    }
  }, []);

  // Handle marker drag end
  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setMarkerPosition(newPosition);
      getLocationDetails(newPosition);
    }
  }, []);

  // Get location details from coordinates using Google Maps Geocoding API
  const getLocationDetails = async (position: google.maps.LatLngLiteral) => {
    if (!isGoogleMapsLoaded || !window.google) return;
    
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          console.log('Geocoding response:', results);
          
          // Extract location details from the response
          let city = '';
          let state = '';
          let country = '';
          let streetName = '';
          let neighborhood = '';
          
          // Process each address component to extract relevant information
          results[0].address_components.forEach((component) => {
            const types = component.types;
            
            if (types.includes('locality') || types.includes('administrative_area_level_3')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            } else if (types.includes('route')) {
              streetName = component.long_name;
            } else if (types.includes('neighborhood') || types.includes('sublocality')) {
              neighborhood = component.long_name;
            }
          });
          
          // Use full address as fallback for street name
          if (!streetName && results[0].formatted_address) {
            const addressParts = results[0].formatted_address.split(',');
            if (addressParts.length > 0) {
              streetName = addressParts[0].trim();
            }
          }
          
          // Pass the location data to the parent component
          onLocationSelect({
            city,
            state,
            country,
            streetName,
            location: neighborhood || city,
            longitude: position.lng,
            latitude: position.lat
          });
        }
      });
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  // Handle selection of a search result
  const handleSelectLocation = (result: SearchResult) => {
    setSearchQuery(result.description);
    setShowDropdown(false);
    
    if (!isGoogleMapsLoaded || !window.google) return;
    
    // Get place details to extract coordinates
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );
    
    placesService.getDetails(
      {
        placeId: result.place_id,
        fields: ['geometry', 'address_components', 'formatted_address']
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          // Update map view
          setMapCenter(position);
          setMarkerPosition(position);
          
          // Get location details for the selected result
          getLocationDetails(position);
        }
      }
    );
  };

  // Search for a location (for the search button)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !isGoogleMapsLoaded || !window.google) return;
    
    // If there are search results, use the first one
    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    } else {
      // If no search results, try to geocode the query
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address: searchQuery },
        (results, status) => {
          if (status === 'OK' && results && results[0] && results[0].geometry) {
            const position = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            
            // Update map view
            setMapCenter(position);
            setMarkerPosition(position);
            
            // Get location details for the geocoded result
            getLocationDetails(position);
          }
        }
      );
    }
  };

  if (loadError) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error loading Google Maps: {loadError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelectLocation(result)}
                >
                  <div className="font-medium">{result.structured_formatting.main_text}</div>
                  <div className="text-gray-500 text-xs">{result.structured_formatting.secondary_text}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-[300px] rounded-md border relative mb-4"
      >
        {isGoogleMapsLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '0.375rem' }}
            center={mapCenter}
            zoom={14}
            onClick={handleMapClick}
            options={{
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
}
