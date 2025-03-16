
import { Property } from "@/api/properties";
import { formatPrice } from './mapUtils';
import { Home, Building, Construction, Castle } from 'lucide-react';

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

  // Get color for buttons and interactive elements
  const getListingTypeAccentClass = (type: string = 'sale') => {
    const listingType = type.toLowerCase();
    
    switch (listingType) {
      case 'rent':
        return 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500';
      case 'construction':
        return 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500';
      case 'commercial':
        return 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500';
      case 'vacation':
        return 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-500';
      case 'sale':
      default:
        return 'bg-green-500/10 hover:bg-green-500/20 text-green-500';
    }
  };

  // Get the appropriate icon based on listing type
  const getListingTypeIcon = () => {
    const listingType = property.listing_type?.toLowerCase() || 'sale';
    
    switch (listingType) {
      case 'rent':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M1 22V9.8c0-.4.2-.8.6-1l.9-.7c.6-.5.6-1.4 0-1.8L1.6 5C1.2 4.7 1 4.3 1 3.8V2h5v20H1Z"></path><path d="M12.5 2h6.5v20h-10V9.5a1 1 0 0 1 .34-.7l3-2.5a1 1 0 0 1 1.32 0l3 2.5a1 1 0 0 1 .34.7V22"></path><path d="M12 22V14"></path><path d="M18 9h.01"></path><path d="M18 6h.01"></path><path d="M15 12h.01"></path><path d="M15 15h.01"></path><path d="M15 18h.01"></path></svg>`;
      case 'construction':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><rect x="2" y="6" width="20" height="8" rx="1"></rect><path d="M17 14v7"></path><path d="M7 14v7"></path><path d="M17 3v3"></path><path d="M7 3v3"></path><path d="M10 14 2.3 6.3"></path><path d="m14 6 7.7 7.7"></path><path d="m8 6 8 8"></path></svg>`;
      case 'commercial':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>`;
      case 'vacation':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M22 20V8h-4l-6-6-6 6H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"></path><path d="M6 18h.01"></path><path d="M6 14h.01"></path><path d="M6 10h.01"></path><path d="M10 18h.01"></path><path d="M10 14h.01"></path><path d="M10 10h.01"></path><path d="M14 18h.01"></path><path d="M14 14h.01"></path><path d="M14 10h.01"></path><path d="M18 18h.01"></path><path d="M18 14h.01"></path><path d="M18 10h.01"></path></svg>`;
      case 'sale':
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    }
  };

  // Get listing type color for border
  const getListingTypeBorderColor = (type: string = 'sale') => {
    const listingType = type.toLowerCase();
    
    switch (listingType) {
      case 'rent':
        return 'border-blue-500';
      case 'construction':
        return 'border-amber-500';
      case 'commercial':
        return 'border-purple-500';
      case 'vacation':
        return 'border-teal-500';
      case 'sale':
      default:
        return 'border-green-500';
    }
  };

  // Get listing type color for price
  const getListingTypePriceColor = (type: string = 'sale') => {
    const listingType = type.toLowerCase();
    
    switch (listingType) {
      case 'rent':
        return 'text-blue-500';
      case 'construction':
        return 'text-amber-500';
      case 'commercial':
        return 'text-purple-500';
      case 'vacation':
        return 'text-teal-500';
      case 'sale':
      default:
        return 'text-green-500';
    }
  };

  const listingType = property.listing_type?.toLowerCase() || 'sale';
  const badgeClass = getListingTypeBadgeClass(listingType);
  const borderColor = getListingTypeBorderColor(listingType);
  const accentClass = getListingTypeAccentClass(listingType);
  const priceColor = getListingTypePriceColor(listingType);

  // Create HTML string for the popup
  return `
    <div class="property-popup-content cursor-pointer p-0 overflow-hidden rounded-xl shadow-lg ${borderColor} border-2" data-property-id="${property.id}">
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
          `<div class="absolute bottom-3 left-3 ${badgeClass} bg-opacity-90 text-white text-xs px-3 py-1.5 rounded-full shadow-md capitalize flex items-center">
            ${getListingTypeIcon()}
            ${property.listing_type}
          </div>` : ''}
        <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          <span class="${priceColor} font-bold text-sm">${property.price}</span>
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
                class="p-2 ${accentClass} rounded-full transition-colors" 
                aria-label="Message owner"
                data-action="message"
                data-owner-id="${property.owner.id || 0}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </button>
              <button 
                class="p-2 ${accentClass} rounded-full transition-colors" 
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
