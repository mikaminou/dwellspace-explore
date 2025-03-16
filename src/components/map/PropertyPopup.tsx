
import { Property } from "@/api/properties";
import { MessageCircle, Bookmark } from "lucide-react";

interface PropertyPopupProps {
  property: Property;
  onSave: (propertyId: number) => void;
  onMessageOwner: (ownerId: number) => void;
}

export function PropertyPopup({ property, onSave, onMessageOwner }: PropertyPopupProps): string {
  // Get the appropriate badge class based on listing type
  const getListingTypeBadgeClass = (type: string = 'sale') => {
    const listingType = type.toLowerCase();
    
    switch (listingType) {
      case 'rent':
        return 'bg-blue-500';
      case 'construction':
        return 'bg-amber-500';
      case 'commercial':
        return 'bg-purple-500';
      case 'vacation':
        return 'bg-teal-500';
      case 'sale':
      default:
        return 'bg-green-500';
    }
  };

  // Create HTML string for the popup
  return `
    <div class="property-popup-content cursor-pointer p-0 overflow-hidden rounded-xl shadow-lg" data-property-id="${property.id}">
      <div class="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img 
          src="${property.featured_image_url || property.image || '/placeholder.svg'}" 
          alt="${property.title}" 
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>
        ${property.isPremium ? 
          `<div class="absolute top-3 right-3 bg-luxury text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">Premium</div>` : ''}
        ${property.listing_type ? 
          `<div class="absolute bottom-3 left-3 ${getListingTypeBadgeClass(property.listing_type)} bg-opacity-90 text-white text-xs px-3 py-1.5 rounded-full shadow-md capitalize">${property.listing_type}</div>` : ''}
        <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          <span class="text-primary font-bold text-sm">${property.price}</span>
        </div>
      </div>
      <div class="p-4 bg-white">
        <h3 class="font-semibold text-lg mb-1 truncate">${property.title}</h3>
        <p class="text-xs text-gray-500 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${property.location}
        </p>
        <div class="flex items-center gap-4 mb-3 text-xs text-gray-600">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Z"></path><path d="M22 8H2"></path><path d="M7 3v3"></path><path d="M17 3v3"></path><rect x="6" y="12" width="3" height="3"></rect></svg>
            <span>${property.beds} beds</span>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M9 6 4 6 4 16 14 16 14 11"></path><path d="m9 10 5-5"></path><path d="m5.5 14.5 3-3"></path><path d="M14 6h-1"></path><path d="M14 9h-1"></path><path d="m17 13 4 4"></path><path d="m8 6 2 2"></path><path d="M11 6h1"></path></svg>
            <span>${property.baths || 0} baths</span>
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>
            <span>${property.living_area || 0} m²</span>
          </div>
        </div>
        ${property.owner ? `
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
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
            <div class="flex items-center gap-2">
              <button 
                class="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors" 
                aria-label="Message owner"
                data-action="message"
                data-owner-id="${property.owner.id || 0}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </button>
              <button 
                class="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors" 
                aria-label="Save property"
                data-action="save"
                data-property-id="${property.id}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}
