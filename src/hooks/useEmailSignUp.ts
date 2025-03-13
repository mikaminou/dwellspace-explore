
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export function useEmailSignUp(onError: (message: string) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    onError(""); // Clear any previous errors in parent component
    
    if (password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      onError(errorMsg);
      return;
    }

    try {
      setLoading(true);
      console.log("Starting signup process for:", email);
      
      try {
        const result = await signUp(email, password, displayName, userRole);
        console.log("Signup result:", result);

        // Check if confirmation is required
        if (result?.confirmationRequired) {
          console.log("Confirmation required, proceeding with navigation");
          setConfirmationSent(true);
          
          // Encode email for URL
          const encodedEmail = encodeURIComponent(email);
          
          // Log the exact URL we're trying to navigate to
          const redirectUrl = `/email-confirmation?email=${encodedEmail}`;
          console.log("Attempting to navigate to:", redirectUrl);
          
          // Force navigation with a slight delay to ensure state updates complete
          setTimeout(() => {
            console.log("Executing delayed navigation now");
            // Use replace to prevent back button from returning to signup
            window.location.replace(redirectUrl);
          }, 100);
          
          return result;
        }

        return result;
      } catch (error: any) {
        // Check if it's a rate limit error
        if (error.message && error.message.includes("rate limit exceeded")) {
          console.log("Email rate limit detected, switching to demo mode");
          setDemoMode(true);
          setConfirmationSent(true);
          
          // Show toast notification about demo mode
          toast({
            title: "Using demo mode",
            description: "Email rate limit exceeded. Using demo mode to bypass email verification.",
          });
          
          // Navigate to email confirmation page with demo flag
          const encodedEmail = encodeURIComponent(email);
          const redirectUrl = `/email-confirmation?email=${encodedEmail}&demo=true`;
          console.log("Navigating to demo confirmation page:", redirectUrl);
          
          setTimeout(() => {
            window.location.replace(redirectUrl);
          }, 100);
          
          return { confirmationRequired: true, demoMode: true };
        } else {
          // Re-throw for other errors
          throw error;
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account.";
      console.error("Signup error:", error);
      onError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    userRole,
    setUserRole,
    loading,
    confirmationSent,
    showPassword,
    demoMode,
    handleSubmit,
    togglePasswordVisibility
  };
}
