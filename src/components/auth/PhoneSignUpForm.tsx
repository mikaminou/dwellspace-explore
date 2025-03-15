
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RoleSelector } from "./RoleSelector";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { usePhoneSignUp } from "@/hooks/usePhoneSignUp";

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

  return (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      {twilioConfigIssue && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            Your phone verification couldn't be processed by our SMS provider. You can continue in demo mode where any 6-digit code will work.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <CountryCodeSelector 
            countryCode={countryCode} 
            setCountryCode={setCountryCode} 
            countryCodes={countryCodes} 
          />
          <Input 
            id="phone" 
            type="tel" 
            placeholder="123456789" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            required
            className="flex-1"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Enter your phone number without the country code
        </p>
      </div>
      
      <RoleSelector userRole={userRole} setUserRole={setUserRole} />
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending code..." : "Send Verification Code"}
      </Button>
    </form>
  );
}
