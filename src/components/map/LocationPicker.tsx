
// Get API key from localStorage
const GOOGLE_MAPS_API_KEY = localStorage.getItem('google_maps_api_key') || 'AIzaSyBtCGretTv8O2Fzf_Oh0Er9H27-EaO-itM';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface LocationData {
  longitude?: number;
  latitude?: number;
  city?: string;
  state?: string;
  country?: string;
  streetName?: string;
  location?: string;
}

interface LocationPickerProps {
  onLocationSelect: (locationData: LocationData) => void;
  initialLocation?: LocationData;
}

// Define Google Maps libraries to load - using supported libraries only
const libraries = ['places', 'geometry', 'visualization'] as const;

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = useState('');
  
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const createMap = useCallback(() => {
    if (!mapContainerRef.current) return;
    
    // Default center - can be customized
    const defaultCenter = { lat: 36.752887, lng: 3.042048 }; // Algiers
    const center = initialLocation?.latitude && initialLocation?.longitude
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : defaultCenter;
    
    // Initialize map
    mapRef.current = new google.maps.Map(mapContainerRef.current, {
      center,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      zoomControl: true,
    });
    
    // Initialize marker
    markerRef.current = new google.maps.Marker({
      position: center,
      map: mapRef.current,
      draggable: true,
      title: 'Property Location',
    });
    
    // Handle marker drag events
    google.maps.event.addListener(markerRef.current, 'dragend', function() {
      if (!markerRef.current) return;
      
      const position = markerRef.current.getPosition();
      if (!position) return;
      
      // Reverse geocode to get address information
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: position.lat(), lng: position.lng() } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          handleGeocodeResult(results[0], position.lat(), position.lng());
        }
      });
    });
  }, [initialLocation]);
  
  const initAutocomplete = useCallback(() => {
    const input = document.getElementById('location-search') as HTMLInputElement;
    if (!input) return;
    
    autocompleteRef.current = new google.maps.places.Autocomplete(input, {
      fields: ['address_components', 'geometry', 'name', 'formatted_address'],
    });
    
    // Bias results to current map viewport
    if (mapRef.current) {
      autocompleteRef.current.bindTo('bounds', mapRef.current);
    }
    
    // Handle place selection
    autocompleteRef.current.addListener('place_changed', () => {
      if (!autocompleteRef.current) return;
      
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      
      // Set map center and zoom
      if (mapRef.current) {
        mapRef.current.setCenter(place.geometry.location);
        mapRef.current.setZoom(17);
      }
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setPosition(place.geometry.location);
      }
      
      // Extract address components
      handleGeocodeResult(place, place.geometry.location.lat(), place.geometry.location.lng());
    });
  }, []);
  
  const handleGeocodeResult = (
    result: google.maps.GeocoderResult | google.maps.places.PlaceResult, 
    lat: number, 
    lng: number
  ) => {
    let city = '';
    let state = '';
    let country = '';
    let streetName = '';
    let neighborhood = '';
    
    // Extract address components from geocode/place result
    const addressComponents = 'address_components' in result ? result.address_components : [];
    if (addressComponents) {
      for (const component of addressComponents) {
        const types = component.types;
        
        if (types.includes('locality')) {
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
      }
    }
    
    // Get formatted address
    const formattedAddress = result.formatted_address || '';
    
    // If street name not found, try to extract from formatted address
    if (!streetName && formattedAddress) {
      const parts = formattedAddress.split(',');
      if (parts.length > 0) {
        streetName = parts[0].trim();
      }
    }
    
    // Prepare location data
    const locationData: LocationData = {
      longitude: lng,
      latitude: lat,
      city,
      state,
      country,
      streetName,
      location: neighborhood || city
    };
    
    // Pass location data to parent component
    onLocationSelect(locationData);
    
    // Update search field
    setSearchValue(formattedAddress);
  };
  
  // Initialize map and autocomplete when script is loaded
  useEffect(() => {
    if (isLoaded && !loadError) {
      createMap();
      initAutocomplete();
    }
  }, [isLoaded, loadError, createMap, initAutocomplete]);
  
  // Set initial location data if provided
  useEffect(() => {
    if (initialLocation && initialLocation.latitude && initialLocation.longitude && mapRef.current && markerRef.current) {
      const position = {
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
      };
      
      mapRef.current.setCenter(position);
      markerRef.current.setPosition(position);
      
      // If we have street info, update the search value
      if (initialLocation.streetName) {
        let address = initialLocation.streetName;
        if (initialLocation.city) address += `, ${initialLocation.city}`;
        if (initialLocation.state) address += `, ${initialLocation.state}`;
        if (initialLocation.country) address += `, ${initialLocation.country}`;
        
        setSearchValue(address);
      }
      
      // Trigger onLocationSelect with initial data to ensure form is populated
      onLocationSelect(initialLocation);
    }
  }, [initialLocation, onLocationSelect, isLoaded]);
  
  if (loadError) {
    return <div className="p-4 text-red-500">Error loading Google Maps API: {loadError.message}</div>;
  }
  
  return (
    <div className="space-y-4 w-full">
      <div className="relative">
        <Input
          id="location-search"
          className="pl-10"
          placeholder="Search for a location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
      </div>
      
      <Card className="w-full h-96 rounded-md overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{ borderRadius: 'inherit' }}
        />
      </Card>
      
      <div className="text-sm text-muted-foreground">
        Drag the marker to pinpoint the exact property location
      </div>
    </div>
  );
}
