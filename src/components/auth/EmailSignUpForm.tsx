
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { PasswordField } from "./PasswordField";
import { RoleSelector } from "./RoleSelector";
import { useEmailSignUp } from "@/hooks/useEmailSignUp";
import { useState } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";

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
    demoMode,
    handleSubmit,
    togglePasswordVisibility
  } = useEmailSignUp(onError);

  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleLocalError = (message: string) => {
    setError(message);
    onError(message);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, attempting sign up with email:", email);
    
    // Clear any existing errors
    setError("");
    
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
        <Label htmlFor="name">{t('name.label')}</Label>
        <Input 
          id="name" 
          placeholder={t('name.placeholder')} 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          disabled={loading || confirmationSent}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('email.label')}</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder={t('email.placeholder')} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading || confirmationSent}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('password.label')}</Label>
        <PasswordField
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          disabled={loading || confirmationSent}
        />
        <p className="text-xs text-muted-foreground">{t('password.requirement')}</p>
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
        {loading ? t('signup.creating') : confirmationSent ? (demoMode ? t('signup.demoActive') : t('signup.emailSent')) : t('signup.button')}
      </Button>
    </form>
  );
}
