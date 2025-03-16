
import React from 'react';
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
    console.error("Error formatting price:", error);
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
  // Format price for display
  const displayPrice = formatPrice(price);
  const typeIcon = getPropertyTypeIcon(propertyType);

  return (
    <div 
      className="marker-wrapper" 
      onClick={onClick}
      style={{ 
        zIndex: 100, 
        pointerEvents: 'auto',
        position: 'relative',
        cursor: 'pointer'
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
              whiteSpace: 'nowrap'
            }}
          >
            <div className="flex items-center gap-1">
              {typeIcon}
              <span>{displayPrice}</span>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-52 p-2 text-xs z-[1000]">
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
