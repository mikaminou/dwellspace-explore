
import React from 'react';

interface PropertyMarkerProps {
  price: string | number;
  onClick: () => void;
}

// Helper function for formatting price with error handling
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
      if (isNaN(amount)) return price; // Return original if parsing fails
      
      return `$${amount.toLocaleString()}`;
    }
    
    // If it's a number
    return `$${price.toLocaleString()}`;
  } catch (error) {
    console.error("Error formatting price:", error);
    return String(price) || 'N/A';
  }
};

export function PropertyMarker({ price, onClick }: PropertyMarkerProps) {
  console.log("Rendering PropertyMarker with price:", price);

  // Handle click event properly with stopPropagation to prevent map interactions
  const handleClick = (e: React.MouseEvent) => {
    console.log("PropertyMarker clicked");
    e.preventDefault(); // Prevent default action
    e.stopPropagation(); // Prevent the click from being passed to the map
    
    // Add a small delay to give time for the DOM to stabilize
    setTimeout(() => {
      try {
        onClick();
      } catch (error) {
        console.error("Error in marker click handler:", error);
      }
    }, 10);
  };

  // Make sure price is a valid string
  const displayPrice = formatPrice(price);

  return (
    <div 
      className="custom-marker flex items-center justify-center cursor-pointer z-10"
      onClick={handleClick}
    >
      <div className="bg-primary text-white px-3 py-1.5 text-xs rounded-full shadow-md hover:bg-primary/90 transition-colors font-medium select-none">
        {displayPrice}
      </div>
    </div>
  );
}
