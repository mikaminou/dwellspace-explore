
import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { EmailSignUpForm } from "@/components/auth/EmailSignUpForm";
import { PhoneSignUpForm } from "@/components/auth/PhoneSignUpForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { useLanguage } from "@/contexts/language/LanguageContext";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("email");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+213");
  const { t, dir } = useLanguage();

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
            <CardTitle className={`text-2xl font-bold text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('signup.title') || "Create an Account"}
            </CardTitle>
            <CardDescription className={`text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('signup.subtitle') || "Enter your information to create an account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === "email" && (
              <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className={`text-blue-600 dark:text-blue-400 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {t('signup.emailAlert') || "A confirmation email will be sent to verify your account. Please check your inbox after signing up."}
                </AlertDescription>
              </Alert>
            )}
            
            {activeTab === "phone" && !showOtpInput && countryCode === "+213" && (
              <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className={`text-amber-600 dark:text-amber-400 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  <strong>{t('signup.note') || "Note"}:</strong> {t('signup.algerianNumbersNote') || "Algerian numbers may not receive actual SMS codes due to Twilio restrictions. You'll be able to continue in demo mode."}
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="email">{t('signup.emailTab') || "Email"}</TabsTrigger>
                <TabsTrigger value="phone">{t('signup.phoneTab') || "Phone"}</TabsTrigger>
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
            <p className={`text-sm text-muted-foreground ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {t('signup.alreadyHaveAccount') || "Already have an account?"}{" "}
              <Link to="/signin" className="text-primary hover:underline">
                {t('nav.signIn')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
