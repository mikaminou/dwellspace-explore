
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, BedDoubleIcon, HomeIcon, TicketIcon } from "lucide-react";
import { Property } from "@/api/properties";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { t, dir } = useLanguage();
  
  const getPropertyImage = (property: Property): string => {
    if (property.featured_image_url) return property.featured_image_url;
    if (property.gallery_image_urls && property.gallery_image_urls.length > 0) 
      return property.gallery_image_urls[0];
    
    if (property.image) return property.image;
    if (property.images && property.images.length > 0)
      return property.images[0];
      
    return "/img/placeholder-property.jpg";
  };

  const getListingTypeColor = (property: Property): string => {
    if (property.listing_type === 'rent') return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
    if (property.listing_type === 'construction') return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'; // default for sale
  };

  const getListingTypeText = (property: Property): string => {
    if (property.listing_type === 'rent') return t('property.forRent');
    if (property.listing_type === 'construction') return t('property.underConstruction');
    return t('property.forSale'); // default for sale
  };

  const isPremiumProperty = property.isPremium || (property.owner && property.owner.role === 'seller');

  return (
    <Link 
      to={`/property/${property.id}`} 
      className={`property-card group hover:scale-[1.02] transition-all bg-white dark:bg-card ${isPremiumProperty ? 'premium-property' : ''}`}
    >
      <div className="relative">
        {isPremiumProperty && (
          <div className="luxury-badge">
            {t('luxury.badge')}
          </div>
        )}
        <Badge className={`absolute top-2 left-2 flex items-center gap-1 z-10 ${getListingTypeColor(property)}`}>
          <TicketIcon className="h-3 w-3 mr-1" />
          {getListingTypeText(property)}
        </Badge>
        <img
          src={getPropertyImage(property)}
          alt={property.title}
          className="property-image h-64 w-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant={isPremiumProperty ? "white" : "secondary"}
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {t('property.save')}
          </Button>
        </div>
      </div>
      <div className={`p-4 border border-t-0 rounded-b-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
        <div className={`flex justify-between items-start mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <h3 className={`text-lg font-semibold ${dir === 'rtl' ? 'arabic-text' : ''}`}>{property.title}</h3>
          <span className={`${isPremiumProperty ? 'text-luxury' : 'text-primary'} font-semibold ${dir === 'rtl' ? 'arabic-text' : ''}`}>
            {property.price}
          </span>
        </div>
        <div className={`flex flex-col space-y-1 text-muted-foreground`}>
          <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
            <MapPinIcon className="h-4 w-4" />
            {property.location}
          </span>
          <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
            <BedDoubleIcon className="h-4 w-4" />
            {property.beds} {t('property.beds')}
          </span>
          <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
            <HomeIcon className="h-4 w-4" />
            {property.type}
          </span>
        </div>
      </div>
    </Link>
  );
}
