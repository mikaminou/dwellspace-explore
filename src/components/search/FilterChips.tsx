
import React from "react";
import { MapPin, Home, DollarSign, Clock, Bed, Bath, Ruler, X, Package } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/contexts/search/SearchContext";

// Maps amenities to their emoji icons
const amenityEmojis: Record<string, string> = {
  'pool': '🏊',
  'garden': '🌿',
  'garage': '🚗',
  'balcony': '🏞️',
  'terrace': '☕',
  'parking': '🅿️',
  'furnished': '🛋️',
  'air conditioning': '❄️',
  'elevator': '🔼',
  'security': '🔒',
  'gym': '💪',
  'wifi': '📶',
  'modern': '✨'
};

export function FilterChips() {
  const { t } = useLanguage();
  const {
    selectedCities,
    propertyType,
    listingType,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    maxLivingAreaLimit,
    selectedAmenities,
    filtersApplied,
    handleFilterRemoval,
    loading
  } = useSearch();

  if (!filtersApplied.current) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedCities.map(city => (
        <Badge 
          key={city}
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          <MapPin size={12} className="text-primary" /> 
          {city}
          {selectedCities.length > 1 && (
            <button 
              onClick={() => handleFilterRemoval('city', city)} 
              className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
              disabled={loading}
            >
              <X size={12} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </Badge>
      ))}
      
      {propertyType.map(type => (
        <Badge 
          key={type}
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          <Home size={12} className="text-primary" /> 
          {type}
          <button 
            onClick={() => handleFilterRemoval('propertyType', type)} 
            className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            disabled={loading}
          >
            <X size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </Badge>
      ))}
      
      {listingType.map(type => (
        <Badge 
          key={type}
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          {type === 'sale' ? <DollarSign size={12} className="text-primary" /> : 
           type === 'rent' ? <Clock size={12} className="text-primary" /> : 
           <Clock size={12} className="text-primary" />} 
          {t(`search.${type}`)}
          <button 
            onClick={() => handleFilterRemoval('listingType', type)} 
            className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            disabled={loading}
          >
            <X size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </Badge>
      ))}
      
      {minBeds > 0 && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          <Bed size={12} className="text-primary" /> 
          {minBeds}+ {t('search.beds')}
          <button 
            onClick={() => handleFilterRemoval('beds')} 
            className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            disabled={loading}
          >
            <X size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </Badge>
      )}
      
      {minBaths > 0 && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          <Bath size={12} className="text-primary" /> 
          {minBaths}+ {t('search.baths')}
          <button 
            onClick={() => handleFilterRemoval('baths')} 
            className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            disabled={loading}
          >
            <X size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </Badge>
      )}
      
      {(minLivingArea > 0 || maxLivingArea < maxLivingAreaLimit) && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          <Ruler size={12} className="text-primary" /> 
          {minLivingArea} - {maxLivingArea} m²
          <button 
            onClick={() => handleFilterRemoval('livingArea')} 
            className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            disabled={loading}
          >
            <X size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </Badge>
      )}

      {selectedAmenities.map(amenity => (
        <Badge 
          key={amenity}
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
        >
          <span className="text-base">{amenityEmojis[amenity] || ''}</span>
          <span className="capitalize">{amenity}</span>
          <button 
            onClick={() => handleFilterRemoval('amenities', amenity)} 
            className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            disabled={loading}
          >
            <X size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </Badge>
      ))}
    </div>
  );
}
