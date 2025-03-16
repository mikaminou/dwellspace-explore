
import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSearch } from '@/contexts/search/SearchContext';
import { Property } from '@/api/properties';
import { PropertyPopup } from './PropertyPopup';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { getOwnersForProperties } from '@/api/agents';
import { formatPrice } from './mapUtils';
import { MapLoadingState, MapEmptyState, MapErrorState } from './MapStates';
import { useMapSetup } from './useMapSetup';
import mapboxgl from 'mapbox-gl';

export function MapView() {
  const navigate = useNavigate();
  const { mapContainer, map, markersRef, popupRef, mapLoaded, mapError } = useMapSetup();
  
  const [propertiesWithOwners, setPropertiesWithOwners] = useState<Property[]>([]);
  const { properties, loading, selectedCity } = useSearch();
  const { t } = useLanguage();
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

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

  // Fetch owners for the properties
  useEffect(() => {
    async function fetchOwners() {
      if (properties.length > 0) {
        try {
          const propertyIds = properties.map(p => p.id);
          const ownersMap = await getOwnersForProperties(propertyIds);
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

  // Update marker z-index based on active state
  const updateMarkerZIndex = (propertyId: number | null) => {
    // Reset all markers to default z-index
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const markerEl = marker.getElement();
      markerEl.style.zIndex = '1';
    });

    // Set the active marker to higher z-index
    if (propertyId !== null && markersRef.current[propertyId]) {
      const activeMarkerEl = markersRef.current[propertyId].getElement();
      activeMarkerEl.style.zIndex = '3';
    }
  };

  // Show property popup
  const showPropertyPopup = (property: Property, coordinates: [number, number]) => {
    if (!map.current) return;
    
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Set active marker
    setActiveMarkerId(property.id);
    updateMarkerZIndex(property.id);

    popupRef.current = new mapboxgl.Popup({ 
      closeOnClick: false,
      closeButton: false,
      maxWidth: '320px',
      className: 'property-popup-container'
    })
      .setLngLat(coordinates)
      .setHTML(`<div id="property-popup-${property.id}" class="property-popup"></div>`)
      .addTo(map.current);

    const popupElement = document.getElementById(`property-popup-${property.id}`);
    if (popupElement) {
      popupElement.innerHTML = PropertyPopup({ 
        property, 
        onSave: handleSaveProperty,
        onMessageOwner: handleMessageOwner
      });

      popupElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const clickedElement = target.closest('[data-action]');
        
        if (clickedElement) {
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
          navigate(`/property/${property.id}`);
        }
      });
    }

    // Reset active marker when popup is closed
    ['dragstart', 'zoomstart', 'click'].forEach(event => {
      map.current?.once(event, () => {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
          setActiveMarkerId(null);
          updateMarkerZIndex(null);
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

    if (propertiesWithOwners.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let propertiesWithCoords = 0;

    propertiesWithOwners.forEach(property => {
      // Check if property has longitude and latitude
      if (property.longitude && property.latitude) {
        const lng = parseFloat(property.longitude);
        const lat = parseFloat(property.latitude);
        
        // Validate coordinates
        if (isNaN(lng) || isNaN(lat)) {
          console.warn(`Invalid coordinates for property ${property.id}:`, { lng, lat });
          return;
        }

        console.log(`Adding marker for property ${property.id} at:`, { lng, lat });
        
        bounds.extend([lng, lat]);
        propertiesWithCoords++;

        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker-container';
        
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom',
          offset: [0, 0],
          clickTolerance: 10
        })
          .setLngLat([lng, lat])
          .addTo(map.current!);

        const priceElement = document.createElement('div');
        priceElement.className = 'price-bubble bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
        priceElement.innerText = formatPrice(property.price);
        markerEl.appendChild(priceElement);

        priceElement.addEventListener('click', (e) => {
          e.stopPropagation();
          showPropertyPopup(property, [lng, lat]);
        });

        markersRef.current[property.id] = marker;
      } else {
        console.warn(`Property ${property.id} missing coordinates`);
      }
    });

    console.log(`Added ${propertiesWithCoords} markers out of ${propertiesWithOwners.length} properties`);

    if (propertiesWithCoords > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } else if (selectedCity && selectedCity !== 'any') {
      // If no properties have coordinates but a city is selected, center on that city
      const cityCoords = getCityCoordinates(selectedCity);
      if (cityCoords) {
        map.current.flyTo({
          center: [cityCoords.lng, cityCoords.lat],
          zoom: 12,
          essential: true
        });
      }
    }
  }, [propertiesWithOwners, mapLoaded, loading, navigate, selectedCity]);

  // Helper function to get city coordinates
  const getCityCoordinates = (city: string): { lat: number, lng: number } | null => {
    const cities: {[key: string]: { lat: number, lng: number }} = {
      'Algiers': { lat: 36.752887, lng: 3.042048 },
      'Oran': { lat: 35.691544, lng: -0.642049 },
      'Constantine': { lat: 36.365, lng: 6.614722 },
      'Annaba': { lat: 36.897503, lng: 7.765092 },
      'Setif': { lat: 36.190073, lng: 5.408341 }
    };
    
    return cities[city] || null;
  };

  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesWithOwners.length === 0 && !loading} />
      {mapError && <MapErrorState error={mapError} />}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
