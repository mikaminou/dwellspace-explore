
import React, { useEffect, useRef } from 'react';
import { Building, Home, Landmark, MapPin } from 'lucide-react';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from "@/components/ui/hover-card";

interface PropertyMarkerProps {
  price: string | number;
  onClick: () => void;
  propertyType?: string;
  beds?: number;
  baths?: number;
  area?: number | string;
}

// Helper function to format price with error handling
const formatPrice = (price: string | number): string => {
  try {
    if (!price) return 'N/A';
    
    // If it's already a string, make sure it's clean
    if (typeof price === 'string') {
      // Remove any non-numeric characters except for decimal point
      const numericValue = price.replace(/[^\d.]/g, '');
      if (!numericValue) return 'N/A';
      
      // Format the number
      const amount = parseFloat(numericValue);
      if (isNaN(amount)) return String(price); // Return original if parsing fails
      
      return `$${amount.toLocaleString()}`;
    }
    
    // If it's a number
    return `$${price.toLocaleString()}`;
  } catch (error) {
    console.error("[PropertyMarker] Error formatting price:", error);
    return String(price) || 'N/A';
  }
};

// Helper function to get the appropriate icon based on property type
const getPropertyTypeIcon = (propertyType?: string) => {
  if (!propertyType) return <MapPin className="h-3 w-3" />;
  
  const type = propertyType.toLowerCase();
  
  if (type.includes('house') || type.includes('home') || type.includes('villa')) {
    return <Home className="h-3 w-3" />;
  } else if (type.includes('apartment') || type.includes('flat') || type.includes('condo') || type.includes('loft')) {
    return <Building className="h-3 w-3" />;
  } else if (type.includes('mansion') || type.includes('estate') || type.includes('penthouse')) {
    return <Landmark className="h-3 w-3" />;
  }
  
  return <MapPin className="h-3 w-3" />;
};

export function PropertyMarker({ 
  price, 
  onClick, 
  propertyType,
  beds,
  baths,
  area
}: PropertyMarkerProps) {
  console.log(`[PropertyMarker] Rendering marker with price: ${price}, type: ${propertyType}`);
  
  // Format price for display
  const displayPrice = formatPrice(price);
  const typeIcon = getPropertyTypeIcon(propertyType);
  const markerRef = useRef<HTMLDivElement>(null);
  
  // Add effect to fix visibility issues
  useEffect(() => {
    console.log('[PropertyMarker] Component mounted', { 
      price, 
      propertyType, 
      element: markerRef.current 
    });
    
    // Force visibility with a slight delay to ensure DOM is ready
    const forceVisibility = () => {
      if (markerRef.current) {
        // Apply direct styles to override any potential CSS conflicts
        markerRef.current.style.display = 'block';
        markerRef.current.style.visibility = 'visible';
        markerRef.current.style.opacity = '1';
        markerRef.current.style.pointerEvents = 'auto';
        markerRef.current.style.zIndex = '99999'; // Extremely high z-index
        
        // Find and force visibility of price bubble inside the marker
        const priceBubble = markerRef.current.querySelector('.price-bubble');
        if (priceBubble instanceof HTMLElement) {
          priceBubble.style.display = 'inline-flex';
          priceBubble.style.visibility = 'visible';
          priceBubble.style.opacity = '1';
          priceBubble.style.zIndex = '99999';
          priceBubble.style.transform = 'scale(2.0)'; // Make it much larger
          priceBubble.style.background = 'red'; // Change to a very noticeable color
          priceBubble.style.padding = '10px 20px';
          priceBubble.style.border = '4px solid white';
          priceBubble.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        }
        
        const rect = markerRef.current.getBoundingClientRect();
        console.log('[PropertyMarker] Element position after force visibility:', rect);
      }
    };
    
    // Force visibility immediately and then again after a delay
    forceVisibility();
    setTimeout(forceVisibility, 500);
    setTimeout(forceVisibility, 2000);
  }, [price, propertyType]);
  
  const handleClick = (e: React.MouseEvent) => {
    console.log('[PropertyMarker] Marker clicked', e);
    e.stopPropagation();
    onClick();
  };

  return (
    <div 
      ref={markerRef}
      className="marker-wrapper" 
      onClick={handleClick}
      style={{ 
        zIndex: 99999, 
        pointerEvents: 'auto',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        padding: '5px',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        transform: 'scale(2.0)', // Make it twice as large
        transformOrigin: 'center bottom'
      }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div 
            className="price-bubble"
            style={{ 
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              zIndex: 99999,
              position: 'relative',
              border: '4px solid white', // Much more visible border
              backgroundColor: 'red', // Change to red for better visibility
              color: 'white',
              padding: '10px 20px', // Larger padding
              borderRadius: '999px',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)', // More prominent shadow
              fontWeight: 700,
              fontSize: '16px', // Larger font
              transform: 'scale(2.0)', // Make much larger
              visibility: 'visible',
              opacity: 1
            }}
            onClick={handleClick}
          >
            <div className="flex items-center gap-1">
              {typeIcon}
              <span>{displayPrice}</span>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-52 p-2 text-xs z-[99999]">
          <div className="space-y-1.5">
            {propertyType && (
              <div className="font-medium capitalize">{propertyType}</div>
            )}
            <div className="flex gap-2 text-muted-foreground">
              {beds !== undefined && <span>{beds} beds</span>}
              {baths !== undefined && <span>{baths} baths</span>}
              {area && <span>{area} m²</span>}
            </div>
            <div className="text-primary-foreground font-semibold text-sm pt-1">
              {displayPrice}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
