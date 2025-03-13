
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp || otp.length !== 6) {
      const errorMsg = "Please enter a valid verification code";
      setError(errorMsg);
      onError(errorMsg);
      return;
    }
    
    // Format the phone number with country code
    const formattedPhone = `${countryCode}${phoneNumber}`;
    
    try {
      setLoading(true);
      await verifyOTP(formattedPhone, otp);
      toast({
        title: "Verification successful",
        description: "You are now signed in",
      });
      navigate("/");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const errorMsg = error.message || "Failed to verify code.";
      setError(errorMsg);
      onError(errorMsg);
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="otp" className="block text-center mb-2">Enter verification code</Label>
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
        <p className="text-xs text-muted-foreground text-center">A verification code has been sent to {countryCode} {phoneNumber}</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Verifying..." : "Verify & Create Account"}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        className="w-full mt-2" 
        onClick={onBack}
        disabled={loading}
      >
        Back
      </Button>
    </form>
  );
}
