
import React from 'react';
import { formatPrice } from './mapUtils';
import { Home } from 'lucide-react';

interface PropertyMarkerProps {
  price: string;
  isPremium?: boolean;
  onClick: () => void;
}

export function PropertyMarker({ price, isPremium = false, onClick }: PropertyMarkerProps) {
  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from being passed to the map
    onClick();
  };

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10 transition-transform hover:scale-110"
      onClick={handleClick}
    >
      <div className={`marker-container ${isPremium ? 'premium-marker' : 'standard-marker'}`}>
        <div className="marker-icon">
          <Home size={16} className="text-white" />
        </div>
        <div className="marker-price">
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
}
