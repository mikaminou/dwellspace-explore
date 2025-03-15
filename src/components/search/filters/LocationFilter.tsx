
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface LocationFilterProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: string[];
}

export function LocationFilter({ selectedCity, setSelectedCity, cities }: LocationFilterProps) {
  const { t, dir } = useLanguage();

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.location')}</h4>
      <Select value={selectedCity} onValueChange={setSelectedCity}>
        <SelectTrigger className={`${dir === 'rtl' ? 'arabic-text' : ''} border-2`}>
          <SelectValue placeholder={t('search.anyCity')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {cities.map(city => (
              <SelectItem key={city} value={city} className={dir === 'rtl' ? 'arabic-text' : ''}>
                {city === "any" ? t('search.anyCity') : city}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
