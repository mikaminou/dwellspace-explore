
import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface BedsBathsFilterProps {
  minBeds: number;
  setMinBeds: (beds: number) => void;
  minBaths: number;
  setMinBaths: (baths: number) => void;
}

// Use memo to prevent unnecessary re-renders
export const BedsBathsFilter = memo(function BedsBathsFilter({ 
  minBeds, 
  setMinBeds, 
  minBaths, 
  setMinBaths 
}: BedsBathsFilterProps) {
  const { t } = useLanguage();

  // Handle input changes with validation
  const handleBedsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinBeds(isNaN(value) ? 0 : Math.max(0, value));
  };

  const handleBathsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinBaths(isNaN(value) ? 0 : Math.max(0, value));
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.bedsBaths')}</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder={t('search.minBeds')}
            value={minBeds.toString()}
            onChange={handleBedsChange}
            min="0"
            className="w-24 text-sm border-2"
            aria-label={t('search.minBeds')}
          />
          <Input
            type="number"
            placeholder={t('search.minBaths')}
            value={minBaths.toString()}
            onChange={handleBathsChange}
            min="0"
            className="w-24 text-sm border-2"
            aria-label={t('search.minBaths')}
          />
        </div>
      </div>
    </div>
  );
});
