
import { Property } from "@/api/properties";
import { Link } from "react-router-dom";

interface PropertyPopupProps {
  property: Property;
}

export function PropertyPopup({ property }: PropertyPopupProps): string {
  // Create HTML string for the popup
  // In a real React app, you'd use ReactDOM.render or portals
  return `
    <div class="property-popup-content">
      <div class="relative w-full h-32 bg-gray-200 mb-2">
        <img 
          src="${property.featured_image_url || property.image || '/placeholder.svg'}" 
          alt="${property.title}" 
          class="w-full h-full object-cover"
        />
        ${property.isPremium || property.listing_type === 'premium' ? 
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
        <div class="flex items-center gap-2 mb-2 border-t border-gray-100 pt-2">
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
      ` : ''}
      <a href="/property/${property.id}" class="block w-full bg-primary text-white text-center py-1 px-3 rounded text-sm">
        View Details
      </a>
    </div>
  `;
}
