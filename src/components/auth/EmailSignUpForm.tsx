
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface EmailSignUpFormProps {
  onError: (message: string) => void;
}

export function EmailSignUpForm({ onError }: EmailSignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userRole, setUserRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      onError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      setLoading(true);
      const result = await signUp(email, password, displayName, userRole);
      
      // Check if confirmation is required
      if (result?.confirmationRequired) {
        setConfirmationSent(true);
      } else {
        navigate("/");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account.";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {confirmationSent && (
        <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-600 dark:text-green-400">
            <strong>Confirmation email sent!</strong> Please check your inbox and confirm your email address to complete the registration.
          </AlertDescription>
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
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || confirmationSent}
        />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">I am a</Label>
        <Select 
          value={userRole} 
          onValueChange={setUserRole}
          disabled={loading || confirmationSent}
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
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || confirmationSent}
      >
        {loading ? "Creating account..." : confirmationSent ? "Confirmation Email Sent" : "Create Account"}
      </Button>
      
      {confirmationSent && (
        <p className="text-sm text-center text-muted-foreground mt-4">
          Didn't receive the email? Check your spam folder or{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            disabled={loading}
          >
            resend confirmation
          </Button>
        </p>
      )}
    </form>
  );
}
