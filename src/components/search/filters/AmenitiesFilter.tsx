
import React from "react";
import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
}

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

export function AmenitiesFilter({
  selectedAmenities,
  setSelectedAmenities,
}: AmenitiesFilterProps) {
  const { t } = useLanguage();
  
  const amenitiesList = [
    'pool',
    'garden',
    'garage',
    'balcony',
    'terrace',
    'parking',
    'furnished',
    'air conditioning',
    'elevator',
    'security',
    'gym',
    'wifi',
    'modern'
  ];

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
        <span className="text-lg">🏠</span> {t('search.amenities')}
      </label>
      
      <ScrollArea className="h-[180px] rounded-md border border-input bg-background hover:border-primary/50 transition-colors">
        <div className="p-3 space-y-3">
          {amenitiesList.map((amenity) => (
            <div 
              key={amenity} 
              className={`flex items-center space-x-2 p-1.5 rounded-md transition-colors ${
                selectedAmenities.includes(amenity) ? 'bg-primary/10' : 'hover:bg-gray-50'
              }`}
            >
              <Checkbox 
                id={`amenity-${amenity}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex items-center gap-1.5"
              >
                <span>{amenityEmojis[amenity] || ''}</span>
                <span>{amenity}</span>
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {selectedAmenities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedAmenities.map((amenity) => (
            <Badge
              key={amenity}
              variant="outline"
              className="flex items-center gap-1 capitalize px-2 py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
            >
              <span>{amenityEmojis[amenity] || ''}</span>
              {amenity}
              <button
                onClick={() => handleAmenityToggle(amenity)}
                className="ml-1 rounded-full hover:bg-primary/20 focus:outline-none p-0.5"
              >
                <span className="sr-only">Remove</span>
                <CheckIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
