
import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/language/LanguageContext";

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

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{t('search.livingArea')}</h4>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder={t('search.minLivingArea')}
            value={minLivingArea.toString()}
            onChange={(e) => setMinLivingArea(Number(e.target.value))}
            className="w-24 text-sm border-2"
          />
          <Input
            type="number"
            placeholder={t('search.maxLivingArea')}
            value={maxLivingArea.toString()}
            onChange={(e) => setMaxLivingArea(Number(e.target.value))}
            className="w-24 text-sm border-2"
          />
        </div>
        <Slider
          defaultValue={[minLivingArea, maxLivingArea]}
          max={maxLivingAreaLimit}
          step={10}
          onValueChange={(value) => {
            setMinLivingArea(value[0]);
            setMaxLivingArea(value[1]);
          }}
        />
      </div>
    </div>
  );
}
