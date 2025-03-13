
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

// Country codes for phone auth - limited to Algeria and Germany with emoji flags
const countryCodes = [
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

interface PhoneSignUpFormProps {
  onShowOtp: () => void;
  onError: (message: string) => void;
}

export function PhoneSignUpForm({ onShowOtp, onError }: PhoneSignUpFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+213");
  const [userRole, setUserRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [twilioConfigIssue, setTwilioConfigIssue] = useState(false);
  const { signInWithPhone } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTwilioConfigIssue(false);
    
    if (!phoneNumber || phoneNumber.length < 5) {
      const errorMsg = "Please enter a valid phone number";
      setError(errorMsg);
      onError(errorMsg);
      return;
    }
    
    // Format the phone number with country code
    const formattedPhone = `${countryCode}${phoneNumber}`;
    
    try {
      setLoading(true);
      await signInWithPhone(formattedPhone);
      onShowOtp();
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("Phone verification error:", error);
      
      // Check if the error is related to Twilio configuration
      if (error.message && (
        error.message.includes("Invalid From Number") || 
        error.message.includes("Twilio") ||
        error.message.includes("SMS")
      )) {
        setTwilioConfigIssue(true);
        const errorMsg = "Twilio configuration issue detected. Please check your Twilio setup or use email authentication instead.";
        setError(errorMsg);
        onError(errorMsg);
        toast({
          title: "Twilio configuration issue",
          description: "Your Supabase project's Twilio configuration needs a verified phone number.",
          variant: "destructive",
        });
      } else {
        const errorMsg = error.message || "Failed to send verification code. Try using email authentication instead.";
        setError(errorMsg);
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

  const getSelectedFlag = () => {
    const selectedCountry = countryCodes.find(country => country.code === countryCode);
    return selectedCountry ? selectedCountry.flag : "";
  };

  return (
    <form onSubmit={handlePhoneSubmit} className="space-y-4">
      {twilioConfigIssue && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Twilio Configuration Issue</AlertTitle>
          <AlertDescription>
            Your Supabase project needs a verified phone number in the Twilio configuration. 
            This is needed to send SMS messages. Please check your Twilio setup in the Supabase dashboard or use email authentication instead.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
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
        <p className="text-xs text-muted-foreground">Enter your phone number without the country code</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">I am a</Label>
        <Select value={userRole} onValueChange={setUserRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">Buyer</SelectItem>
            <SelectItem value="seller">Seller</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Select your role in the platform</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending code..." : "Send Verification Code"}
      </Button>
    </form>
  );
}
