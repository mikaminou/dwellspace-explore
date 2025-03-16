
import React from 'react';
import { MapLoadingState, MapEmptyState } from './MapStates';
import { Property } from '@/api/properties';

interface MapContainerProps {
  loading: boolean;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  propertiesCount: number;
}

export function MapContainer({ loading, mapContainerRef, propertiesCount }: MapContainerProps) {
  return (
    <div className="relative flex-1 w-full">
      <MapLoadingState show={loading} />
      <MapEmptyState show={propertiesCount === 0 && !loading} />
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
