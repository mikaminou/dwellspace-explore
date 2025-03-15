
import React from 'react';
import { formatPrice } from './mapUtils';

interface PropertyMarkerProps {
  price: string;
  onClick: () => void;
}

export function PropertyMarker({ price, onClick }: PropertyMarkerProps) {
  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from being passed to the map
    onClick();
  };

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10"
      onClick={handleClick}
    >
      <div className="bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none">
        {formatPrice(price)}
      </div>
    </div>
  );
}
