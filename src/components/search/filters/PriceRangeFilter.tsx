
import React from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

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

  // Format the price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  // Handle min price input change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
    if (value >= 0 && value <= maxPrice) {
      setMinPrice(value);
    }
  };

  // Handle max price input change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
    if (value >= minPrice && value <= maxPriceLimit) {
      setMaxPrice(value);
    }
  };

  // Determine if filters are active
  const isPriceFilterActive = minPrice > 0 || maxPrice < maxPriceLimit;

  return (
    <div className={`transition-all duration-200 ${isPriceFilterActive ? 'bg-primary/5 rounded-lg p-3 -m-3' : ''}`}>
      <h4 className={`text-sm font-medium mb-2 flex items-center gap-1 ${isPriceFilterActive ? 'text-primary font-semibold' : ''}`}>
        <DollarSign size={16} className={`${isPriceFilterActive ? 'text-primary' : 'text-primary/70'}`} /> 
        {t('search.priceRange')}
      </h4>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={formatPrice(minPrice)}
            onChange={handleMinPriceChange}
            className={`w-full ${isPriceFilterActive ? 'border-primary/30 focus-visible:border-primary/50' : ''}`}
            placeholder="Min"
          />
          <Input
            type="text"
            value={formatPrice(maxPrice)}
            onChange={handleMaxPriceChange}
            className={`w-full ${isPriceFilterActive ? 'border-primary/30 focus-visible:border-primary/50' : ''}`}
            placeholder="Max"
          />
        </div>
        
        <Slider
          value={[minPrice, maxPrice]}
          min={0}
          max={maxPriceLimit}
          step={10000}
          onValueChange={handleSliderChange}
          className="my-4"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>${formatPrice(0)}</span>
          <span>${formatPrice(maxPriceLimit)}</span>
        </div>
      </div>
    </div>
  );
}
