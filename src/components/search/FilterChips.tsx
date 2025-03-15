
import React from "react";
import { MapPin, Home, DollarSign, Clock, Bed, Bath, Ruler } from "lucide-react";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface FilterChipsProps {
  selectedCity: string;
  propertyType: string[];
  listingType: string[];
  minBeds: number;
  minBaths: number;
  minLivingArea: number;
  maxLivingArea: number;
  maxLivingAreaLimit: number;
  filtersApplied: React.MutableRefObject<boolean>;
}

export function FilterChips({
  selectedCity,
  propertyType,
  listingType,
  minBeds,
  minBaths,
  minLivingArea,
  maxLivingArea,
  maxLivingAreaLimit,
  filtersApplied
}: FilterChipsProps) {
  const { t } = useLanguage();

  if (!filtersApplied.current) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedCity !== 'any' && (
        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <MapPin size={12} /> {selectedCity}
        </div>
      )}
      {propertyType.length > 0 && (
        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <Home size={12} /> {propertyType.join(', ')}
        </div>
      )}
      {listingType.length > 0 && (
        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          {listingType.includes('sale') ? <DollarSign size={12} /> : <Clock size={12} />} {listingType.join(', ')}
        </div>
      )}
      {minBeds > 0 && (
        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <Bed size={12} /> {minBeds}+ {t('search.beds')}
        </div>
      )}
      {minBaths > 0 && (
        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <Bath size={12} /> {minBaths}+ {t('search.baths')}
        </div>
      )}
      {(minLivingArea > 0 || maxLivingArea < maxLivingAreaLimit) && (
        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <Ruler size={12} /> {minLivingArea} - {maxLivingArea} m²
        </div>
      )}
    </div>
  );
}
