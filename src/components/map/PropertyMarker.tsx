
import React from 'react';
import { formatPrice } from './mapUtils';
import { MapPin } from 'lucide-react';

interface PropertyMarkerProps {
  price: string;
  isPremium?: boolean;
  listingType?: string;
  onClick: () => void;
}

export function PropertyMarker({ price, isPremium = false, listingType = 'sale', onClick }: PropertyMarkerProps) {
  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from being passed to the map
    onClick();
  };

  // Get the appropriate marker class based on listing type
  const getMarkerRingColor = () => {
    if (isPremium) return 'border-amber-400';
    
    switch (listingType.toLowerCase()) {
      case 'rent':
        return 'border-blue-500';
      case 'construction':
        return 'border-amber-500';
      case 'commercial':
        return 'border-purple-500';
      case 'vacation':
        return 'border-teal-500';
      case 'sale':
      default:
        return 'border-green-500';
    }
  };

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10 transition-transform hover:scale-110"
      onClick={handleClick}
    >
      <div className={`marker-circle-container ${getMarkerRingColor()}`}>
        <div className="marker-circle-inner">
          <div className="marker-price-text">
            {formatPrice(price)}
          </div>
        </div>
      </div>
    </div>
  );
}
