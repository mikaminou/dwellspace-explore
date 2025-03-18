
import { useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { PropertyForm } from "@/components/owners/PropertyForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/auth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PropertyCreate() {
  const { session, isLoaded } = useAuth();
  const { profileData, isLoaded: isProfileLoaded } = useProfile();
  const navigate = useNavigate();
  
  // Get user role from profile data
  const userRole = profileData?.role || "buyer"; // Default to buyer if no role found
  const isSellerOrAgent = ["seller", "agent", "admin"].includes(userRole);

  useEffect(() => {
    console.log("PropertyCreate: Auth state", { session, isLoaded, profileData, isProfileLoaded, userRole, isSellerOrAgent });
    
    if (isLoaded && !session) {
      console.log("No session, redirecting to signin");
      navigate("/signin");
      return;
    }
    
    // Only check role after profile data is loaded
    if (isProfileLoaded) {
      console.log("Profile loaded, checking role:", userRole);
      if (!isSellerOrAgent) {
        console.log("User is not seller/agent, redirecting");
        toast.error("Only sellers and agents can create properties");
        navigate("/dashboard");
      }
    }
  }, [session, isLoaded, navigate, isProfileLoaded, isSellerOrAgent, userRole]);

  // Show loading state while profile data is loading
  if (!isProfileLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Only render the form if user is a seller or agent
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto py-6 px-4">
          { <PropertyForm />}
        </main>
      </div>
    </ProtectedRoute>
  );
}
