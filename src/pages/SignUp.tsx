
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

// Country codes for phone auth - limited to Algeria and Germany with emoji flags
const countryCodes = [
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+213");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [twilioConfigIssue, setTwilioConfigIssue] = useState(false);
  const { signUp, signInWithPhone, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      setLoading(true);
      await signUp(email, password, displayName);
      navigate("/");
    } catch (error: any) {
      setError(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTwilioConfigIssue(false);
    
    if (!phoneNumber || phoneNumber.length < 5) {
      setError("Please enter a valid phone number");
      return;
    }
    
    // Format the phone number with country code
    const formattedPhone = `${countryCode}${phoneNumber}`;
    
    try {
      setLoading(true);
      await signInWithPhone(formattedPhone);
      setShowOtpInput(true);
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
        setError("Twilio configuration issue detected. Please check your Twilio setup or use email authentication instead.");
        toast({
          title: "Twilio configuration issue",
          description: "Your Supabase project's Twilio configuration needs a verified phone number.",
          variant: "destructive",
        });
      } else {
        setError(error.message || "Failed to send verification code. Try using email authentication instead.");
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid verification code");
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
      setError(error.message || "Failed to verify code.");
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedFlag = () => {
    const selectedCountry = countryCodes.find(country => country.code === countryCode);
    return selectedCountry ? selectedCountry.flag : "";
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="phone">
                {twilioConfigIssue && (
                  <Alert className="mb-4" variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Twilio Configuration Issue</AlertTitle>
                    <AlertDescription>
                      Your Supabase project needs a verified phone number in the Twilio configuration. 
                      This is needed to send SMS messages. Please check your Twilio setup in the Supabase dashboard or use email authentication instead.
                    </AlertDescription>
                  </Alert>
                )}
                
                {!showOtpInput ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
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
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending code..." : "Send Verification Code"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
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
                      onClick={() => setShowOtpInput(false)}
                      disabled={loading}
                    >
                      Back
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
