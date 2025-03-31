
import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLocationPickerMap } from './hooks/useLocationPickerMap';
import { LocationSearchResults } from './components/LocationSearchResults';
import { MapErrorState } from './components/MapErrorState';

interface SearchResult {
  description: string;
  place_id: string;
}

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

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { 
    mapContainer, 
    isLoaded, 
    isMapLoaded, 
    loadError, 
    mapError, 
    searchLocation,
    handlePlaceSelection
  } = useLocationPickerMap({ 
    onLocationSelect, 
    initialLocation 
  });

  const handleSearchInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      const results = await searchLocation(query);
      if (results && results.length > 0) {
        setSearchResults(results as unknown as SearchResult[]);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectLocation = useCallback((result: SearchResult) => {
    setSearchQuery(result.description);
    setShowDropdown(false);
    handlePlaceSelection(result.place_id);
  }, [handlePlaceSelection]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    }
  };

  // Show loading state while Google Maps is loading
  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="w-full h-[300px] rounded-md border flex items-center justify-center bg-gray-100">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was a problem loading the map
  if (loadError || mapError) {
    return (
      <div className="space-y-4">
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
        
        <MapErrorState errorMessage={loadError ? loadError.message : mapError} />
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
        
        <LocationSearchResults 
          results={searchResults}
          show={showDropdown}
          onSelectLocation={handleSelectLocation}
        />
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full h-[300px] rounded-md border relative mb-4"
      />
      
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
}
