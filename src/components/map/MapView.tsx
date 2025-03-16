
import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapViewContent } from './MapViewContent';
import { CriticalErrorFallback } from './fallbacks/MapFallbackStates';

function MapView() {
  // Error boundary state
  const [criticalError, setCriticalError] = useState<Error | null>(null);

  // Catch any errors from child components
  try {
    return <MapViewContent />;
  } catch (error) {
    console.error("Critical error in MapView:", error);
    return (
      <CriticalErrorFallback 
        error={error instanceof Error ? error : String(error)} 
        onRetry={() => window.location.reload()} 
      />
    );
  }
}

export default MapView;
