
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";

export function useEmailSignUp(onError: (message: string) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("buyer");
  const [agency, setAgency] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Show/hide agency field based on role
  const [showAgencyField, setShowAgencyField] = useState(false);
  const [showLicenseField, setShowLicenseField] = useState(false);
  
  useEffect(() => {
    setShowAgencyField(userRole === 'agent' || userRole === 'seller');
    setShowLicenseField(userRole === 'agent');
  }, [userRole]);

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

    // Validate agency name for agents only (required)
    if (userRole === 'agent' && !agency.trim()) {
      const errorMsg = "Agency name is required for agents";
      onError(errorMsg);
      return;
    }

    // Validate license number for agents
    if (userRole === 'agent' && !licenseNumber.trim()) {
      const errorMsg = "License number is required for agents";
      onError(errorMsg);
      return;
    }

    // Ensure userRole is one of the allowed values that match our user_role type in the database
    const validRoles = ["buyer", "seller", "agent", "admin"];
    if (!validRoles.includes(userRole)) {
      const errorMsg = "Invalid role selected";
      onError(errorMsg);
      return;
    }

    try {
      setLoading(true);
      console.log("Starting signup process for:", email);
      console.log("Selected role:", userRole);
      
      try {
        const result = await signUp(
          email, 
          password, 
          displayName, 
          userRole, 
          agency, 
          licenseNumber
        );
        console.log("Signup result:", result);

        // Account created successfully but confirmation needed
        setRegistrationComplete(true);
        
        // Navigate to confirmation page without sending email yet
        const encodedEmail = encodeURIComponent(email);
        navigate(`/email-confirmation?email=${encodedEmail}&pendingConfirmation=true`);
        
        return result;
      } catch (error: any) {
        // Check if it's a rate limit error
        if (error.message && error.message.includes("rate limit exceeded")) {
          console.log("Email rate limit detected, switching to demo mode");
          setDemoMode(true);
          setRegistrationComplete(true);
          
          // Show toast notification about demo mode
          toast({
            title: "Using demo mode",
            description: "Email rate limit exceeded. Using demo mode to bypass email verification.",
          });
          
          // Navigate to email confirmation page with demo flag
          const encodedEmail = encodeURIComponent(email);
          const redirectUrl = `/email-confirmation?email=${encodedEmail}&demo=true`;
          console.log("Navigating to demo confirmation page:", redirectUrl);
          
          navigate(redirectUrl);
          
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
    agency,
    setAgency,
    licenseNumber,
    setLicenseNumber,
    showAgencyField,
    showLicenseField,
    loading,
    registrationComplete,
    showPassword,
    demoMode,
    handleSubmit,
    togglePasswordVisibility
  };
}
