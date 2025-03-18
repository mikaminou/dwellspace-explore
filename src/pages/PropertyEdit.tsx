
import { MainNav } from "@/components/MainNav";
import { PropertyForm } from "@/components/owners/PropertyForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/auth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PropertyEdit() {
  const { session, isLoaded } = useAuth();
  const { profileData, isLoaded: isProfileLoaded } = useProfile();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get user role from profile data
  const userRole = profileData?.role || "buyer"; // Default to buyer if no role found
  const isSellerOrAgent = ["seller", "agent", "admin"].includes(userRole);

  useEffect(() => {
    // Log the current auth and profile state for debugging
    console.log("Edit page - Auth state:", { session, isLoaded });
    console.log("Edit page - Profile state:", { profileData, isProfileLoaded, userRole });
    
    if (isLoaded && !session) {
      toast.error("Please sign in to edit a property listing");
      navigate("/signin");
      return;
    }
    
    if (isLoaded && isProfileLoaded && !isSellerOrAgent) {
      toast.error("Only sellers and agents can edit property listings");
      navigate("/");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded, userRole, isSellerOrAgent, profileData]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto py-6 px-4">
          <PropertyForm propertyId={id} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
