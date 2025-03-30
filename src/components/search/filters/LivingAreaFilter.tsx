
import React from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Ruler } from "lucide-react";

interface LivingAreaFilterProps {
  minLivingArea: number;
  setMinLivingArea: (area: number) => void;
  maxLivingArea: number;
  setMaxLivingArea: (area: number) => void;
  maxLivingAreaLimit: number;
}

export function LivingAreaFilter({
  minLivingArea,
  setMinLivingArea,
  maxLivingArea,
  setMaxLivingArea,
  maxLivingAreaLimit
}: LivingAreaFilterProps) {
  const { t } = useLanguage();

  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    setMinLivingArea(values[0]);
    setMaxLivingArea(values[1]);
  };

  // Handle min area input change
  const handleMinAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value >= 0 && value <= maxLivingArea) {
      setMinLivingArea(value);
    }
  };

  // Handle max area input change
  const handleMaxAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    if (value >= minLivingArea && value <= maxLivingAreaLimit) {
      setMaxLivingArea(value);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Ruler size={16} className="text-primary" /> {t('search.livingArea')}
      </h4>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="number"
            value={minLivingArea}
            onChange={handleMinAreaChange}
            className="w-full"
            placeholder="Min"
          />
          <Input
            type="number"
            value={maxLivingArea}
            onChange={handleMaxAreaChange}
            className="w-full"
            placeholder="Max"
          />
        </div>
        
        <Slider
          value={[minLivingArea, maxLivingArea]}
          min={0}
          max={maxLivingAreaLimit}
          step={5}
          onValueChange={handleSliderChange}
          className="my-4"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>0 m²</span>
          <span>{maxLivingAreaLimit} m²</span>
        </div>
      </div>
    </div>
  );
}
