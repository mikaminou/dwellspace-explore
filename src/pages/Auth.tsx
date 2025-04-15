
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";
import { EmailSignUpForm } from "@/components/auth/EmailSignUpForm";
import { PhoneSignUpForm } from "@/components/auth/PhoneSignUpForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { PasswordField } from "@/components/auth/PasswordField";

export default function AuthPage() {
  const { session, isLoaded } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Default to sign-in unless URL has 'signup' in it
    return location.pathname.includes('signup') ? "signup" : "signin";
  });
  
  // SignIn state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // SignUp state
  const [signupError, setSignupError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+213");
  const [signupMethod, setSignupMethod] = useState("email");
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  useEffect(() => {
    if (isLoaded && session) {
      navigate('/');
    }
  }, [isLoaded, session, navigate]);

  if (session) {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      setLoading(true);
      await signIn(email, password);
      navigate("/");
    } catch (error: any) {
      setError(error.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message: string) => {
    if (activeTab === "signin") {
      setError(message);
    } else {
      setSignupError(message);
    }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <Card className="w-full max-w-md glass fade-in">
          <CardHeader>
            <CardTitle className={`text-2xl font-bold text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {activeTab === "signin" ? t('signin.title') : t('signup.title')}
            </CardTitle>
            <CardDescription className={`text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
              {activeTab === "signin" ? t('signin.subtitle') : t('signup.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">{t('nav.signIn')}</TabsTrigger>
                <TabsTrigger value="signup">{t('nav.signUp')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={dir === 'rtl' ? 'block text-right arabic-text' : ''}>
                      {t('signin.email')}
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={dir === 'rtl' ? 'text-right' : ''}
                      dir={dir}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className={dir === 'rtl' ? 'block text-right arabic-text' : ''}>
                      {t('signin.password')}
                    </Label>
                    <PasswordField 
                      password={password}
                      setPassword={setPassword}
                      showPassword={showPassword}
                      togglePasswordVisibility={togglePasswordVisibility}
                      dir={dir}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-primary" disabled={loading}>
                    {loading ? (dir === 'rtl' ? "جاري تسجيل الدخول..." : "Connexion en cours...") : t('signin.button')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                {signupError && (
                  <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                    <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-600 dark:text-red-400">
                      {signupError}
                    </AlertDescription>
                  </Alert>
                )}
                
                {signupMethod === "email" && (
                  <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className={`text-blue-600 dark:text-blue-400 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                      {t('signup.emailAlert') || "A confirmation email will be sent to verify your account. Please check your inbox after signing up."}
                    </AlertDescription>
                  </Alert>
                )}
                
                {signupMethod === "phone" && !showOtpInput && countryCode === "+213" && (
                  <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className={`text-amber-600 dark:text-amber-400 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                      <strong>{t('signup.note') || "Note"}:</strong> {t('signup.algerianNumbersNote') || "Algerian numbers may not receive actual SMS codes due to Twilio restrictions. You'll be able to continue in demo mode."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Tabs value={signupMethod} onValueChange={setSignupMethod} className="w-full">
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
              {activeTab === "signin" 
                ? `${t('signup.noAccount')} `
                : `${t('signup.alreadyHaveAccount')} `}
              <button 
                type="button"
                className="text-primary hover:underline"
                onClick={() => setActiveTab(activeTab === "signin" ? "signup" : "signin")}
              >
                {activeTab === "signin" ? t('signup.create') : t('nav.signIn')}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
