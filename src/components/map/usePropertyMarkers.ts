
import { useRef } from 'react';
import { Property } from '@/api/properties';

export function usePropertyMarkers({
  map,
  properties,
  mapLoaded,
  loading,
  onMarkerClick
}: {
  map: React.MutableRefObject<any | null>;
  properties: Property[];
  mapLoaded: boolean;
  loading: boolean;
  onMarkerClick: (property: Property, coordinates: [number, number]) => void;
}) {
  const markersRef = useRef<{ [key: number]: any }>({});

  // No actual markers are created
  console.log('Map feature disabled: usePropertyMarkers called with', properties.length, 'properties');

  return {
    markersRef
  };
}
