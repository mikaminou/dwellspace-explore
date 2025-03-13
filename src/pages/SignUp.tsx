
import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { EmailSignUpForm } from "@/components/auth/EmailSignUpForm";
import { PhoneSignUpForm } from "@/components/auth/PhoneSignUpForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+213");

  const handleError = (message: string) => {
    setError(message);
  };

  const handleShowOtp = () => {
    setShowOtpInput(true);
  };

  const handleBackFromOtp = () => {
    setShowOtpInput(false);
  };

  const handlePhoneDetailsCapture = (phone: string, country: string) => {
    setPhoneNumber(phone);
    setCountryCode(country);
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
            {error && !activeTab.includes("phone") && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {activeTab === "phone" && !showOtpInput && countryCode === "+213" && (
              <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-600 dark:text-amber-400">
                  <strong>Note:</strong> Algerian numbers may not receive actual SMS codes due to Twilio restrictions. 
                  You'll be able to continue in demo mode.
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <EmailSignUpForm onError={handleError} />
              </TabsContent>
              
              <TabsContent value="phone">
                {!showOtpInput ? (
                  <PhoneSignUpForm 
                    onShowOtp={handleShowOtp} 
                    onError={handleError} 
                    onPhoneDetailsCapture={handlePhoneDetailsCapture}
                  />
                ) : (
                  <OtpVerificationForm 
                    phoneNumber={phoneNumber}
                    countryCode={countryCode}
                    onBack={handleBackFromOtp}
                    onError={handleError}
                  />
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
