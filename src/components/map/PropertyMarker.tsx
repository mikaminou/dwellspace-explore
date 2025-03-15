
import React from 'react';
import { formatPrice } from './mapUtils';

interface PropertyMarkerProps {
  price: string;
  onClick: () => void;
  isActive?: boolean;
}

export function PropertyMarker({ price, onClick, isActive = false }: PropertyMarkerProps) {
  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click from being passed to the map
    onClick();
  };

  return (
    <div 
      className={`custom-marker flex items-center justify-center cursor-pointer ${isActive ? 'z-20' : 'z-10'}`}
      onClick={handleClick}
    >
      <div 
        className={`${isActive ? 'bg-primary-dark scale-110' : 'bg-primary'} 
                   text-white px-3 py-1.5 text-xs rounded-full shadow-md 
                   hover:bg-primary/90 transition-all font-medium select-none`}
      >
        {formatPrice(price)}
      </div>
    </div>
  );
}
