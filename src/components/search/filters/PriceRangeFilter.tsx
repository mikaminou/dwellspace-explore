
import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface PriceRangeFilterProps {
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  maxPriceLimit: number;
}

export function PriceRangeFilter({ 
  minPrice, 
  setMinPrice, 
  maxPrice, 
  setMaxPrice, 
  maxPriceLimit 
}: PriceRangeFilterProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.priceRange')}</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder={t('search.minPrice')}
            value={minPrice.toString()}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-24 text-sm border-2"
          />
          <Input
            type="number"
            placeholder={t('search.maxPrice')}
            value={maxPrice.toString()}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-24 text-sm border-2"
          />
        </div>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          max={maxPriceLimit}
          step={10000}
          onValueChange={(value) => {
            setMinPrice(value[0]);
            setMaxPrice(value[1]);
          }}
        />
      </div>
    </div>
  );
}
