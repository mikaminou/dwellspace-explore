
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Property } from '@/api/properties';
import { toast } from 'sonner';

export function usePropertyMarkers({
  map,
  properties,
  mapLoaded,
  loading,
  onMarkerClick
}: {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  properties: Property[];
  mapLoaded: boolean;
  loading: boolean;
  onMarkerClick: (property: Property, coordinates: [number, number]) => void;
}) {
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});

  // Update markers when properties change
  useEffect(() => {
    // Check if map or mapboxgl is available
    if (!map.current || !mapLoaded || loading || !mapboxgl) {
      console.log('Map not ready for markers:', { 
        mapExists: !!map.current, 
        mapLoaded, 
        loading,
        mapboxGlExists: !!mapboxgl
      });
      return;
    }
    
    try {
      // Guard against undefined LngLatBounds constructor
      if (!mapboxgl.LngLatBounds) {
        console.error('mapboxgl.LngLatBounds is not defined');
        return;
      }

      // Remove existing markers
      Object.values(markersRef.current).forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.error('Error removing marker:', e);
        }
      });
      markersRef.current = {};

      if (!properties || properties.length === 0) {
        console.log('No properties to display markers for');
        return;
      }

      console.log(`Adding ${properties.length} property markers to map`);
      
      const bounds = new mapboxgl.LngLatBounds();
      let propertiesWithCoords = 0;
      let missingCoords = 0;

      properties.forEach(property => {
        if (!property) {
          console.warn('Null property in properties array');
          return;
        }
        
        try {
          // Use the stored longitude and latitude from the database
          if (property.longitude === undefined || property.latitude === undefined) {
            console.warn(`Property ${property.id} has no coordinates in the database`);
            missingCoords++;
            return;
          }

          const lng = Number(property.longitude);
          const lat = Number(property.latitude);
          
          // Validate coordinates are valid numbers
          if (isNaN(lng) || isNaN(lat)) {
            console.warn(`Property ${property.id} has invalid coordinates: [${lng}, ${lat}]`);
            missingCoords++;
            return;
          }

          // Ensure coordinates are in valid range
          if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
            console.warn(`Property ${property.id} has out-of-range coordinates: [${lng}, ${lat}]`);
            missingCoords++;
            return;
          }

          // Extend map bounds to include this property
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
            .setLngLat([lng, lat]);
          
          // Only add to map if map exists
          if (map.current) {
            marker.addTo(map.current);
          }

          const priceElement = document.createElement('div');
          priceElement.className = 'price-bubble bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none cursor-pointer';
          priceElement.innerText = property.price || 'N/A';
          markerEl.appendChild(priceElement);

          // Add city name as data attribute for debugging
          if (property.city) {
            priceElement.setAttribute('data-city', property.city);
          }

          priceElement.addEventListener('click', (e) => {
            e.stopPropagation();
            onMarkerClick(property, [lng, lat]);
          });

          markersRef.current[property.id] = marker;
        } catch (markerError) {
          console.error(`Error creating marker for property ${property.id}:`, markerError);
        }
      });

      if (propertiesWithCoords > 0 && map.current) {
        try {
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });
        } catch (boundsError) {
          console.error('Error fitting bounds:', boundsError);
        }
      } else {
        console.warn('No properties with valid coordinates found');
      }

      if (missingCoords > 0) {
        console.warn(`${missingCoords} properties are missing valid coordinates`);
      }
    } catch (error) {
      console.error('Error updating property markers:', error);
      toast.error('Error displaying properties on map');
    }
  }, [properties, mapLoaded, loading, onMarkerClick, map]);

  return {
    markersRef
  };
}
