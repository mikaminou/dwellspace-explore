
import React from "react";
import { Property } from "@/api/properties";
import { MessageCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyPopupProps {
  property: Property;
  onSave: (propertyId: number) => void;
  onMessageOwner: (ownerId: number) => void;
  onClick?: () => void;
}

export function PropertyPopup({ 
  property, 
  onSave, 
  onMessageOwner,
  onClick
}: PropertyPopupProps) {
  return (
    <div 
      className="property-popup-content cursor-pointer p-4" 
      data-property-id={property.id}
      onClick={onClick}
    >
      <div className="relative w-full h-48 bg-gray-200 mb-3 rounded-md overflow-hidden">
        <img 
          src={property.featured_image_url || property.image || '/placeholder.svg'} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        {property.isPremium && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Premium
          </div>
        )}
        {property.listing_type && (
          <div className="absolute bottom-2 left-2 bg-primary bg-opacity-90 text-white text-xs px-2 py-1 rounded capitalize">
            {property.listing_type}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-sm mb-1 truncate">{property.title}</h3>
      <p className="text-primary font-medium text-sm mb-1">{property.price}</p>
      <p className="text-xs text-gray-500 mb-2">{property.location}</p>
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <span>{property.beds} beds</span>
        <span>•</span>
        <span>{property.baths || 0} baths</span>
        <span>•</span>
        <span>{property.living_area || 0} m²</span>
      </div>
      {property.owner && (
        <div className="flex items-center justify-between mb-2 border-t border-gray-100 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {property.owner.avatar_url ? (
                <img src={property.owner.avatar_url} alt="Agent" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium">
                  {property.owner.first_name?.charAt(0) || ''}
                  {property.owner.last_name?.charAt(0) || ''}
                </span>
              )}
            </div>
            <div className="text-xs">
              <p className="font-medium">
                {property.owner.first_name || ''} {property.owner.last_name || ''}
              </p>
              <p className="text-gray-500">{property.owner.role || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
              aria-label="Message owner"
              onClick={(e) => {
                e.stopPropagation();
                onMessageOwner(property.owner?.id || 0);
              }}
            >
              <MessageCircle className="h-4 w-4" />
            </button>
            <button 
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
              aria-label="Save property"
              onClick={(e) => {
                e.stopPropagation();
                onSave(property.id);
              }}
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
