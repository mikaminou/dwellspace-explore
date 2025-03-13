
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setConfirmationSent(true);
        
        // Log navigation attempt for debugging
        console.log("Attempting navigation to email confirmation page");
        
        // Force immediate navigation to confirmation page
        navigate(`/email-confirmation?email=${encodeURIComponent(email)}`, { replace: true });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account.";
      onError(errorMessage);
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
