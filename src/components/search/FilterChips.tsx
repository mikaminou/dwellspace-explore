
import React from "react";
import { MapPin, Home, DollarSign, Clock, Bed, Bath, Ruler, X } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/contexts/search/SearchContext";

export function FilterChips() {
  const { t } = useLanguage();
  const {
    selectedCity,
    propertyType,
    listingType,
    minBeds,
    minBaths,
    minLivingArea,
    maxLivingArea,
    maxLivingAreaLimit,
    filtersApplied,
    handleFilterRemoval
  } = useSearch();

  if (!filtersApplied.current) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedCity !== 'any' && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
        >
          <MapPin size={12} /> 
          {selectedCity}
          <button 
            onClick={() => handleFilterRemoval('city')} 
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X size={12} />
          </button>
        </Badge>
      )}
      
      {propertyType.map(type => (
        <Badge 
          key={type}
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
        >
          <Home size={12} /> 
          {type}
          <button 
            onClick={() => handleFilterRemoval('propertyType', type)} 
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X size={12} />
          </button>
        </Badge>
      ))}
      
      {listingType.map(type => (
        <Badge 
          key={type}
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
        >
          {type === 'sale' ? <DollarSign size={12} /> : type === 'rent' ? <Clock size={12} /> : <Clock size={12} />} 
          {t(`search.${type}`)}
          <button 
            onClick={() => handleFilterRemoval('listingType', type)} 
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X size={12} />
          </button>
        </Badge>
      ))}
      
      {minBeds > 0 && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
        >
          <Bed size={12} /> 
          {minBeds}+ {t('search.beds')}
          <button 
            onClick={() => handleFilterRemoval('beds')} 
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X size={12} />
          </button>
        </Badge>
      )}
      
      {minBaths > 0 && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
        >
          <Bath size={12} /> 
          {minBaths}+ {t('search.baths')}
          <button 
            onClick={() => handleFilterRemoval('baths')} 
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X size={12} />
          </button>
        </Badge>
      )}
      
      {(minLivingArea > 0 || maxLivingArea < maxLivingAreaLimit) && (
        <Badge 
          variant="outline" 
          className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
        >
          <Ruler size={12} /> 
          {minLivingArea} - {maxLivingArea} m²
          <button 
            onClick={() => handleFilterRemoval('livingArea')} 
            className="ml-1 p-0.5 rounded-full hover:bg-gray-100"
          >
            <X size={12} />
          </button>
        </Badge>
      )}
    </div>
  );
}
