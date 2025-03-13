
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

interface CountryCodeSelectorProps {
  countryCode: string;
  setCountryCode: (value: string) => void;
  countryCodes: CountryCode[];
}

export function CountryCodeSelector({ 
  countryCode, 
  setCountryCode, 
  countryCodes 
}: CountryCodeSelectorProps) {
  const isMobile = useIsMobile();

  const getSelectedFlag = () => {
    const selectedCountry = countryCodes.find(country => country.code === countryCode);
    return selectedCountry ? selectedCountry.flag : "";
  };

  return (
    <Select value={countryCode} onValueChange={setCountryCode}>
      <SelectTrigger className={`${isMobile ? 'w-24' : 'w-32'} px-3`}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getSelectedFlag()}</span>
            <span>{countryCode}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[160px]">
        {countryCodes.map((country) => (
          <SelectItem key={country.code} value={country.code} className="w-full">
            <div className="flex items-center gap-3 px-1">
              <span className="text-lg">{country.flag}</span>
              <span>{country.code}</span>
              <span className="text-muted-foreground">{country.country}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
