
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface ListingTypeFilterProps {
  listingType: string[];
  setListingType: (types: string[]) => void;
}

export function ListingTypeFilter({ listingType, setListingType }: ListingTypeFilterProps) {
  const { t } = useLanguage();

  const listingTypes = [
    { value: 'sale', label: t('search.sale') },
    { value: 'rent', label: t('search.rent') },
    { value: 'construction', label: t('search.construction') },
  ];

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.listingType')}</h4>
      <div className="space-y-2">
        {listingTypes.map(type => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox
              id={type.value}
              checked={listingType.includes(type.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setListingType([...listingType, type.value]);
                } else {
                  setListingType(listingType.filter(item => item !== type.value));
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
