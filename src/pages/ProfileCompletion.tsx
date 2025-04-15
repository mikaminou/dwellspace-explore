import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth";
import { authService } from "@/contexts/auth/authService";
import { ProfileCompletionForm } from "@/components/auth/ProfileCompletionForm";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileCompletionPage() {
  const [error, setError] = useState("");
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const handleComplete = async (profileData: {
    first_name: string;
    last_name: string;
    role: string;
    phone_number?: string;
  }) => {
    if (!session || !session.user) {
      setError("Not authenticated. Please sign in again.");
      return;
    }
    
    try {
      // Create profile with the data from the form
      await authService.createProfile(session.user.id, profileData);
      
      // Navigate to profile page after successful completion
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create profile");
    }
  };
  
  // If not authenticated, redirect to sign in
  if (!session) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-center">
              Please provide some additional information to complete your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ErrorAlert error={error} />
            <InfoAlert message="Fields marked with an asterisk (*) are required" />
            <ProfileCompletionForm onComplete={handleComplete} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground"
            >
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

function ErrorAlert({ error }: { error: string }) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <Info className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

function InfoAlert({ message }: { message: string }) {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}