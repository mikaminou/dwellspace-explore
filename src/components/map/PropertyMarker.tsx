
import React from 'react';
import { formatPrice } from './mapUtils';

interface PropertyMarkerProps {
  price: string;
  onClick: () => void;
}

export function PropertyMarker({ price, onClick }: PropertyMarkerProps) {
  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-primary text-white px-2 py-1 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors">
        {formatPrice(price)}
      </div>
    </div>
  );
}
