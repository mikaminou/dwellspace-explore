
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
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {t('search.amenities')}
      </label>
      
      <ScrollArea className="h-[180px] rounded-md border border-input bg-background">
        <div className="p-2 space-y-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
              >
                {amenity}
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
              className="flex items-center gap-1 capitalize"
            >
              {amenity}
              <button
                onClick={() => handleAmenityToggle(amenity)}
                className="ml-1 rounded-full hover:bg-gray-100 focus:outline-none"
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
