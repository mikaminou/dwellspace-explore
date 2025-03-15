
import { Property } from "@/api/properties";
import { MessageCircle, Save } from "lucide-react";

interface PropertyPopupProps {
  property: Property;
  onSave: (propertyId: number) => void;
  onMessageOwner: (ownerId: number) => void;
}

export function PropertyPopup({ property, onSave, onMessageOwner }: PropertyPopupProps): string {
  // Create HTML string for the popup
  // In a real React app, you'd use ReactDOM.render or portals
  return `
    <div class="property-popup-content cursor-pointer" data-property-id="${property.id}">
      <div class="relative w-full h-40 bg-gray-200 mb-2">
        <img 
          src="${property.featured_image_url || property.image || '/placeholder.svg'}" 
          alt="${property.title}" 
          class="w-full h-full object-cover"
        />
        ${property.isPremium ? 
          `<div class="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">Premium</div>` : ''}
        ${property.listing_type ? 
          `<div class="absolute bottom-2 left-2 bg-primary bg-opacity-90 text-white text-xs px-2 py-1 rounded capitalize">${property.listing_type}</div>` : ''}
      </div>
      <h3 class="font-semibold text-sm mb-1 truncate">${property.title}</h3>
      <p class="text-primary font-medium text-sm mb-1">${property.price}</p>
      <p class="text-xs text-gray-500 mb-2">${property.location}</p>
      <div class="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <span>${property.beds} beds</span>
        <span>•</span>
        <span>${property.baths || 0} baths</span>
        <span>•</span>
        <span>${property.living_area || 0} m²</span>
      </div>
      ${property.owner ? `
        <div class="flex items-center justify-between mb-2 border-t border-gray-100 pt-2">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              ${property.owner.avatar_url ? 
                `<img src="${property.owner.avatar_url}" alt="Agent" class="w-full h-full object-cover" />` : 
                `<span class="text-xs font-medium">${property.owner.first_name?.charAt(0) || ''}${property.owner.last_name?.charAt(0) || ''}</span>`
              }
            </div>
            <div class="text-xs">
              <p class="font-medium">${property.owner.first_name || ''} ${property.owner.last_name || ''}</p>
              <p class="text-gray-500">${property.owner.role || ''}</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button 
              class="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
              aria-label="Message owner"
              data-action="message"
              data-owner-id="${property.owner.id || 0}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            </button>
            <button 
              class="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
              aria-label="Save property"
              data-action="save"
              data-property-id="${property.id}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
