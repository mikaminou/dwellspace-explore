
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, AlertCircle, Search, Building, Home, MapPin } from "lucide-react";
import { EmailSignUpForm } from "@/components/auth/EmailSignUpForm";
import { PhoneSignUpForm } from "@/components/auth/PhoneSignUpForm";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth";
import { PasswordField } from "@/components/auth/PasswordField";

// Define the logo URL
const LOGO_URL = "https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9sb2dvLnBuZyIsImlhdCI6MTc0MTk1NDgzOCwiZXhwIjoxNzczNDkwODM4fQ.8WLPyFQhA5EnkDuoHlClDrI2JzmZ5wKbpGE1clp8VrU";

export default function AuthPage() {
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
    <div className="min-h-screen bg-[#222D35] text-white overflow-hidden">
      <div className="container mx-auto h-screen flex flex-col">
        <div className="py-6 px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={LOGO_URL} alt="Osken Logo" className="h-8" />
              <span className="text-xl font-bold">Osken</span>
            </Link>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 py-8 px-4">
          {/* Content side */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-8 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Real Estate <span className="text-primary">Redefined</span><span className="text-red-500">.</span>
              </h1>
              <p className="text-lg text-gray-300">
                We've harnessed the power of technology to create a seamless property search experience tailored to your needs.
              </p>
            </div>
            
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center gap-2 bg-black/20 p-4 rounded-md">
                <Search className="h-5 w-5 text-primary" />
                <span>Find your dream home with advanced search</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 p-4 rounded-md">
                <Building className="h-5 w-5 text-primary" />
                <span>Thousands of properties at your fingertips</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 p-4 rounded-md">
                <Home className="h-5 w-5 text-primary" />
                <span>Buy, sell, or rent with confidence</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 p-4 rounded-md">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Interactive map for location-based search</span>
              </div>
            </div>
          </div>
          
          {/* Auth form side */}
          <div className="w-full md:w-1/2 max-w-md">
            <Card className="w-full glass fade-in bg-black/30 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className={`text-2xl font-bold text-center ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {activeTab === "signin" ? t('signin.title') : t('signup.title')}
                </CardTitle>
                <CardDescription className={`text-center text-gray-300 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                  {activeTab === "signin" ? t('signin.subtitle') : t('signup.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/20">
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
                          className={`${dir === 'rtl' ? 'text-right' : ''} bg-black/20 border-white/10`}
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
                      <Alert className="mb-4 bg-red-500/20 border-red-500/30">
                        <Info className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">
                          {signupError}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {signupMethod === "email" && (
                      <Alert className="mb-4 bg-blue-500/20 border-blue-500/30">
                        <Info className="h-4 w-4 text-blue-400" />
                        <AlertDescription className={`text-blue-300 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                          {t('signup.emailAlert') || "A confirmation email will be sent to verify your account. Please check your inbox after signing up."}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {signupMethod === "phone" && !showOtpInput && countryCode === "+213" && (
                      <Alert className="mb-4 bg-amber-500/20 border-amber-500/30">
                        <Info className="h-4 w-4 text-amber-400" />
                        <AlertDescription className={`text-amber-300 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
                          <strong>{t('signup.note') || "Note"}:</strong> {t('signup.algerianNumbersNote') || "Algerian numbers may not receive actual SMS codes due to Twilio restrictions. You'll be able to continue in demo mode."}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Tabs value={signupMethod} onValueChange={setSignupMethod} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/20">
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
                    <span className="w-full border-t border-white/10" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className={`text-sm text-gray-400 ${dir === 'rtl' ? 'arabic-text' : ''}`}>
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
        
        {/* 3D elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl"></div>
        </div>
        <div className="absolute -left-64 -bottom-64 hidden lg:block">
          <div className="w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
