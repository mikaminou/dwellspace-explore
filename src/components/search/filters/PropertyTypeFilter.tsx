
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface PropertyTypeFilterProps {
  propertyType: string[];
  setPropertyType: (types: string[]) => void;
}

export function PropertyTypeFilter({ propertyType, setPropertyType }: PropertyTypeFilterProps) {
  const { t } = useLanguage();

  const propertyTypes = [
    { value: 'House', label: t('search.house') },
    { value: 'Apartment', label: t('search.apartment') },
    { value: 'Villa', label: t('search.villa') },
    { value: 'Land', label: t('search.land') },
  ];

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.propertyType')}</h4>
      <div className="space-y-2">
        {propertyTypes.map(type => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox
              id={type.value}
              checked={propertyType.includes(type.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setPropertyType([...propertyType, type.value]);
                } else {
                  setPropertyType(propertyType.filter(item => item !== type.value));
                }
              }}
            />
            <label
              htmlFor={type.value}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
