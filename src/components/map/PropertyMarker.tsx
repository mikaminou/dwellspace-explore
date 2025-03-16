
import React from 'react';
import { formatPrice } from './mapUtils';
import { Home, Building, Construction } from 'lucide-react';

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
  const getMarkerClass = () => {
    if (isPremium) return 'premium-marker';
    
    switch (listingType) {
      case 'rent':
        return 'rent-marker';
      case 'construction':
        return 'construction-marker';
      case 'sale':
      default:
        return 'sale-marker';
    }
  };

  // Get the appropriate icon based on listing type
  const Icon = () => {
    switch (listingType) {
      case 'rent':
        return <Building size={16} className="text-white" />;
      case 'construction':
        return <Construction size={16} className="text-white" />;
      case 'sale':
      default:
        return <Home size={16} className="text-white" />;
    }
  };

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10 transition-transform hover:scale-110"
      onClick={handleClick}
    >
      <div className={`marker-container ${getMarkerClass()}`}>
        <div className="marker-icon">
          <Icon />
        </div>
        <div className="marker-price">
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
}
