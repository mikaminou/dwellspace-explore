import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useJsApiLoader } from '@react-google-maps/api';

// Define your Google Maps API key here
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key
const libraries = ['places', 'geometry'] as ('places' | 'geometry' | 'drawing' | 'visualization')[];

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
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  const initializeServices = useCallback(() => {
    if (!isLoaded) return;
    
    if (!autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
    
    if (!geocoder.current) {
      geocoder.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapContainer.current) return;
    
    initializeServices();

    const initialCoordinates = initialLocation?.longitude && initialLocation?.latitude
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : { lat: 36.7538, lng: 3.0588 }; // Default: Algiers
      
    map.current = new google.maps.Map(mapContainer.current, {
      center: initialCoordinates,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    placesService.current = new google.maps.places.PlacesService(map.current);

    marker.current = new google.maps.Marker({
      position: initialCoordinates,
      map: map.current,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
        
    if (marker.current) {
      marker.current.addListener('dragend', () => {
        if (marker.current) {
          const position = marker.current.getPosition();
          if (position) {
            getLocationDetails(position.lng(), position.lat());
          }
        }
      });
    }

    map.current.addListener('click', (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;
      if (latLng && marker.current) {
        marker.current.setPosition(latLng);
        getLocationDetails(latLng.lng(), latLng.lat());
      }
    });

    map.current.addListener('idle', () => {
      setIsMapLoaded(true);
    });

    return () => {
      // Clean up
    };
  }, [isLoaded, initialLocation]);

  const getLocationDetails = async (lng: number, lat: number) => {
    if (!geocoder.current) return;
    
    try {
      const response = await geocoder.current.geocode({
        location: { lat, lng }
      });
      
      if (response.results && response.results.length > 0) {
        console.log('Geocoding response:', response);
        
        let city = '';
        let state = '';
        let country = '';
        let streetName = '';
        let neighborhood = '';
        
        response.results[0].address_components.forEach((component) => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (component.types.includes('country')) {
            country = component.long_name;
          } else if (component.types.includes('route')) {
            streetName = component.long_name;
          } else if (component.types.includes('neighborhood') || component.types.includes('sublocality')) {
            neighborhood = component.long_name;
          }
        });
        
        if (!streetName && response.results[0].formatted_address) {
          const addressParts = response.results[0].formatted_address.split(',');
          if (addressParts.length > 0) {
            streetName = addressParts[0].trim();
          }
        }
        
        onLocationSelect({
          city,
          state,
          country,
          streetName,
          location: neighborhood || city,
          longitude: lng,
          latitude: lat
        });
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2 && autocompleteService.current) {
      try {
        const predictions = await autocompleteService.current.getPlacePredictions({
          input: query,
          types: ['geocode', 'establishment', 'address']
        });
        
        if (predictions && predictions.predictions.length > 0) {
          setSearchResults(predictions.predictions as unknown as SearchResult[]);
          setShowDropdown(true);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('Error searching for locations:', error);
        setSearchResults([]);
        setShowDropdown(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    setSearchQuery(result.description);
    setShowDropdown(false);
    
    if (!placesService.current || !map.current) return;
    
    placesService.current.getDetails({
      placeId: result.place_id,
      fields: ['geometry', 'formatted_address', 'address_components']
    }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
        if (map.current) {
          map.current.setCenter(place.geometry.location);
          map.current.setZoom(15);
        }
        
        if (marker.current) {
          marker.current.setPosition(place.geometry.location);
        } else if (map.current) {
          marker.current = new google.maps.Marker({
            position: place.geometry.location,
            map: map.current,
            draggable: true
          });
          
          marker.current.addListener('dragend', () => {
            if (marker.current) {
              const position = marker.current.getPosition();
              if (position) {
                getLocationDetails(position.lng(), position.lat());
              }
            }
          });
        }
        
        getLocationDetails(
          place.geometry.location.lng(), 
          place.geometry.location.lat()
        );
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !map.current) return;
    
    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="w-full h-[300px] rounded-md border flex items-center justify-center bg-gray-100">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <div className="w-full h-[300px] rounded-md border flex items-center justify-center bg-gray-100">
          <p className="text-red-500">Error loading Google Maps: {loadError.message}</p>
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
                  {result.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-[300px] rounded-md border relative mb-4"
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
}
