
import { useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { PropertyForm } from "@/components/owners/PropertyForm";
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
    // Log the current auth and profile state for debugging
    console.log("Auth state:", { session, isLoaded });
    console.log("Profile state:", { profileData, isProfileLoaded, userRole });
    
    if (isLoaded && !session) {
      toast.error("Please sign in to create a property listing");
      navigate("/signin");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded, userRole, isSellerOrAgent, profileData]);

  return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto py-6 px-4">
          <PropertyForm useGoogleMaps={true} />
        </main>
      </div>
  );
}
