import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Info, Loader2, Mail, RefreshCw, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserRole } from "@/contexts/auth/types";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const email = searchParams.get("email") || "";
  const roleFromUrl = searchParams.get("role") || "";
  const pendingConfirmation = searchParams.get("pendingConfirmation") === "true";
  
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const { session } = useAuth();
  
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [sendingConfirmation, setSendingConfirmation] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (roleFromUrl || "buyer") as UserRole
  );
  const [creatingProfile, setCreatingProfile] = useState(false);

  useEffect(() => {
    console.log("Email confirmation page loaded with params:", { 
      token, 
      type, 
      email, 
      role: roleFromUrl,
      pendingConfirmation,
      hasSession: !!session,
      url: window.location.href
    });

    if (!email && !token && !pendingConfirmation) {
      console.warn("No email, token, or pending confirmation found in URL");
    }
    
    if (token && type === "signup") {
      verifyToken();
    }
  }, [token, type, email, pendingConfirmation, session]);

  if (session && !token && !pendingConfirmation) {
    return <Navigate to="/" />;
  }

  const validateRole = (role: string): UserRole => {
    const validRoles: UserRole[] = ["buyer", "seller", "agent", "admin"];
    return validRoles.includes(role as UserRole) ? role as UserRole : "buyer";
  };

  const verifyToken = async () => {
    try {
      setVerifying(true);
      setError("");
      
      const storedRole = localStorage.getItem('user_selected_role') || selectedRole || "buyer";
      console.log("Stored role:", storedRole);
      
      const validatedRole = validateRole(storedRole);
      
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "signup",
      });

      if (error) throw error;
      
      setVerified(true);
      setProgress(100);
      
      try {
        setCreatingProfile(true);
        
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (userData && userData.user) {
          await supabase.from('profiles').upsert({
            id: userData.user.id,
            role: validatedRole,
            updated_at: new Date().toISOString()
          });
          
          localStorage.removeItem('user_selected_role');
          
          toast.success("Email verified and profile created successfully");
          
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        }
      } catch (profileError: any) {
        console.error("Error creating profile:", profileError);
        toast.error(`Failed to create profile: ${profileError.message}`);
      } finally {
        setCreatingProfile(false);
      }
      
    } catch (error: any) {
      setError(error.message);
      setProgress(100);
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleSendConfirmation = async () => {
    if (!email) {
      setError("Email is required to send confirmation");
      return;
    }
    
    localStorage.setItem('user_selected_role', selectedRole);
    
    try {
      setSendingConfirmation(true);
      setError("");
      
      navigate(`/profile-completion?email=${encodeURIComponent(email)}&role=${encodeURIComponent(selectedRole)}`);
      
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSendingConfirmation(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      
      setProgress(0);
      setError("");
      
      console.log("Resending confirmation to:", email);
      console.log("With role:", selectedRole);
      
      navigate(`/profile-completion?email=${encodeURIComponent(email)}&role=${encodeURIComponent(selectedRole)}`);
      
    } catch (error: any) {
      setError(error.message);
      toast.error(`Failed to resend confirmation: ${error.message}`);
    }
  };

  const RoleSelector = () => (
    <div className="space-y-2">
      <Label htmlFor="role">I am a</Label>
      <Select 
        value={selectedRole} 
        onValueChange={(value) => setSelectedRole(value as UserRole)}
      >
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
  );

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {verified ? "Email Verified" : 
               pendingConfirmation && !confirmationSent ? "Confirm Your Email" : 
               "Verify Your Email"}
            </CardTitle>
            <CardDescription className="text-center">
              {verified 
                ? "Your email has been verified successfully"
                : token && verifying
                  ? "Verifying your email..."
                  : pendingConfirmation && !confirmationSent
                    ? "Select your role and click the button below to send a confirmation email"
                    : "Please check your inbox to confirm your email address"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {pendingConfirmation && !confirmationSent && !token && !verified && (
              <>
                <div className="flex justify-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full p-5 mb-4">
                    <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-600 dark:text-blue-400">
                    Your account has been created. To complete registration, select your role and click the button below 
                    to send a confirmation email to <strong>{email}</strong>.
                  </AlertDescription>
                </Alert>
                
                <RoleSelector />
                
                <Button 
                  className="w-full" 
                  onClick={handleSendConfirmation}
                  disabled={sendingConfirmation}
                >
                  {sendingConfirmation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Confirmation Email
                    </>
                  )}
                </Button>
              </>
            )}
            
            {confirmationSent && !token && !verified && (
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
                
                {progress === 100 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleResendConfirmation}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Resend Confirmation Email
                  </Button>
                )}
              </>
            )}
            
            {token && verifying && (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-center text-muted-foreground">
                  {creatingProfile ? "Creating your profile..." : "Verifying your email..."}
                </p>
                <Progress value={progress} className="h-2 w-full mt-4" />
              </div>
            )}
            
            {verified && (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-center">You'll be redirected to your profile in a few seconds.</p>
                <Progress value={progress} className="h-2 w-full mt-4" />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
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
