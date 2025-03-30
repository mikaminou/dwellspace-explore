
import React, { memo } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { MapPin, Check, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LocationFilterProps {
  selectedCities: string[];
  setSelectedCities: (cities: string[]) => void;
  cities: string[];
}

// Use memo to prevent unnecessary re-renders
export const LocationFilter = memo(function LocationFilter({ 
  selectedCities, 
  setSelectedCities, 
  cities 
}: LocationFilterProps) {
  const { t, dir } = useLanguage();

  // Filter out the "any" option from the cities array if it exists
  const filteredCities = cities.filter(city => city !== "any");

  const handleCityToggle = (city: string) => {
    if (selectedCities.includes(city)) {
      // Don't allow removing the last city
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter(c => c !== city));
      }
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const displayLabel = selectedCities.length > 0 
    ? selectedCities.length === 1 
      ? selectedCities[0] 
      : `${selectedCities.length} cities selected`
    : t('search.location');
  
  return (
    <div>
      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
        <MapPin size={16} className="text-primary" /> {t('search.location')}
      </h4>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`${dir === 'rtl' ? 'arabic-text' : ''} w-full justify-between border-2 hover:border-primary/50 transition-colors text-left font-normal h-10`}
          >
            <span className="truncate">
              {displayLabel}
            </span>
            <MapPin size={14} className="ml-2 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] max-h-[250px] overflow-y-auto" align="start">
          {filteredCities.map(city => (
            <DropdownMenuCheckboxItem
              key={city}
              checked={selectedCities.includes(city)}
              onSelect={(e) => {
                e.preventDefault();
                handleCityToggle(city);
              }}
              className={dir === 'rtl' ? 'arabic-text' : ''}
            >
              {city}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedCities.map(city => (
            <Badge 
              key={city}
              variant="outline" 
              className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
            >
              <MapPin size={12} className="text-primary" /> 
              {city}
              {selectedCities.length > 1 && (
                <button 
                  onClick={() => handleCityToggle(city)} 
                  className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
                >
                  <X size={12} />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
});
