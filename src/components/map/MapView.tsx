
import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSearch } from '@/contexts/search/SearchContext';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { getOwnersForProperties } from '@/api/agents';
import { generateCoordsFromLocation, getCityCoordinates } from './mapUtils';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import mapboxgl from 'mapbox-gl';

export function MapView() {
  const { mapContainer, map, markersRef, popupRef, mapLoaded } = useMapSetup();
  
  const [propertiesWithOwners, setPropertiesWithOwners] = useState<Property[]>([]);
  const { properties, loading, selectedCity } = useSearch();
  const { t } = useLanguage();

  // Fetch owners for the properties
  useEffect(() => {
    async function fetchOwners() {
      // Only fetch if we have properties
      if (properties.length > 0) {
        try {
          // Get all property IDs
          const propertyIds = properties.map(p => p.id);
          
          // Fetch owners for these properties
          const ownersMap = await getOwnersForProperties(propertyIds);
          
          // Attach owners to properties
          const propertiesWithOwnerData = properties.map(property => ({
            ...property,
            owner: ownersMap[property.id]
          }));
          
          setPropertiesWithOwners(propertiesWithOwnerData);
        } catch (error) {
          console.error('Error fetching property owners:', error);
          setPropertiesWithOwners(properties);
        }
      } else {
        setPropertiesWithOwners([]);
      }
    }
    
    fetchOwners();
  }, [properties]);

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

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !mapLoaded || loading) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // If there are no properties, don't try to fit bounds
    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;

    propertiesWithOwners.forEach(property => {
      // Skip properties without location info
      if (!property.location) return;

      // Generate coords from property.location string
      const coords = generateCoordsFromLocation(property.location, property.id);
      if (!coords) return;

      bounds.extend([coords.lng, coords.lat]);
      propertiesWithCoords++;

      // Create a marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker flex items-center justify-center';
      markerEl.innerHTML = `<div class="bg-primary text-white p-2 rounded-full">${property.price}</div>`;

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
  }, [propertiesWithOwners, mapLoaded, loading]);

  // Update map center when selected city changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedCity || selectedCity === 'any') return;
    
    const cityCoords = getCityCoordinates(selectedCity);
    if (cityCoords) {
      map.current.flyTo({
        center: [cityCoords.lng, cityCoords.lat],
        zoom: 12,
        essential: true
      });
    }
  }, [selectedCity, mapLoaded]);

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading} />
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
