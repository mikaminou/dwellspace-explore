
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPinIcon, BedDoubleIcon, HomeIcon, BookmarkIcon, SquareIcon, TreesIcon, Building, Construction, Castle } from "lucide-react";
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

  const getListingTypeIcon = (property: Property) => {
    switch (property.listing_type?.toLowerCase()) {
      case 'rent':
        return <Building className="h-3 w-3 mr-1" />;
      case 'construction':
        return <Construction className="h-3 w-3 mr-1" />;
      case 'commercial':
        return <Building className="h-3 w-3 mr-1" />;
      case 'vacation':
        return <Castle className="h-3 w-3 mr-1" />;
      case 'sale':
      default:
        return <HomeIcon className="h-3 w-3 mr-1" />;
    }
  };

  const getListingTypeColor = (property: Property): string => {
    const listingType = property.listing_type?.toLowerCase() || 'sale';
    
    if (listingType === 'rent') return 'bg-blue-500 text-white';
    if (listingType === 'construction') return 'bg-amber-500 text-white';
    if (listingType === 'commercial') return 'bg-purple-500 text-white';
    if (listingType === 'vacation') return 'bg-teal-500 text-white';
    return 'bg-green-500 text-white'; // default for sale
  };

  const getListingTypeText = (property: Property): string => {
    const listingType = property.listing_type?.toLowerCase() || 'sale';
    
    if (listingType === 'rent') return t('property.forRent');
    if (listingType === 'construction') return t('property.underConstruction');
    if (listingType === 'commercial') return t('property.commercial');
    if (listingType === 'vacation') return t('property.vacation');
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
          {getListingTypeIcon(property)}
          {getListingTypeText(property)}
        </Badge>
        <img
          src={getPropertyImage(property)}
          alt={property.title}
          className="property-image h-64 w-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="white"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:brightness-110 hover:shadow-md"
          >
            <BookmarkIcon className="h-4 w-4 mr-1" />
            {t('property.save')}
          </Button>
        </div>
      </div>
      <div className={`p-4 border-t-0 rounded-b-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
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
          {property.living_area && (
            <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
              <SquareIcon className="h-4 w-4" />
              {property.living_area} m² {t('property.livingSpace')}
            </span>
          )}
          {property.plot_area && (
            <span className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse arabic-text' : ''}`}>
              <TreesIcon className="h-4 w-4" />
              {property.plot_area} m² {t('property.plotSpace')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
