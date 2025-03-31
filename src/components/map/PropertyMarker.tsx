
import React from 'react';
import { formatPrice } from './mapUtils';
import { MapPin, Home, Building, Construction, Castle } from 'lucide-react';

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
    
    switch (listingType.toLowerCase()) {
      case 'rent':
        return 'rent-marker';
      case 'construction':
        return 'construction-marker';
      case 'commercial':
        return 'commercial-marker';
      case 'vacation':
        return 'vacation-marker';
      case 'sale':
      default:
        return 'sale-marker';
    }
  };

  // Get the appropriate icon based on listing type
  const Icon = () => {
    return <MapPin size={18} className="text-white" />;
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
