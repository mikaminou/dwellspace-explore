
import React, { memo } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { MapPin } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

  // We're still using the single city selection pattern since that's how the context is set up
  // The component interface would need to be updated to handle arrays for full multi-selection
  
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
              {selectedCity || t('search.location')}
            </span>
            <MapPin size={14} className="ml-2 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px] max-h-[250px] overflow-y-auto" align="start">
          {filteredCities.map(city => (
            <DropdownMenuCheckboxItem
              key={city}
              checked={selectedCity === city}
              onSelect={() => setSelectedCity(city)}
              className={dir === 'rtl' ? 'arabic-text' : ''}
            >
              {city}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedCity && (
        <div className="mt-2">
          <Badge 
            variant="outline" 
            className="bg-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-primary/30"
          >
            <MapPin size={12} className="text-primary" /> 
            {selectedCity}
            <button 
              onClick={() => setSelectedCity('')} 
              className="ml-1 p-0.5 rounded-full hover:bg-primary/10 text-primary"
            >
              <X size={12} />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
});
