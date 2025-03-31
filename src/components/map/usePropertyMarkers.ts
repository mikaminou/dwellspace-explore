
import { useEffect, useState, useRef } from 'react';
import { Property } from '@/api/properties';
import { createRoot } from 'react-dom/client';
import { PropertyMarker } from './PropertyMarker';

export function usePropertyMarkers(
  map: React.MutableRefObject<google.maps.Map | null>,
  markersRef: React.MutableRefObject<{ [key: number]: google.maps.Marker }>,
  propertiesWithOwners: Property[],
  mapLoaded: boolean,
  loading: boolean,
  showPropertyPopup: (property: Property, position: google.maps.LatLng) => void
) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [initialBoundsSet, setInitialBoundsSet] = useState(false);
  const markerElementsRef = useRef<{ [key: number]: HTMLDivElement }>({});

  const updateMarkerZIndex = (propertyId: number | null) => {
    // Safety check to ensure Google Maps is loaded
    if (!window.google || !mapLoaded) return;
    
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setZIndex(1);
    });

    if (propertyId !== null && markersRef.current[propertyId]) {
      markersRef.current[propertyId].setZIndex(3);
    }
  };

  useEffect(() => {
    // Safety check to ensure Google Maps is loaded
    if (!map.current || !mapLoaded || loading || !window.google) return;
    
    // Clear any markers that are no longer in the properties list
    Object.keys(markersRef.current).forEach(id => {
      const numericId = parseInt(id);
      if (!propertiesWithOwners.some(p => p.id === numericId)) {
        if (markersRef.current[numericId]) {
          markersRef.current[numericId].setMap(null);
          delete markersRef.current[numericId];
        }
      }
    });
    
    if (propertiesWithOwners.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    let propertiesWithCoords = 0;
    
    // Add more realistic map styling with terrain features and natural colors
    if (map.current) {
      try {
        map.current.setOptions({
          styles: [
            {
              // Land coloring - softer than pure white
              featureType: "landscape",
              elementType: "geometry",
              stylers: [
                { color: "#f2f2f0" }  // Slight off-white for land
              ]
            },
            {
              // Water features with a more realistic blue
              featureType: "water",
              elementType: "geometry",
              stylers: [
                { color: "#c8d7e3" }  // Light blue-gray for water
              ]
            },
            {
              // Roads with better visibility
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [
                { color: "#ffffff" }  // White roads
              ]
            },
            {
              // Road outlines for better definition
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#d9d9d9" }  // Light gray for road borders
              ]
            },
            {
              // Major highways
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [
                { color: "#f5cc88" }  // Light amber for highways
              ]
            },
            {
              // Highway strokes
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#e6b366" }  // Darker amber for highway borders
              ]
            },
            {
              // Parks and green areas
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [
                { color: "#cde6c2" }  // Light green for parks
              ]
            },
            {
              // Building footprints
              featureType: "administrative.locality",
              elementType: "all",
              stylers: [
                { saturation: 7 },
                { lightness: 19 },
                { visibility: "on" }
              ]
            },
            {
              // Text labels for cities and locations
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [
                { color: "#403E43" }  // Darker text for better readability
              ]
            },
            {
              // Transit lines
              featureType: "transit.line",
              stylers: [
                { color: "#9F9EA1" }  // Medium gray for transit lines
              ]
            },
            {
              // Transit stations
              featureType: "transit.station",
              stylers: [
                { saturation: -22 }
              ]
            },
            {
              // POI (Points of Interest) styling
              featureType: "poi",
              elementType: "all",
              stylers: [
                { visibility: "simplified" },
                { saturation: -30 }
              ]
            },
            {
              // Administrative borders
              featureType: "administrative.province",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#8A898C" },  // Medium gray for borders
                { weight: 1 }
              ]
            },
            {
              // Country borders
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [
                { color: "#555555" },  // Darker gray for country borders
                { weight: 1.2 }
              ]
            },
            {
              // Terrain/topography hints
              featureType: "landscape.natural",
              elementType: "geometry",
              stylers: [
                { color: "#eae8e4" },  // Natural terrain color
                { saturation: -15 },
                { lightness: 0 }
              ]
            }
          ]
        });
      } catch (error) {
        console.warn("Could not apply map styles:", error);
      }
    }

    // Filter out properties that are too close to each other to avoid cluttering
    const visibleProperties = propertiesWithOwners.filter(property => {
      if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') {
        return false;
      }
      return true;
    });

    // Process each property and create/update markers
    visibleProperties.forEach(property => {
      // Skip properties without proper coordinates
      if (typeof property.latitude !== 'number' || typeof property.longitude !== 'number') {
        return;
      }
      
      // Create LatLng coordinates for Google Maps
      const position = new window.google.maps.LatLng(property.latitude, property.longitude);
      
      // Extend map bounds to include this property
      bounds.extend(position);
      propertiesWithCoords++;
      
      // If marker already exists, update its position
      if (markersRef.current[property.id]) {
        markersRef.current[property.id].setPosition(position);
        return;
      }
      
      // Create a clean, modern marker instead of the default
      const marker = new window.google.maps.Marker({
        position,
        map: map.current,
        title: property.title,
        animation: window.google.maps.Animation.DROP,
        // Use a custom SVG marker matching the app's color scheme
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="18" fill="${property.isPremium ? '#CDA434' : property.listing_type === 'rent' ? '#3498DB' : '#27AE60'}" opacity="0.9"/>
              <circle cx="18" cy="18" r="8" fill="white" opacity="0.85"/>
              <circle cx="18" cy="18" r="6" fill="${property.isPremium ? '#CDA434' : property.listing_type === 'rent' ? '#3498DB' : '#27AE60'}"/>
            </svg>
          `),
          size: new window.google.maps.Size(36, 36),
          anchor: new window.google.maps.Point(18, 18),
          scaledSize: new window.google.maps.Size(36, 36)
        }
      });
      
      // Store the marker reference
      markersRef.current[property.id] = marker;
      
      // Add click event
      marker.addListener('click', () => {
        setActiveMarkerId(property.id);
        showPropertyPopup(property, position);
      });
    });

    // Only fit bounds if we haven't done it yet and we have properties with coordinates
    if (propertiesWithCoords > 0 && !initialBoundsSet) {
      map.current.fitBounds(bounds);
      
      // Set a reasonable zoom level to not be too zoomed in
      const currentZoom = map.current.getZoom() || 15;
      map.current.setZoom(Math.min(15, currentZoom));
      
      setInitialBoundsSet(true);
    }
  }, [propertiesWithOwners, mapLoaded, loading, showPropertyPopup, initialBoundsSet]);

  // Reset initialBoundsSet when properties are completely changed (like during a city change)
  useEffect(() => {
    if (propertiesWithOwners.length === 0) {
      setInitialBoundsSet(false);
    }
  }, [propertiesWithOwners]);

  return { activeMarkerId, setActiveMarkerId, updateMarkerZIndex };
}
