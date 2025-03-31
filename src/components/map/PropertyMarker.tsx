
import React from 'react';
import { formatPrice } from './mapUtils';
import { Building, Home, Construction, Castle } from 'lucide-react';

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

  // Get the appropriate icon based on listing type
  const Icon = () => {
    switch (listingType.toLowerCase()) {
      case 'rent':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'construction':
        return <Construction className="h-4 w-4 text-blue-500" />;
      case 'commercial':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'vacation':
        return <Castle className="h-4 w-4 text-blue-500" />;
      case 'sale':
      default:
        return <Home className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div 
      className="modern-marker flex items-center justify-center cursor-pointer z-10 transition-all duration-200 hover:scale-110"
      onClick={handleClick}
      style={{ 
        transformOrigin: 'center bottom',
        position: 'relative',
        bottom: 0
      }}
    >
      <div className="marker-bubble">
        <div className="marker-content">
          <div className="marker-icon">
            <Icon />
          </div>
          <div className="marker-price">
            {formatPrice(price)}
          </div>
        </div>
      </div>
    </div>
  );
}
