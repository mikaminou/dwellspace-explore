
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { signUp } = useAuth();
  const navigate = useNavigate();
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
      const result = await signUp(email, password, displayName, userRole);

      // Check if confirmation is required
      if (result?.confirmationRequired) {
        setConfirmationSent(true); // Update confirmation state
        
        // Encode email for URL and log for debugging
        const encodedEmail = encodeURIComponent(email);
        console.log("Navigating to email confirmation page with email:", encodedEmail);
        
        // Force navigation with replace to prevent back navigation
        setTimeout(() => {
          navigate(`/email-confirmation?email=${encodedEmail}`, { replace: true });
        }, 100); // Small delay to ensure state updates complete
        
        return result;
      }

      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account.";
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
    handleSubmit,
    togglePasswordVisibility
  };
}
