
import React from 'react';
import { formatPrice } from './mapUtils';

interface PropertyMarkerProps {
  price: string;
  onClick: () => void;
}

export function PropertyMarker({ price, onClick }: PropertyMarkerProps) {
  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Prevent the click from being passed to the map
    
    // Add a small delay to give time for the DOM to stabilize
    setTimeout(() => {
      try {
        onClick();
      } catch (error) {
        console.error("Error in marker click handler:", error);
      }
    }, 10);
  };

  // Make sure price is a valid string
  const safePrice = typeof price === 'string' ? price : String(price || '0');

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10"
      onClick={handleClick}
    >
      <div className="bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none">
        {formatPrice(safePrice)}
      </div>
    </div>
  );
}
