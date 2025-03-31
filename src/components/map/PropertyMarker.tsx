
import React from 'react';
import { formatPrice } from './mapUtils';
import { Building } from 'lucide-react';

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

  // Get the appropriate icon color based on listing type
  const getIconColor = () => {
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

  // Get the appropriate glow color for the hover effect
  const getGlowColor = () => {
    if (isPremium) return 'rgba(205, 164, 52, 0.5)'; // Gold for premium
    
    switch (listingType.toLowerCase()) {
      case 'rent':
        return 'rgba(52, 152, 219, 0.5)'; // Blue
      case 'construction':
        return 'rgba(230, 126, 34, 0.5)'; // Orange
      case 'commercial':
        return 'rgba(155, 89, 182, 0.5)'; // Purple
      case 'vacation':
        return 'rgba(26, 188, 156, 0.5)'; // Teal
      case 'sale':
      default:
        return 'rgba(39, 174, 96, 0.5)'; // Green
    }
  };

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10 transition-transform hover:scale-110"
      onClick={handleClick}
      style={{
        position: 'relative',
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div 
        className="marker-bubble"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '6px 10px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          whiteSpace: 'nowrap',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          minWidth: '80px',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <span 
          className="marker-price"
          style={{
            color: '#333',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          {formatPrice(price)}
        </span>
        <div 
          className="marker-pointer"
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '12px',
            height: '12px',
            backgroundColor: 'white',
            boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.05)',
            borderRight: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
        ></div>
        <div
          className="marker-icon"
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: getIconColor(),
            borderRadius: '50%',
            padding: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '2px solid white',
            transition: 'all 0.3s ease'
          }}
        >
          <Building size={13} color="white" />
        </div>
      </div>
      <style jsx>{`
        /* Highlighted marker state - injected via CSS */
        .marker-highlighted .marker-bubble {
          box-shadow: 0 5px 15px ${getGlowColor()};
          transform: scale(1.05);
        }
        
        .marker-highlighted .marker-icon {
          transform: translateX(-50%) scale(1.15);
          box-shadow: 0 0 10px ${getGlowColor()};
        }
      `}</style>
    </div>
  );
}
