
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

  useEffect(() => {
    if (isLoaded && !session) {
      toast.error("Please sign in to edit a property listing");
      navigate("/signin");
      return;
    }
    
    if (isLoaded && isProfileLoaded) {
      toast.error("Only sellers and agents can edit property listings");
      navigate("/");
      return;
    }
  }, [session, isLoaded, navigate, isProfileLoaded, profileData]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="container mx-auto py-6 px-4">
          {id && <PropertyForm id={id} useGoogleMaps={true} />}
        </main>
      </div>
    </ProtectedRoute>
  );
}
