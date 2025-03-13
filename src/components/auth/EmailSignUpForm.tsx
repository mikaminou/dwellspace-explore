
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { PasswordField } from "./PasswordField";
import { RoleSelector } from "./RoleSelector";
import { useEmailSignUp } from "@/hooks/useEmailSignUp";

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
    loading,
    confirmationSent,
    showPassword,
    handleSubmit,
    togglePasswordVisibility
  } = useEmailSignUp(onError);

  const [error, setError] = useState("");
  
  const handleLocalError = (message: string) => {
    setError(message);
    onError(message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
      </div>
      
      <RoleSelector 
        userRole={userRole} 
        setUserRole={setUserRole} 
        disabled={loading || confirmationSent}
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || confirmationSent}
      >
        {loading ? "Creating account..." : confirmationSent ? "Confirmation Email Sent" : "Create Account"}
      </Button>
    </form>
  );
}

// Add the missing import at the top to fix build error
import { useState } from "react";
