
import React from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Bed, Bath } from "lucide-react";

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

  const options = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <Bed size={16} className="text-primary" /> {t('search.bedsBaths')}
      </h4>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Bed size={14} /> {t('search.beds')}
          </p>
          <div className="flex gap-1">
            {options.map(option => (
              <button
                key={`bed-${option}`}
                className={`flex-1 h-8 text-sm rounded-md transition-colors ${
                  minBeds === option 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setMinBeds(option)}
              >
                {option === 0 ? 'Any' : `${option}+`}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Bath size={14} /> {t('search.baths')}
          </p>
          <div className="flex gap-1">
            {options.map(option => (
              <button
                key={`bath-${option}`}
                className={`flex-1 h-8 text-sm rounded-md transition-colors ${
                  minBaths === option 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setMinBaths(option)}
              >
                {option === 0 ? 'Any' : `${option}+`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
