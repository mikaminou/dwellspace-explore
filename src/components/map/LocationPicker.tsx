
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vzc2FyIiwiYSI6ImNtOGJoYnloaTF4ZXIyanIzcXkzdWRtY2UifQ.B_Yp40YHJP7UQeaPdBofaQ';

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
  place_name: string;
  center: [number, number];
  text: string;
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialCoordinates = initialLocation?.longitude && initialLocation?.latitude
      ? [initialLocation.longitude, initialLocation.latitude]
      : [3.0588, 36.7538]; // Default: Algiers
      
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: initialCoordinates as [number, number],
      zoom: 13
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add initial marker if coordinates exist
    if (initialLocation?.longitude && initialLocation?.latitude) {
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([initialLocation.longitude, initialLocation.latitude])
        .addTo(map.current);
        
      marker.current.on('dragend', handleMarkerDragEnd);
    } else {
      // Create a draggable marker
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat(initialCoordinates as [number, number])
        .addTo(map.current);
        
      marker.current.on('dragend', handleMarkerDragEnd);
    }

    // Enable map click to set marker
    map.current.on('click', (e) => {
      if (marker.current) {
        marker.current.setLngLat(e.lngLat);
      } else {
        marker.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat(e.lngLat)
          .addTo(map.current!);
          
        marker.current.on('dragend', handleMarkerDragEnd);
      }
      
      getLocationDetails(e.lngLat.lng, e.lngLat.lat);
    });

    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Handle marker drag end
  const handleMarkerDragEnd = () => {
    if (!marker.current) return;
    
    const lngLat = marker.current.getLngLat();
    getLocationDetails(lngLat.lng, lngLat.lat);
  };

  // Get location details from coordinates using Mapbox Geocoding API
  const getLocationDetails = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&types=address,neighborhood,locality,place,district,region,country`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        console.log('Geocoding response:', data);
        
        // Extract location details from the response
        let city = '';
        let state = '';
        let country = '';
        let streetName = '';
        let neighborhood = '';
        
        // Process each feature to extract relevant information
        data.features.forEach((feature: any) => {
          if (feature.place_type.includes('place') || feature.place_type.includes('locality')) {
            city = feature.text;
          } else if (feature.place_type.includes('region')) {
            state = feature.text;
          } else if (feature.place_type.includes('country')) {
            country = feature.text;
          } else if (feature.place_type.includes('address')) {
            streetName = feature.text;
          } else if (feature.place_type.includes('neighborhood') || feature.place_type.includes('district')) {
            neighborhood = feature.text;
          }
        });
        
        // Use full address as fallback for street name
        if (!streetName && data.features[0].place_name) {
          const addressParts = data.features[0].place_name.split(',');
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
          longitude: lng,
          latitude: lat
        });
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  // Handle search input changes
  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=5`
        );
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          setSearchResults(data.features);
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

  // Handle selection of a search result
  const handleSelectLocation = (result: SearchResult) => {
    setSearchQuery(result.place_name);
    setShowDropdown(false);
    
    const [lng, lat] = result.center;
    
    // Update map view
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true
      });
    }
    
    // Update marker position
    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    } else if (map.current) {
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat])
        .addTo(map.current);
        
      marker.current.on('dragend', handleMarkerDragEnd);
    }
    
    // Get location details for the selected result
    getLocationDetails(lng, lat);
  };

  // Search for a location (for the search button)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !map.current) return;
    
    // If there are search results, use the first one
    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    }
  };

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
                  {result.place_name}
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
