
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth";
import { authService } from "@/contexts/auth/authService";
import { toast } from "sonner";
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
    agency?: string;
    license_number?: string;
    phone_number?: string;
    bio?: string;
  }) => {
    if (!session || !session.user) {
      setError("Not authenticated. Please sign in again.");
      return;
    }
    
    try {
      // Create profile with the data from the form
      await authService.createProfile(session.user.id, profileData);
      
      // Navigate to profile page after successful completion
      navigate("/profile");
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
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="container mx-auto flex justify-center items-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-center">
              Please provide some additional information to complete your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-600 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Fields marked with an asterisk (*) are required
              </AlertDescription>
            </Alert>
            
            <ProfileCompletionForm onComplete={handleComplete} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground"
            >
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
