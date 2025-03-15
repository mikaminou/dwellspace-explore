
import React from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface BedsBathsFilterProps {
  minBeds: number;
  setMinBeds: (beds: number) => void;
  minBaths: number;
  setMinBaths: (baths: number) => void;
}

export function BedsBathsFilter({ 
  minBeds, 
  setMinBeds, 
  minBaths, 
  setMinBaths 
}: BedsBathsFilterProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.bedsBaths')}</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder={t('search.minBeds')}
            value={minBeds.toString()}
            onChange={(e) => setMinBeds(Number(e.target.value))}
            className="w-24 text-sm border-2"
          />
          <Input
            type="number"
            placeholder={t('search.minBaths')}
            value={minBaths.toString()}
            onChange={(e) => setMinBaths(Number(e.target.value))}
            className="w-24 text-sm border-2"
          />
        </div>
      </div>
    </div>
  );
}
