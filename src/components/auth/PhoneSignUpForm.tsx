
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RoleSelector } from "./RoleSelector";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { usePhoneSignUp } from "@/hooks/usePhoneSignUp";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Trans } from "@/components/ui/trans";

interface PhoneSignUpFormProps {
  onShowOtp: () => void;
  onError: (message: string) => void;
  onPhoneDetailsCapture: (phone: string, countryCode: string) => void;
}

const countryCodes = [
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

export function PhoneSignUpForm({ onShowOtp, onError, onPhoneDetailsCapture }: PhoneSignUpFormProps) {
  const {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    userRole,
    setUserRole,
    loading,
    twilioConfigIssue,
    handlePhoneSubmit
  } = usePhoneSignUp(onShowOtp, onError, onPhoneDetailsCapture);

  const [error, setError] = useState("");
  const { t, dir } = useLanguage();

  return (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      {twilioConfigIssue && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle className={dir === 'rtl' ? 'arabic-text' : ''}>
            <Trans>demo.title</Trans>
          </AlertTitle>
          <AlertDescription className={dir === 'rtl' ? 'arabic-text' : ''}>
            <Trans>demo.description</Trans>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="phone" className={dir === 'rtl' ? 'arabic-text' : ''}>
          <Trans>phone.label</Trans>
        </Label>
        <div className="flex gap-2">
          <CountryCodeSelector 
            countryCode={countryCode} 
            setCountryCode={setCountryCode} 
            countryCodes={countryCodes} 
          />
          <Input 
            id="phone" 
            type="tel" 
            placeholder={t('phone.placeholder')} 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            required
            className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}
            dir={dir}
          />
        </div>
        <p className={`text-xs text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>
          <Trans>phone.subtitle</Trans>
        </p>
      </div>
      
      <RoleSelector userRole={userRole} setUserRole={setUserRole} />
      
      <Button type="submit" className={`w-full ${dir === 'rtl' ? 'arabic-text' : ''}`} disabled={loading}>
        {loading ? <Trans>phone.sending</Trans> : <Trans>phone.send</Trans>}
      </Button>
    </form>
  );
}
