
import React from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Home } from "lucide-react";

interface PropertyTypeFilterProps {
  propertyType: string[];
  setPropertyType: (types: string[]) => void;
}

// Maps property types to their emoji icons
const propertyTypeEmojis: Record<string, string> = {
  'House': '🏠',
  'Apartment': '🏢',
  'Villa': '🏛️',
  'Land': '🏞️',
};

export function PropertyTypeFilter({ 
  propertyType, 
  setPropertyType 
}: PropertyTypeFilterProps) {
  const { t } = useLanguage();

  const propertyTypes = ['House', 'Apartment', 'Villa', 'Land'];

  const handlePropertyTypeChange = (type: string) => {
    if (propertyType.includes(type)) {
      setPropertyType(propertyType.filter(t => t !== type));
    } else {
      setPropertyType([...propertyType, type]);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Home size={16} className="text-primary" /> {t('search.propertyType')}
      </h4>
      <div className="space-y-2.5">
        {propertyTypes.map(type => (
          <div 
            key={type} 
            className={`flex items-center space-x-2 p-1 rounded-md transition-colors ${
              propertyType.includes(type) ? 'bg-primary/10' : 'hover:bg-gray-50'
            }`}
          >
            <Checkbox 
              id={`property-type-${type}`}
              checked={propertyType.includes(type)}
              onCheckedChange={() => handlePropertyTypeChange(type)}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label 
              htmlFor={`property-type-${type}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer flex items-center gap-1.5"
            >
              <span>{propertyTypeEmojis[type]}</span>
              <span>{t(`search.${type.toLowerCase()}`)}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
