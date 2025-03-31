
import React from 'react';
import { formatPrice } from './mapUtils';
import { Building } from 'lucide-react';

interface PropertyMarkerProps {
  price: string;
  isPremium?: boolean;
  listingType?: string;
  onClick: () => void;
  isHovered?: boolean;
}

export function PropertyMarker({ 
  price, 
  isPremium = false, 
  listingType = 'sale', 
  onClick,
  isHovered = false
}: PropertyMarkerProps) {
  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from being passed to the map
    onClick();
  };

  // Get the appropriate border color based on listing type
  const getBorderColor = () => {
    if (isPremium) return '#CDA434'; // Gold for premium
    
    switch (listingType.toLowerCase()) {
      case 'rent':
        return '#3498DB'; // Blue
      case 'construction':
        return '#E67E22'; // Orange
      case 'commercial':
        return '#9B59B6'; // Purple
      case 'vacation':
        return '#1ABC9C'; // Teal
      case 'sale':
      default:
        return '#27AE60'; // Green
    }
  };

  return (
    <div 
      className={`custom-marker flex items-center justify-center cursor-pointer z-10 transition-transform ${isHovered ? 'scale-125' : 'hover:scale-110'}`}
      onClick={handleClick}
      style={{ 
        borderColor: getBorderColor(),
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '8px',
        padding: '2px'
      }}
    >
      <div className={`marker-bubble ${isHovered ? 'marker-hovered' : ''}`}>
        <span className="marker-price">{formatPrice(price)}</span>
        <div className="marker-pointer"></div>
      </div>
    </div>
  );
}
