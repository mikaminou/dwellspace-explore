
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
  
  // Add effect to log when component mounts and check visibility
  useEffect(() => {
    console.log('[PropertyMarker] Component mounted', { 
      price, 
      propertyType, 
      element: markerRef.current 
    });
    
    // Check element's visibility after it's mounted
    if (markerRef.current) {
      const rect = markerRef.current.getBoundingClientRect();
      console.log('[PropertyMarker] Element position and size:', {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0
      });
      
      // Check computed styles
      const computedStyle = window.getComputedStyle(markerRef.current);
      console.log('[PropertyMarker] Element computed style:', {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        zIndex: computedStyle.zIndex,
        position: computedStyle.position,
        opacity: computedStyle.opacity
      });
    }
    
    // Add a delayed check to see if the element is still in DOM
    setTimeout(() => {
      if (markerRef.current) {
        console.log('[PropertyMarker] Element still in DOM after 2s');
        const rect = markerRef.current.getBoundingClientRect();
        console.log('[PropertyMarker] Element position after 2s:', rect);
      } else {
        console.log('[PropertyMarker] Element no longer in DOM after 2s');
      }
    }, 2000);
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
        zIndex: 1000, 
        pointerEvents: 'auto',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'transparent', // Debug style
        padding: '5px', // Debug style
      }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div 
            className="price-bubble bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none"
            style={{ 
              pointerEvents: 'auto',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              position: 'relative',
              border: '2px solid white', // Debug style to make more visible
            }}
            onClick={handleClick}
          >
            <div className="flex items-center gap-1">
              {typeIcon}
              <span>{displayPrice}</span>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-52 p-2 text-xs z-[9999]">
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
