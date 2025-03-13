
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOtpVerification } from "@/hooks/useOtpVerification";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface OtpVerificationFormProps {
  phoneNumber: string;
  countryCode: string;
  onBack: () => void;
  onError: (message: string) => void;
}

export function OtpVerificationForm({ 
  phoneNumber, 
  countryCode, 
  onBack,
  onError
}: OtpVerificationFormProps) {
  const {
    otp,
    setOtp,
    loading,
    error,
    isDemoMode,
    handleVerifyOTP
  } = useOtpVerification(phoneNumber, countryCode, onError);

  const { t } = useLanguage();

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isDemoMode && (
        <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-600 dark:text-amber-400">{t('demo.title')}</AlertTitle>
          <AlertDescription className="text-amber-600 dark:text-amber-400">
            {t('demo.description')}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="otp" className="block text-center mb-2">{t('otp.title')}</Label>
        <div className="flex justify-center mb-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {isDemoMode 
            ? t('otp.demoSubtitle')
            : `${t('otp.subtitle')} ${countryCode} ${phoneNumber}`}
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verifying..." : t('otp.verify')}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full mt-2" 
        onClick={onBack}
        disabled={loading}
      >
        {t('otp.back')}
      </Button>
    </form>
  );
}
