
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSearch } from '@/contexts/search/SearchContext';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { MapPin, Loader2 } from 'lucide-react';

// Default Mapbox token - users should replace this with their own
mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtby1vc2tlbiIsImEiOiJjbHpwb2tud3Uxa2ZvMnFvNzk0NzM5Y21qIn0.9EeqezxzJfQNuQvuw-dPiA';

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const { properties, loading, selectedCity } = useSearch();
  const { t } = useLanguage();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [3.042048, 36.752887], // Default center (Algiers)
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // If there are no properties, don't try to fit bounds
    if (properties.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;

    properties.forEach(property => {
      // Skip properties without location info
      if (!property.location) return;

      // For demo purposes, generate coords from property.location string
      // In a real app, you would have actual lat/lng from your database
      const coords = generateCoordsFromLocation(property.location, property.id);
      if (!coords) return;

      bounds.extend([coords.lng, coords.lat]);
      propertiesWithCoords++;

      // Create a marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker flex items-center justify-center';
      markerEl.innerHTML = `<div class="bg-primary text-white p-2 rounded-full">${formatPrice(property.price)}</div>`;

      // Create and add the marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current!);

      // Add click event to show popup
      marker.getElement().addEventListener('click', () => {
        showPropertyPopup(property, [coords.lng, coords.lat]);
      });

      markersRef.current[property.id] = marker;
    });

    // Fit map to bounds if we have properties with coordinates
    if (propertiesWithCoords > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [properties, mapLoaded, loading]);

  // Update map center when selected city changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedCity || selectedCity === 'any') return;
    
    // In a real app, you would have city coordinates in your database
    // This is a simplified version for demo purposes
    const cityCoords = getCityCoordinates(selectedCity);
    if (cityCoords) {
      map.current.flyTo({
        center: [cityCoords.lng, cityCoords.lat],
        zoom: 12,
        essential: true
      });
    }
  }, [selectedCity, mapLoaded]);

  // Show property popup
  const showPropertyPopup = (property: Property, coordinates: [number, number]) => {
    if (!map.current) return;
    
    // Remove existing popup if any
    if (popupRef.current) {
      popupRef.current.remove();
    }

    // Create popup with property information
    popupRef.current = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(coordinates)
      .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
      .addTo(map.current);

    // Render React component into popup
    const popupElement = document.getElementById(`property-popup-${property.id}`);
    if (popupElement) {
      // In a real-world app, you'd use ReactDOM.render or a portal
      // For simplicity, we'll just set the HTML content
      popupElement.innerHTML = PropertyPopup({ property });
    }
  };

  return (
    <div className="relative flex-1 w-full">
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">{t('map.loading')}</p>
          </div>
        </div>
      )}
      
      {properties.length === 0 && !loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-4 max-w-md text-center px-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-medium">{t('map.noProperties')}</h3>
            <p className="text-muted-foreground">{t('search.tryAdjustingFilters')}</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

// Helper function to generate coordinates from location string
// In a real app, you would have actual coordinates in your database
function generateCoordsFromLocation(location: string, id: number): { lat: number, lng: number } | null {
  // Base coordinates for Algiers
  const baseCoords = { lat: 36.752887, lng: 3.042048 };
  
  // Generate slightly different coordinates based on the id to spread markers
  return {
    lat: baseCoords.lat + (Math.sin(id) * 0.03),
    lng: baseCoords.lng + (Math.cos(id) * 0.03)
  };
}

// Helper function to get city coordinates
// In a real app, you would have this data in your database
function getCityCoordinates(city: string): { lat: number, lng: number } | null {
  const cities: {[key: string]: { lat: number, lng: number }} = {
    'Algiers': { lat: 36.752887, lng: 3.042048 },
    'Oran': { lat: 35.691544, lng: -0.642049 },
    'Constantine': { lat: 36.365, lng: 6.614722 },
    'Annaba': { lat: 36.897503, lng: 7.765092 },
    'Setif': { lat: 36.190073, lng: 5.408341 }
  };
  
  return cities[city] || null;
}

// Helper function to format price
function formatPrice(price: string): string {
  const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
  if (numericPrice < 1000000) {
    return `$${Math.round(numericPrice / 1000)}K`;
  } else {
    return `$${(numericPrice / 1000000).toFixed(1)}M`;
  }
}
