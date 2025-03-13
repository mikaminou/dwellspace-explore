
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2, Mail, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

export default function EmailConfirmationPage() {
  // Get query parameters from URL
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const email = searchParams.get("email") || "";
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [showResendButton, setShowResendButton] = useState(false);

  useEffect(() => {
    // Log for debugging
    console.log("Email confirmation page loaded with params:", { 
      token, 
      type, 
      email, 
      hasSession: !!session,
      url: window.location.href
    });

    if (!email && !token) {
      console.warn("No email or token found in URL");
    }
  }, [token, type, email, session]);

  // Redirect if user is already logged in and there's no token to verify
  if (session && !token) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    if (token && type === "signup") {
      const verifyToken = async () => {
        try {
          setVerifying(true);
          setError("");
          
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          });

          if (error) throw error;
          
          setVerified(true);
          setProgress(100);
          
          toast({
            title: "Email verified successfully",
            description: "Your account has been verified. Redirecting to homepage...",
            variant: "default",
          });
          
          setTimeout(() => {
            navigate("/");
          }, 3000);
          
        } catch (error: any) {
          setError(error.message);
          setProgress(100);
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setVerifying(false);
        }
      };

      verifyToken();
    }
  }, [token, type, navigate, toast]);

  useEffect(() => {
    if (!token && !verified && !showResendButton) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          const increment = prevProgress < 90 ? 10 : 2;
          const newProgress = Math.min(prevProgress + increment, 100);
          
          if (newProgress === 100) {
            clearInterval(timer);
            setTimeout(() => {
              setShowResendButton(true);
            }, 500);
          }
          
          return newProgress;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [token, verified, showResendButton]);

  const handleResendConfirmation = async () => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      
      setProgress(0);
      setShowResendButton(false);
      setError("");
      
      console.log("Resending confirmation to:", email);
      
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Confirmation email resent",
        description: "Please check your inbox for the confirmation link",
      });
      
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Failed to resend confirmation",
        description: error.message,
        variant: "destructive",
      });
      setShowResendButton(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {verified ? "Email Verified" : "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {verified 
                ? "Your email has been verified successfully"
                : token && verifying
                  ? "Verifying your email..."
                  : "Please check your inbox to confirm your email address"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!token && !verified && (
              <>
                <div className="flex justify-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-5 mb-4">
                    <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-600 dark:text-blue-400">
                    A confirmation email has been sent to <strong>{email}</strong>. 
                    Click the link in the email to verify your account.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <p className="text-sm text-center text-muted-foreground">
                    Waiting for confirmation...
                  </p>
                  <Progress value={progress} className="h-2" />
                </div>
              </>
            )}
            
            {token && verifying && (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-center text-muted-foreground">Verifying your email...</p>
                <Progress value={progress} className="h-2 w-full mt-4" />
              </div>
            )}
            
            {verified && (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-center">You'll be redirected to the homepage in a few seconds.</p>
                <Progress value={progress} className="h-2 w-full mt-4" />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            {showResendButton && !verified && (
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleResendConfirmation}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Resend Confirmation Email
              </Button>
            )}
            
            <Button 
              variant="link" 
              className="w-full"
              onClick={() => navigate("/signin")}
            >
              Return to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
