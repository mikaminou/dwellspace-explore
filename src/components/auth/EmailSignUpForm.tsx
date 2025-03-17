
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { PasswordField } from "./PasswordField";
import { RoleSelector } from "./RoleSelector";
import { useEmailSignUp } from "@/hooks/useEmailSignUp";
import { useState } from "react";

interface EmailSignUpFormProps {
  onError: (message: string) => void;
}

export function EmailSignUpForm({ onError }: EmailSignUpFormProps) {
  const {
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
    loading,
    confirmationSent,
    showPassword,
    demoMode,
    handleSubmit,
    togglePasswordVisibility
  } = useEmailSignUp(onError);

  const [error, setError] = useState("");

  const handleLocalError = (message: string) => {
    setError(message);
    onError(message);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, attempting sign up with email:", email);
    
    // Clear any existing errors
    setError("");
    
    // Validate required fields based on role
    if (userRole === 'agent' && !agency.trim()) {
      handleLocalError("Agency name is required for agents");
      return;
    }
    
    if (userRole === 'agent' && !licenseNumber.trim()) {
      handleLocalError("License number is required for agents");
      return;
    }
    
    try {
      // Let useEmailSignUp handle all navigation logic
      await handleSubmit(e);
    } catch (err: any) {
      console.error("Signup error:", err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="Your name" 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          disabled={loading || confirmationSent}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="your@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading || confirmationSent}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordField
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          disabled={loading || confirmationSent}
        />
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters long
        </p>
      </div>
      
      <RoleSelector 
        userRole={userRole} 
        setUserRole={setUserRole}
        agency={agency}
        setAgency={setAgency}
        licenseNumber={licenseNumber}
        setLicenseNumber={setLicenseNumber}
        disabled={loading || confirmationSent}
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || confirmationSent}
      >
        {loading ? "Creating account..." : 
         confirmationSent ? (demoMode ? "Demo Mode Active" : "Confirmation Email Sent") : 
         "Create Account"}
      </Button>
    </form>
  );
}
