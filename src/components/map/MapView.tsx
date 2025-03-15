
import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  const navigate = useNavigate();
  const { mapContainer, map, markersRef, popupRef, mapLoaded } = useMapSetup();
  
  const [propertiesWithOwners, setPropertiesWithOwners] = useState<Property[]>([]);
  const { properties, loading, selectedCity } = useSearch();
  const { t } = useLanguage();

  // Handle property save
  const handleSaveProperty = (propertyId: number) => {
    // Here you would implement actual saving logic
    console.log('Saving property:', propertyId);
    toast.success('Property saved to favorites');
  };

  // Handle message to owner
  const handleMessageOwner = (ownerId: number) => {
    // Here you would implement actual messaging logic
    console.log('Messaging owner:', ownerId);
    toast.success('Message panel opened');
  };

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

    // Create popup with property information - no close button
    popupRef.current = new mapboxgl.Popup({ 
      closeOnClick: false,
      closeButton: false,
      maxWidth: '300px',
      className: 'property-popup-container'
    })
      .setLngLat(coordinates)
      .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
      .addTo(map.current);

    // Render React component into popup
    const popupElement = document.getElementById(`property-popup-${property.id}`);
    if (popupElement) {
      popupElement.innerHTML = PropertyPopup({ 
        property, 
        onSave: handleSaveProperty,
        onMessageOwner: handleMessageOwner
      });

      // Add click event listener to handle popup clicks
      popupElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickedElement = target.closest('[data-action]');
        
        if (clickedElement) {
          // Handle action buttons
          const action = clickedElement.getAttribute('data-action');
          
          if (action === 'save') {
            e.stopPropagation();
            const propertyId = Number(clickedElement.getAttribute('data-property-id'));
            handleSaveProperty(propertyId);
          } else if (action === 'message') {
            e.stopPropagation();
            const ownerId = Number(clickedElement.getAttribute('data-owner-id'));
            handleMessageOwner(ownerId);
          }
        } else {
          // Navigate to property details on general popup click
          navigate(`/property/${property.id}`);
        }
      });
    }

    // Add event handlers to close popup when interacting with map
    ['dragstart', 'zoomstart', 'click'].forEach(event => {
      map.current?.once(event, () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });
    });
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

      // Create a marker element - using a div instead of HTML string for better control
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker-container relative';
      
      // Create the marker
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
        offset: [0, 0],
        clickTolerance: 10 // Lower click tolerance to make clicking easier
      })
        .setLngLat([coords.lng, coords.lat])
        .addTo(map.current!);

      // Create the price element with proper styling
      const priceElement = document.createElement('div');
      priceElement.className = 'bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
      priceElement.innerText = formatPrice(property.price);
      markerEl.appendChild(priceElement);

      // Add click event directly to the price element
      priceElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop event propagation
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
  }, [propertiesWithOwners, mapLoaded, loading, navigate]);

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
