
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
  const { t } = useLanguage();

  return (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      {twilioConfigIssue && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('demo.title')}</AlertTitle>
          <AlertDescription>
            {t('demo.description')}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="phone">{t('phone.label')}</Label>
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
            className="flex-1"
          />
        </div>
        <p className="text-xs text-muted-foreground">{t('phone.subtitle')}</p>
      </div>
      
      <RoleSelector userRole={userRole} setUserRole={setUserRole} />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('phone.sending') : t('phone.send')}
      </Button>
    </form>
  );
}
