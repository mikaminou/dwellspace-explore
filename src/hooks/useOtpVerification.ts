
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";

export function useOtpVerification(
  phoneNumber: string,
  countryCode: string,
  onError: (message: string) => void
) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(countryCode === "+213");
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    onError("");
    
    if (!otp || otp.length !== 6) {
      const errorMsg = "Please enter a valid verification code";
      setError(errorMsg);
      onError(errorMsg);
      return;
    }
    
    const formattedPhone = `${countryCode}${phoneNumber}`;
    
    try {
      setLoading(true);
      
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Demo verification successful",
          description: "You are now signed in with a simulated account",
        });
        navigate("/");
        return;
      }
      
      await verifyOTP(formattedPhone, otp);
      toast({
        title: "Verification successful",
        description: "You are now signed in",
      });
      navigate("/");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      
      if (error.message && (
        error.message.includes("Invalid OTP") ||
        error.message.includes("expired") ||
        error.message.includes("incorrect")
      )) {
        const errorMsg = "The verification code is invalid or has expired. Please try again.";
        setError(errorMsg);
        onError(errorMsg);
      } else {
        setIsDemoMode(true);
        setError("Using demo mode due to verification issues. Enter any 6 digits to continue.");
      }
      
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    loading,
    error,
    isDemoMode,
    handleVerifyOTP
  };
}
