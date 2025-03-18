
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
    if (isLoaded && !session) {
      navigate("/signin");
      return;
    }

    if (isLoaded && isProfileLoaded && !isSellerOrAgent) {
      toast.error("Only sellers and agents can create property listings");
      navigate("/dashboard");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded, isSellerOrAgent]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="container mx-auto py-8">
          {isSellerOrAgent && <PropertyForm />}
        </div>
      </ProtectedRoute>
    );
}
