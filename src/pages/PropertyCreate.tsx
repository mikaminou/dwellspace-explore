
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
    if (isLoaded && isProfileLoaded && session) {
      // Redirect buyers to profile page since they can't create properties
      if (!isSellerOrAgent) {
        toast.info("Only sellers and agents can create property listings");
        navigate("/profile");
      }
    }
  }, [session, isLoaded, navigate, isProfileLoaded, isSellerOrAgent]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MainNav />
        {isSellerOrAgent && <PropertyForm />}
      </div>
    </ProtectedRoute>
  );
}
