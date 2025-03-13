
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";

export function usePhoneSignUp(
  onShowOtp: () => void,
  onError: (message: string) => void,
  onPhoneDetailsCapture: (phone: string, countryCode: string) => void
) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+213");
  const [userRole, setUserRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [twilioConfigIssue, setTwilioConfigIssue] = useState(false);
  const { signInWithPhone } = useAuth();
  const { toast } = useToast();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwilioConfigIssue(false);
    onError(""); // Clear any previous errors
    
    if (!phoneNumber || phoneNumber.length < 5) {
      const errorMsg = "Please enter a valid phone number";
      onError(errorMsg);
      return;
    }
    
    const formattedPhone = `${countryCode}${phoneNumber}`;
    
    try {
      setLoading(true);
      await signInWithPhone(formattedPhone);
      
      onPhoneDetailsCapture(phoneNumber, countryCode);
      onShowOtp();
      
      toast({
        title: "Verification code sent",
        description: countryCode === "+213" 
          ? "Using demo mode since Twilio has issues with Algerian numbers" 
          : "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("Phone verification error:", error);
      
      if (error.message && (
        error.message.includes("unverified") || 
        error.message.includes("Twilio") ||
        error.message.includes("SMS") ||
        error.message.includes("Invalid")
      )) {
        setTwilioConfigIssue(true);
        
        onPhoneDetailsCapture(phoneNumber, countryCode);
        onShowOtp();
        
        toast({
          title: "Using demo mode",
          description: "The verification service couldn't send the actual SMS. Any 6-digit code will work in demo mode.",
          variant: "destructive",
        });
      } else {
        const errorMsg = error.message || "Failed to send verification code. Try using email authentication instead.";
        onError(errorMsg);
        
        toast({
          title: "Phone verification failed",
          description: error.message || "Failed to send verification code. Try using email authentication instead.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    countryCode, 
    setCountryCode,
    userRole,
    setUserRole,
    loading,
    twilioConfigIssue,
    handlePhoneSubmit
  };
}
