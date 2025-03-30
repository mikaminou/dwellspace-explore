
import React from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag } from "lucide-react";

interface ListingTypeFilterProps {
  listingType: string[];
  setListingType: (types: string[]) => void;
}

// Maps listing types to their emoji icons
const listingTypeEmojis: Record<string, string> = {
  'sale': '💰',
  'rent': '🔑',
  'construction': '🏗️',
};

export function ListingTypeFilter({ 
  listingType, 
  setListingType 
}: ListingTypeFilterProps) {
  const { t } = useLanguage();

  const listingTypes = ['sale', 'rent', 'construction'];

  const handleListingTypeChange = (type: string) => {
    if (listingType.includes(type)) {
      setListingType(listingType.filter(t => t !== type));
    } else {
      setListingType([...listingType, type]);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Tag size={16} className="text-primary" /> {t('search.listingType')}
      </h4>
      <div className="space-y-2.5">
        {listingTypes.map(type => (
          <div 
            key={type} 
            className={`flex items-center space-x-2 p-1 rounded-md transition-colors ${
              listingType.includes(type) ? 'bg-primary/10' : 'hover:bg-gray-50'
            }`}
          >
            <Checkbox 
              id={`listing-type-${type}`}
              checked={listingType.includes(type)}
              onCheckedChange={() => handleListingTypeChange(type)}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label 
              htmlFor={`listing-type-${type}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1.5"
            >
              <span>{listingTypeEmojis[type]}</span>
              <span>{t(`search.${type}`)}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
