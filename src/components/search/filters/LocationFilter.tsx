
import React, { memo } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface LocationFilterProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
}

// Use memo to prevent unnecessary re-renders
export const LocationFilter = memo(function LocationFilter({ 
  selectedCity, 
  setSelectedCity, 
  cities 
}: LocationFilterProps) {
  const { t, dir } = useLanguage();

  // Filter out the "any" option from the cities array
  const filteredCities = cities.filter(city => city !== "any");

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.location')}</h4>
      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className={`${dir === 'rtl' ? 'arabic-text' : ''} border-2`}>
          <SelectValue placeholder={t('search.location')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredCities.map(city => (
              <SelectItem key={city} value={city} className={dir === 'rtl' ? 'arabic-text' : ''}>
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});
